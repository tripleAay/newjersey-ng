import {
  loadDocument,
  DocumentError,
} from "@/app/lib/newjersey/documents/load";
import { renderDocument } from "@/app/lib/newjersey/documents/render";
import { kinds, type DocumentKind } from "@/app/lib/newjersey/documents/model";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; kind: string }> },
) {
  const { id, kind } = await params;
  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
  if (!kinds.includes(kind as DocumentKind))
    return new Response("Document not found.", { status: 404, headers });
  try {
    const data = await loadDocument(id, kind as DocumentKind);
    const bytes = await renderDocument(kind as DocumentKind, data);
    const reference =
      data.order.order_number.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) ||
      "order";
    return new Response(Buffer.from(bytes), {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="NewJersey-${reference}-${kind}.pdf"`,
      },
    });
  } catch (error) {
    if (error instanceof DocumentError)
      return new Response(error.message, { status: error.status, headers });
    console.error("[PDF download]", error);
    return new Response(
      "We could not generate this PDF. Please try again or contact hello@newjersey.ng.",
      { status: 503, headers },
    );
  }
}
