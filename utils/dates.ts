export function fmt(ts?: any) {
  try {
    if (!ts?.toDate) return "";
    const d = ts.toDate() as Date;
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}