import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isFinite(date.getTime())
    ? dateFormatter.format(date)
    : "Date unavailable";
}

function label(value: string) {
  return value.replaceAll("-", " ");
}

export default async function ArtworkReviewHistory({
  artworkId,
}: {
  artworkId: string;
}) {
  // Used only within the admin-authorized artwork page.
  const supabase = getSupabaseAdmin();

  const { data, count, error } = await supabase
    .from("artwork_review_history")
    .select(
      "id, admin_name, action, previous_status, new_status, previous_notes, new_notes, created_at",
      { count: "exact" }
    )
    .eq("artwork_id", artworkId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[Artwork review history]", error);

    return (
      <p className="mt-5 text-sm text-red-700">
        Review history could not be loaded.
      </p>
    );
  }

  return (
    <details className="mt-6 border-t border-black/10 pt-4">
      <summary className="cursor-pointer rounded-sm py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]">
        Review history ({count ?? 0})
      </summary>

      {!data?.length ? (
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          No recorded edits yet. The next change will
          preserve the current feedback and its replacement.
        </p>
      ) : (
        <>
          {(count ?? 0) > 20 && (
            <p className="mt-3 text-xs text-neutral-500">
              Showing the latest 20 entries. All entries
              remain stored in the database.
            </p>
          )}

          <ol className="mt-4 space-y-4">
            {data.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-black/10 bg-[#F6F6F3] p-4"
              >
                <p className="text-sm font-medium">
                  {entry.action === "feedback"
                    ? "Feedback edited"
                    : `Status changed to ${label(entry.new_status)}`}
                </p>

                <p className="mt-1 text-xs leading-6 text-neutral-500">
                  {entry.admin_name} · {formatDate(entry.created_at)}
                </p>

                <p className="mt-2 text-xs capitalize text-neutral-600">
                  {label(entry.previous_status)} →{" "}
                  {label(entry.new_status)}
                </p>

                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium">Previous feedback</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words leading-7 text-neutral-600">
                      {entry.previous_notes || "No feedback"}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium">Saved feedback</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words leading-7 text-neutral-600">
                      {entry.new_notes || "No feedback"}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </>
      )}
    </details>
  );
}