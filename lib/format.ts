// Event dates are anchored to the school's local timezone (Eastern) so the
// displayed day/time never drifts based on where the visitor (or server) is.
const TZ = "America/New_York";

export const MON = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Calendar-relevant parts of a timestamp, evaluated in the event timezone. */
export function parts(iso: string) {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    weekday: "short",
    hour12: true,
  });
  const map: Record<string, string> = {};
  for (const p of f.formatToParts(d)) map[p.type] = p.value;
  return {
    year: Number(map.year),
    month: Number(map.month) - 1, // 0-indexed
    day: Number(map.day),
    weekday: map.weekday, // "Mon"
    hour: map.hour,
    minute: map.minute,
    dayPeriod: (map.dayPeriod || "").toUpperCase(),
  };
}

export function fmtTime(iso: string) {
  const p = parts(iso);
  return `${p.hour}:${p.minute} ${p.dayPeriod}`;
}

export function fmtDay(iso: string) {
  const p = parts(iso);
  return `${MON[p.month]} ${p.day}, ${p.year}`;
}

export function initials(name: string) {
  return name
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function rangeFrom(showtimes: { starts_at: string }[]) {
  if (!showtimes.length) return "TBA";
  const a = parts(showtimes[0].starts_at);
  const b = parts(showtimes[showtimes.length - 1].starts_at);
  if (a.year === b.year && a.month === b.month && a.day === b.day)
    return `${MON[a.month]} ${a.day}, ${a.year}`;
  return `${MON[a.month]} ${a.day} – ${MON[b.month]} ${b.day}, ${b.year}`;
}
