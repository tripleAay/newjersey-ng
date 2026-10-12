export function safeDestination(value: unknown): string | null {
  if (typeof value !== "string") return null;

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[%\\\s]/.test(value)
  ) {
    return null;
  }

  const path = value.split(/[?#]/, 1)[0];

  if (
    path.split("/").some((part) => part === "." || part === "..")
  ) {
    return null;
  }

  if (
    path === "/shop" ||
    path.startsWith("/shop/") ||
    path === "/admin" ||
    path.startsWith("/admin/")
  ) {
    return value;
  }

  return null;
}