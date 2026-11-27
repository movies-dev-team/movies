export function formatDate(date: string | null): string {
  if (!date) return "";

  const parsedDate = new Date(date);

  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return formatter.format(parsedDate);
}