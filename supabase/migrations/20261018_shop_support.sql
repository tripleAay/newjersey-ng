-- NewJersey: private, authenticated support. No anonymous message access.
BEGIN;
CREATE TABLE IF NOT EXISTS public.support_threads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 customer_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
 customer_name text NOT NULL DEFAULT 'Customer' CHECK(char_length(customer_name) BETWEEN 1 AND 120),
 status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
 customer_read_at timestamptz,
 admin_read_at timestamptz,
 last_customer_at timestamptz,
 last_admin_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE public.support_threads ADD COLUMN IF NOT EXISTS customer_name text NOT NULL DEFAULT 'Customer';
CREATE TABLE IF NOT EXISTS public.support_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 thread_id uuid NOT NULL REFERENCES public.support_threads(id) ON DELETE CASCADE,
 sender_id uuid NOT NULL REFERENCES auth.users(id),
 sender_role text NOT NULL CHECK(sender_role IN ('customer','admin')),
 body text NOT NULL CHECK(char_length(btrim(body)) BETWEEN 1 AND 3000),
 request_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(thread_id,request_id)
);
CREATE INDEX IF NOT EXISTS support_threads_updated ON public.support_threads(updated_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS support_messages_thread_created ON public.support_messages(thread_id,created_at DESC,id DESC);
ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.support_threads,public.support_messages FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.support_threads,public.support_messages TO service_role;

CREATE OR REPLACE FUNCTION public.send_support_message(p_customer_id uuid,p_sender_id uuid,p_sender_role text,p_body text,p_request_id uuid)
RETURNS uuid LANGUAGE plpgsql SET search_path='' AS $$
DECLARE t public.support_threads%ROWTYPE; v_id uuid; v_time timestamptz; v_limit integer;
BEGIN
 IF p_customer_id IS NULL OR p_sender_id IS NULL OR p_request_id IS NULL OR p_sender_role IS NULL OR p_sender_role NOT IN ('customer','admin') OR char_length(btrim(coalesce(p_body,''))) NOT BETWEEN 1 AND 3000 OR p_body ~ '[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]' THEN RAISE EXCEPTION 'Check your message.'; END IF;
 IF p_sender_role='customer' AND p_sender_id IS DISTINCT FROM p_customer_id THEN RAISE EXCEPTION 'Access denied.'; END IF;
 IF p_sender_role='admin' AND NOT EXISTS(SELECT 1 FROM public.admin_users WHERE id=p_sender_id AND active=true AND role IN ('owner','admin')) THEN RAISE EXCEPTION 'Access denied.'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('support:'||p_customer_id::text,0));
 INSERT INTO public.support_threads(customer_id) VALUES(p_customer_id) ON CONFLICT(customer_id) DO NOTHING;
 SELECT * INTO t FROM public.support_threads WHERE customer_id=p_customer_id FOR UPDATE;
 SELECT id INTO v_id FROM public.support_messages WHERE thread_id=t.id AND request_id=p_request_id;
 IF FOUND THEN RETURN t.id; END IF;
 v_limit := CASE WHEN p_sender_role='customer' THEN 5 ELSE 20 END;
 IF (SELECT count(*) FROM public.support_messages WHERE thread_id=t.id AND sender_id=p_sender_id AND created_at > clock_timestamp()-interval '1 minute') >= v_limit THEN RAISE EXCEPTION 'Please wait a minute before sending more messages.'; END IF;
 IF p_sender_role='customer' AND (SELECT count(*) FROM public.support_messages WHERE thread_id=t.id AND sender_id=p_sender_id AND created_at > clock_timestamp()-interval '1 day') >= 100 THEN RAISE EXCEPTION 'Please contact us by email for further help today.'; END IF;
 v_time := clock_timestamp();
 INSERT INTO public.support_messages(thread_id,sender_id,sender_role,body,request_id,created_at) VALUES(t.id,p_sender_id,p_sender_role,btrim(p_body),p_request_id,v_time);
 UPDATE public.support_threads SET status='open',updated_at=v_time,
 last_customer_at=CASE WHEN p_sender_role='customer' THEN v_time ELSE last_customer_at END,
 last_admin_at=CASE WHEN p_sender_role='admin' THEN v_time ELSE last_admin_at END WHERE id=t.id;
 RETURN t.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_support_read(p_thread_id uuid,p_actor_id uuid,p_actor_role text,p_message_id uuid)
RETURNS void LANGUAGE plpgsql SET search_path='' AS $$
DECLARE t public.support_threads%ROWTYPE; v_time timestamptz;
BEGIN
 SELECT * INTO t FROM public.support_threads WHERE id=p_thread_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Conversation not found.'; END IF;
 IF p_actor_role='customer' THEN
  IF t.customer_id IS DISTINCT FROM p_actor_id THEN RAISE EXCEPTION 'Access denied.'; END IF;
 ELSIF p_actor_role='admin' THEN
  IF NOT EXISTS(SELECT 1 FROM public.admin_users WHERE id=p_actor_id AND active=true AND role IN ('owner','admin')) THEN RAISE EXCEPTION 'Access denied.'; END IF;
 ELSE RAISE EXCEPTION 'Access denied.'; END IF;
 SELECT created_at INTO v_time FROM public.support_messages WHERE id=p_message_id AND thread_id=t.id;
 IF NOT FOUND THEN RAISE EXCEPTION 'Message not found.'; END IF;
 UPDATE public.support_threads SET
 customer_read_at=CASE WHEN p_actor_role='customer' THEN greatest(customer_read_at,v_time) ELSE customer_read_at END,
 admin_read_at=CASE WHEN p_actor_role='admin' THEN greatest(admin_read_at,v_time) ELSE admin_read_at END WHERE id=t.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.support_unread_count()
RETURNS bigint LANGUAGE sql STABLE SET search_path='' AS $$
 SELECT count(*) FROM public.support_threads WHERE last_customer_at IS NOT NULL AND (admin_read_at IS NULL OR last_customer_at > admin_read_at);
$$;
REVOKE ALL ON FUNCTION public.send_support_message(uuid,uuid,text,text,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mark_support_read(uuid,uuid,text,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.support_unread_count() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.send_support_message(uuid,uuid,text,text,uuid), public.mark_support_read(uuid,uuid,text,uuid), public.support_unread_count() TO service_role;
COMMIT;
