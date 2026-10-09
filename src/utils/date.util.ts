export function formatDate(
  date?: string | Date | null,
  fallback: string = "N/A",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  if (!date) return fallback;

  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (Number.isNaN(parsedDate.getTime())) {
      return fallback;
    }

    return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
  } catch {
    return fallback;
  }
}

export function formatDateTime(
  date?: string | Date | null,
  fallback: string = "N/A",
): string {
  return formatDate(date, fallback, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function toISODateInput(date?: string | Date | null): string {
  if (!date) return "";

  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toISOString().split("T")[0];
  } catch {
    return "";
  }
}
