"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MON, MONTHS, parts, fmtTime } from "@/lib/format";

export type CalEvent = {
  slug: string;
  title: string;
  starts_at: string;
  label: string | null;
};

export default function Calendar({ events }: { events: CalEvent[] }) {
  const router = useRouter();
  const now = useMemo(() => new Date().toISOString(), []);
  const nowParts = parts(now);

  // Pre-compute the timezone-correct calendar parts for every event once.
  const ev = useMemo(
    () => events.map((e) => ({ ...e, p: parts(e.starts_at) })),
    [events],
  );

  // Start on the first upcoming event's month (else first event, else now).
  const initial = useMemo(() => {
    const upcoming = ev.find((e) => e.starts_at >= now) ?? ev[0];
    const p = upcoming ? upcoming.p : nowParts;
    return { y: p.year, m: p.month };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ev]);

  const [cal, setCal] = useState(initial);

  const move = (n: number) => {
    setCal((c) => {
      let m = c.m + n;
      let y = c.y;
      if (m < 0) {
        m = 11;
        y--;
      }
      if (m > 11) {
        m = 0;
        y++;
      }
      return { y, m };
    });
  };

  const byDay: Record<number, typeof ev> = {};
  for (const e of ev) {
    if (e.p.year === cal.y && e.p.month === cal.m) {
      (byDay[e.p.day] = byDay[e.p.day] || []).push(e);
    }
  }

  const firstDow = new Date(Date.UTC(cal.y, cal.m, 1)).getUTCDay();
  const days = new Date(Date.UTC(cal.y, cal.m + 1, 0)).getUTCDate();
  const isToday = (d: number) =>
    nowParts.year === cal.y && nowParts.month === cal.m && nowParts.day === d;

  const upNext = ev.filter((e) => e.starts_at >= now).slice(0, 4);

  return (
    <div className="calwrap">
      <div className="cal">
        <div className="cal-top">
          <h3 id="cal-title">
            {MONTHS[cal.m]} {cal.y}
          </h3>
          <div className="cal-nav">
            <button onClick={() => move(-1)} aria-label="Previous month">
              ‹
            </button>
            <button onClick={() => move(1)} aria-label="Next month">
              ›
            </button>
          </div>
        </div>
        <div className="cal-grid" id="cal-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div className="dow" key={d}>
              {d}
            </div>
          ))}
          {Array.from({ length: firstDow }).map((_, i) => (
            <div className="day muted" key={`m${i}`} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const d = i + 1;
            const has = byDay[d];
            const today = isToday(d) ? " today" : "";
            if (has) {
              return (
                <div
                  key={d}
                  className={`day has${today}`}
                  title={has[0].title}
                  onClick={() => router.push(`/shows/${has[0].slug}`)}
                >
                  {d}
                  <span className="dot" />
                </div>
              );
            }
            return (
              <div key={d} className={`day${today}`}>
                {d}
              </div>
            );
          })}
        </div>
      </div>

      <div className="upnext">
        <h4>Up Next</h4>
        {upNext.length ? (
          upNext.map((e, i) => (
            <div
              className="evrow"
              key={`${e.slug}-${i}`}
              onClick={() => router.push(`/shows/${e.slug}`)}
            >
              <div className="date">
                <div className="d">{e.p.day}</div>
                <div className="m">{MON[e.p.month]}</div>
              </div>
              <div className="info">
                <b>{e.title}</b>
                <span>
                  {e.label} · {fmtTime(e.starts_at)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="evrow">
            <div className="info">
              <b>Season wrapped</b>
              <span>Check back soon for next season.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
