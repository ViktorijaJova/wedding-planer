"use client";

import { useMemo } from "react";
import { useWeddingTemplate } from "@/components/wedding-template/WeddingTemplateProvider";

function getDaysUntil(dateString: string): number | null {
  const target = new Date(dateString + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export default function WeddingTemplateOverviewPage() {
  const {
    state: { settings, guests, tables, vendors },
  } = useWeddingTemplate();

  function downloadCsv(filename: string, rows: string[][]) {
    if (typeof window === "undefined") return;
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            const safe = cell ?? "";
            if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
              return `"${safe.replace(/"/g, '""')}"`;
            }
            return safe;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportGuests() {
    const header = [
      "Name",
      "Side",
      "Group",
      "Day guest",
      "Save the date sent",
      "Invite sent",
      "RSVP",
      "Plus one",
      "Table",
      "Seat index",
      "Notes",
    ];
    const rows = guests.map((g) => [
      g.name,
      g.side ?? "",
      g.group ?? "",
      g.dayGuest === false ? "Evening only" : "Day guest",
      g.saveTheDateSent ? "Yes" : "No",
      g.inviteSent ? "Yes" : "No",
      g.rsvp,
      g.plusOne ? "Yes" : "No",
      g.tableId ?? "",
      g.seatIndex != null ? String(g.seatIndex + 1) : "",
      g.notes ?? "",
    ]);
    downloadCsv("guests.csv", [header, ...rows]);
  }

  function exportTables() {
    const header = ["Table name", "Capacity", "Guest name", "Seat index"];
    const rows: string[][] = [];
    tables.forEach((table) => {
      guests
        .filter((g) => g.tableId === table.id && g.seatIndex != null)
        .forEach((g) => {
          rows.push([
            table.name,
            String(table.capacity),
            g.name,
            String((g.seatIndex ?? 0) + 1),
          ]);
        });
    });
    downloadCsv("seating.csv", [header, ...rows]);
  }

  function exportVendors() {
    const header = [
      "Name",
      "Category",
      "Contact",
      "Total cost",
      "Amount paid",
      "Due date",
      "Status",
      "Notes",
    ];
    const rows = vendors.map((v) => [
      v.name,
      v.category,
      v.contact ?? "",
      v.totalCost != null ? String(v.totalCost) : "",
      v.amountPaid != null ? String(v.amountPaid) : "",
      v.dueDate ?? "",
      v.status ?? "",
      v.notes ?? "",
    ]);
    downloadCsv("vendors.csv", [header, ...rows]);
  }

  function exportTimeline() {
    const header = ["Time", "Title", "Location", "Who", "Notes"];
    const rows =
      "timeline" in ({} as any)
        ? []
        : []; // placeholder to keep types happy if timeline is extended here later
    downloadCsv("timeline.csv", [header, ...rows]);
  }

  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const saveTheDateSent = guests.filter((g) => g.saveTheDateSent).length;
    const inviteSent = guests.filter((g) => g.inviteSent).length;
    const rsvpYes = guests.filter((g) => g.rsvp === "yes").length;
    const rsvpNo = guests.filter((g) => g.rsvp === "no").length;
    const rsvpMaybe = guests.filter((g) => g.rsvp === "maybe").length;
    const withPlusOne = guests.filter((g) => g.plusOne).length;
    const seated = guests.filter((g) => g.tableId && g.seatIndex != null).length;

    const totalBudget = vendors.reduce(
      (sum, v) => sum + (v.totalCost ?? 0),
      0
    );
    const totalPaid = vendors.reduce(
      (sum, v) => sum + (v.amountPaid ?? 0),
      0
    );

    return {
      totalGuests,
      saveTheDateSent,
      inviteSent,
      rsvpYes,
      rsvpNo,
      rsvpMaybe,
      withPlusOne,
      seated,
      tableCount: tables.length,
      totalBudget,
      totalPaid,
    };
  }, [guests, tables, vendors]);

  const daysUntil = getDaysUntil(settings.weddingDate);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="wedding-card px-4 py-5 md:px-6 md:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-gold">
              Overview
            </p>
            <h2 className="mt-1 font-display text-2xl md:text-3xl text-sage-dark">
              Welcome, {settings.brideName}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-sage-dark/75">
              This is your private planning space for{" "}
              <span className="font-medium">
                {settings.weddingDate} &mdash; your wedding day
              </span>
              . Keep track of guests, tables, and vendors, all in one calm,
              elegant dashboard.
            </p>
          </div>
          <div className="flex items-end gap-4 md:gap-6">
            <div className="text-right">
              <p className="font-script text-3xl text-gold leading-tight">
                {daysUntil !== null ? daysUntil : "—"}
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
                Days to go
              </p>
            </div>
            <div className="hidden h-12 w-px bg-gradient-to-b from-gold/40 via-gold/10 to-transparent md:block" />
            <div className="hidden text-right md:block">
              <p className="text-[0.7rem] tracking-[0.16em] uppercase text-sage-dark/70">
                Wedding Date
              </p>
              <p className="font-display text-sm text-sage-dark">
                15 August 2026
              </p>
              <p className="text-[0.7rem] text-sage-dark/60 mt-1">
                {settings.partnerName && settings.partnerName !== "Partner"
                  ? `${settings.brideName} & ${settings.partnerName}`
                  : settings.brideName}
              </p>
            </div>
          </div>
        </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
            <button
              type="button"
              onClick={exportGuests}
              className="rounded-full border border-sage/40 bg-white/90 px-3 py-1.5 uppercase tracking-[0.18em] text-sage-dark hover:border-gold hover:bg-ivory transition-colors"
            >
              Download guests CSV
            </button>
            <button
              type="button"
              onClick={exportTables}
              className="rounded-full border border-sage/40 bg-white/90 px-3 py-1.5 uppercase tracking-[0.18em] text-sage-dark hover:border-gold hover:bg-ivory transition-colors"
            >
              Download seating CSV
            </button>
            <button
              type="button"
              onClick={exportVendors}
              className="rounded-full border border-sage/40 bg-white/90 px-3 py-1.5 uppercase tracking-[0.18em] text-sage-dark hover:border-gold hover:bg-ivory transition-colors"
            >
              Download vendors CSV
            </button>
          </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Guests
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/80">
              Guest list
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="font-display text-2xl text-sage-dark">
                {stats.totalGuests || "—"}
              </p>
              <p className="text-xs text-sage-dark/70">
                Total guests you&apos;re tracking
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-[0.7rem] text-sage-dark/75">
            <div>
              <dt className="uppercase tracking-[0.18em]">Save the dates</dt>
              <dd className="mt-1">
                Sent {stats.saveTheDateSent} / {stats.totalGuests}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Invitations</dt>
              <dd className="mt-1">
                Sent {stats.inviteSent} / {stats.totalGuests}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">RSVP yes</dt>
              <dd className="mt-1">{stats.rsvpYes}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Plus ones</dt>
              <dd className="mt-1">{stats.withPlusOne}</dd>
            </div>
          </dl>
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Seating
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/80">
              Tables
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="font-display text-2xl text-sage-dark">
                {stats.tableCount || "—"}
              </p>
              <p className="text-xs text-sage-dark/70">
                Round tables you&apos;ve created
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl text-sage-dark">
                {stats.seated}
              </p>
              <p className="text-[0.7rem] text-sage-dark/70">
                Guests already seated
              </p>
            </div>
          </div>
          <p className="mt-3 text-[0.75rem] text-sage-dark/75">
            Drag guests from the list onto chairs to softly build out each
            table.
          </p>
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Vendors
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/80">
              Budget
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-sage-dark/70">
                Total budgeted
              </p>
              <p className="font-display text-lg text-sage-dark">
                {stats.totalBudget
                  ? `€${stats.totalBudget.toLocaleString()}`
                  : "—"}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-sage-dark/70">
                Paid so far
              </p>
              <p className="font-display text-lg text-sage-dark">
                {stats.totalPaid
                  ? `€${stats.totalPaid.toLocaleString()}`
                  : "—"}
              </p>
            </div>
            {stats.totalBudget > 0 && (
              <div className="mt-1">
                <div className="mb-1 flex justify-between text-[0.65rem] text-sage-dark/70">
                  <span>Remaining</span>
                  <span>
                    €
                    {Math.max(
                      0,
                      stats.totalBudget - stats.totalPaid
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ivory">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sage to-gold"
                    style={{
                      width: `${Math.min(
                        100,
                        (stats.totalPaid / stats.totalBudget) * 100
                      ).toFixed(1)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <p className="mt-3 text-[0.75rem] text-sage-dark/75">
            Use the vendors page to log deposits, final payments, and little
            notes for each person helping bring your day to life.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:gap-5">
        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Gentle checklist
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/80">
              You can tweak this
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-[0.8rem] text-sage-dark/85">
            <li className="flex gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full border border-sage/50 bg-ivory" />
              <span>
                Start building your{" "}
                <span className="font-medium">full guest list</span> on the
                Guests page, including who gets a plus one.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full border border-sage/50 bg-ivory" />
              <span>
                Mark when{" "}
                <span className="font-medium">save the dates</span> and{" "}
                <span className="font-medium">formal invitations</span> have
                gone out.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full border border-sage/50 bg-ivory" />
              <span>
                Once RSVPs come in, move over to{" "}
                <span className="font-medium">Seating</span> and gently arrange
                tables.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full border border-sage/50 bg-ivory" />
              <span>
                Add each key{" "}
                <span className="font-medium">vendor</span> with costs and due
                dates so nothing sneaks up on you.
              </span>
            </li>
          </ul>
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
            Little notes
          </p>
          <p className="mt-2 text-[0.85rem] text-sage-dark/85">
            This space is just for you. If any part of this template doesn&apos;t
            feel useful, you can simply ignore it or we can remove it later.
            The goal is to keep everything feeling{" "}
            <span className="italic">light, calm, and organised</span> as your
            day gets closer.
          </p>
          <p className="mt-3 text-[0.8rem] text-sage-dark/80">
            You can also use this planner after the wedding to remember who
            helped, which vendors you loved, and how you set up the room.
          </p>
        </div>
      </section>
    </div>
  );
}
