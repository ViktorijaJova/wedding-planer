"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Guest,
  RsvpStatus,
  useWeddingTemplate,
} from "@/components/wedding-template/WeddingTemplateProvider";
import { getImportedGuests, getNewGuestsToImport } from "@/lib/import-guests";

type FilterSide = "all" | "bride" | "groom" | "both";
type FilterRsvp = "all" | RsvpStatus;

export default function GuestsPage() {
  const {
    state: { guests },
    addGuest,
    updateGuest,
    removeGuest,
    clearAllGuests,
  } = useWeddingTemplate();

  const [name, setName] = useState("");
  const [side, setSide] = useState<Guest["side"]>("bride");
  const [group, setGroup] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [notes, setNotes] = useState("");
  const [dayGuest, setDayGuest] = useState(true);

  const [search, setSearch] = useState("");
  const [filterSide, setFilterSide] = useState<FilterSide>("all");
  const [filterRsvp, setFilterRsvp] = useState<FilterRsvp>("all");
  const [onlyDayGuests, setOnlyDayGuests] = useState(false);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !(
            g.name.toLowerCase().includes(q) ||
            (g.group && g.group.toLowerCase().includes(q)) ||
            (g.notes && g.notes.toLowerCase().includes(q))
          )
        ) {
          return false;
        }
      }

      if (filterSide !== "all") {
        if (g.side !== filterSide) return false;
      }

      if (filterRsvp !== "all") {
        if (g.rsvp !== filterRsvp) return false;
      }

      if (onlyDayGuests && g.dayGuest === false) {
        return false;
      }

      return true;
    });
  }, [guests, search, filterSide, filterRsvp]);

  const totals = useMemo(() => {
    const total = guests.length;
    const day = guests.filter((g) => g.dayGuest !== false).length;
    return {
      total,
      dayGuests: day,
      eveningOnly: total - day,
      saveTheDate: guests.filter((g) => g.saveTheDateSent).length,
      invite: guests.filter((g) => g.inviteSent).length,
      yes: guests.filter((g) => g.rsvp === "yes").length,
      no: guests.filter((g) => g.rsvp === "no").length,
      maybe: guests.filter((g) => g.rsvp === "maybe").length,
      plusOne: guests.filter((g) => g.plusOne).length,
    };
  }, [guests]);

  function handleAddGuest(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    addGuest({
      name: trimmed,
      side,
      group: group.trim() || undefined,
      saveTheDateSent: false,
      inviteSent: false,
      rsvp: "pending",
      plusOne,
      dayGuest,
      notes: notes.trim(),
      tableId: null,
      seatIndex: null,
    });

    setName("");
    setGroup("");
    setPlusOne(false);
    setDayGuest(true);
    setNotes("");
  }

  function handleImportGuests() {
    const newGuests = getNewGuestsToImport(guests);
    newGuests.forEach((guest) => {
      addGuest({
        ...guest,
        tableId: null,
        seatIndex: null,
        dayGuest: true,
      });
    });
  }

  function toggleBooleanField(id: string, field: "saveTheDateSent" | "inviteSent" | "plusOne") {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;
    updateGuest(id, { [field]: !guest[field] } as Partial<Guest>);
  }

  function cycleRsvp(id: string) {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;
    const order: RsvpStatus[] = ["pending", "yes", "no", "maybe"];
    const currentIndex = order.indexOf(guest.rsvp);
    const next = order[(currentIndex + 1) % order.length];
    updateGuest(id, { rsvp: next });
  }

  function labelForRsvp(rsvp: RsvpStatus): string {
    switch (rsvp) {
      case "yes":
        return "Yes";
      case "no":
        return "No";
      case "maybe":
        return "Maybe";
      default:
        return "Pending";
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="wedding-card px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Guest list
            </p>
            <h2 className="mt-1 font-display text-xl text-sage-dark md:text-2xl">
              People you&apos;re inviting
            </h2>
            <p className="mt-2 max-w-xl text-[0.8rem] text-sage-dark/80">
              Add everyone you&apos;re considering inviting. You can track save the
              dates, invitations, RSVPs, plus ones, and soft notes for each
              person.
            </p>
          </div>
          <dl className="grid grid-cols-4 gap-2 text-[0.7rem] text-sage-dark/80 md:text-right">
            <div>
              <dt className="uppercase tracking-[0.18em]">Total</dt>
              <dd className="mt-1 font-display text-lg text-sage-dark">
                {totals.total}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Day guests</dt>
              <dd className="mt-1">
                {totals.dayGuests} full day / {totals.eveningOnly} evening only
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">RSVP yes</dt>
              <dd className="mt-1">{totals.yes}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Plus ones</dt>
              <dd className="mt-1">{totals.plusOne}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleImportGuests}
            className="inline-flex items-center justify-center rounded-full border border-sage/40 bg-sage/10 text-xs font-semibold uppercase tracking-[0.22em] text-sage-dark px-4 py-2 shadow-sm transition hover:bg-sage/20 hover:shadow-md"
          >
            Import guest list
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to remove all guests? This cannot be undone.")) {
                clearAllGuests();
              }
            }}
            className="inline-flex items-center justify-center rounded-full border border-red-300/60 bg-red-50 text-xs font-semibold uppercase tracking-[0.22em] text-red-700 px-4 py-2 shadow-sm transition hover:bg-red-100 hover:shadow-md"
          >
            Clear all guests
          </button>
        </div>

        <form
          onSubmit={handleAddGuest}
          className="mt-4 grid gap-3 text-[0.8rem] md:grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr)] md:items-end"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
              Guest name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ana Petrović"
              className="w-full rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                Side
              </label>
              <select
                value={side ?? ""}
                onChange={(e) =>
                  setSide(
                    e.target.value === ""
                      ? undefined
                      : (e.target.value as Guest["side"])
                  )
                }
                className="w-full rounded-md border border-sage/30 bg-ivory/70 px-2 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold focus:bg-white"
              >
                <option value="bride">Bride&apos;s side</option>
                <option value="groom">Partner&apos;s side</option>
                <option value="both">Both / shared</option>
                <option value="">Unsure yet</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                Group
              </label>
              <input
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Family, work, friends..."
                className="w-full rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
              />
            </div>
            <div className="flex flex-col gap-2 md:mt-5">
              <label className="inline-flex items-center gap-2 text-[0.8rem] text-sage-dark/85">
                <input
                  type="checkbox"
                  checked={plusOne}
                  onChange={(e) => setPlusOne(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-sage/40 text-sage-dark focus:ring-gold"
                />
                Plus one
              </label>
              <label className="inline-flex items-center gap-2 text-[0.8rem] text-sage-dark/85">
                <input
                  type="checkbox"
                  checked={dayGuest}
                  onChange={(e) => setDayGuest(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-sage/40 text-sage-dark focus:ring-gold"
                />
                Day guest (ceremony + dinner)
              </label>
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
              Notes (optional)
            </label>
            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, seating preferences, kids, travel details..."
                rows={2}
                className="min-h-[38px] flex-1 rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
              />
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-gold/70 bg-gradient-to-r from-gold/90 to-gold text-xs font-semibold uppercase tracking-[0.22em] text-white px-4 py-2 shadow-sm transition hover:from-gold hover:to-gold/90 hover:shadow-md md:mt-0"
              >
                Add guest
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="wedding-card px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              List
            </p>
            <p className="text-[0.8rem] text-sage-dark/80">
              Tap the tags to toggle statuses. Everything saves automatically to
              your browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[0.75rem]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, group, or notes..."
              className="w-full rounded-full border border-sage/30 bg-ivory/80 px-3 py-1.5 text-[0.75rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white md:w-60"
            />
            <select
              value={filterSide}
              onChange={(e) => setFilterSide(e.target.value as FilterSide)}
              className="rounded-full border border-sage/30 bg-ivory/80 px-3 py-1.5 text-[0.75rem] text-sage-dark shadow-sm outline-none focus:border-gold focus:bg-white"
            >
              <option value="all">All sides</option>
              <option value="bride">Bride&apos;s side</option>
              <option value="groom">Partner&apos;s side</option>
              <option value="both">Both / shared</option>
            </select>
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value as FilterRsvp)}
              className="rounded-full border border-sage/30 bg-ivory/80 px-3 py-1.5 text-[0.75rem] text-sage-dark shadow-sm outline-none focus:border-gold focus:bg-white"
            >
              <option value="all">All RSVPs</option>
              <option value="pending">Pending</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="maybe">Maybe</option>
            </select>
            <label className="inline-flex items-center gap-1 text-[0.75rem] text-sage-dark/80">
              <input
                type="checkbox"
                checked={onlyDayGuests}
                onChange={(e) => setOnlyDayGuests(e.target.checked)}
                className="h-3 w-3 rounded border-sage/40 text-sage-dark focus:ring-gold"
              />
              Day guests only
            </label>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-sage/25 bg-ivory/40">
          <table className="min-w-full border-separate border-spacing-0 text-left text-[0.78rem] text-sage-dark">
            <thead className="bg-sage/5 text-[0.7rem] uppercase tracking-[0.18em] text-sage-dark/75">
              <tr>
                <th className="border-b border-sage/20 px-3 py-2.5">Name</th>
                <th className="border-b border-sage/20 px-3 py-2.5">Side</th>
                <th className="border-b border-sage/20 px-3 py-2.5">Group</th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Save the date
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Invite sent
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">RSVP</th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Plus one
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Day guest
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Seating
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Notes
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-6 text-center text-[0.8rem] text-sage-dark/65"
                  >
                    Start by adding your first guest above. This table will fill
                    up as you go.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g, index) => (
                  <tr
                    key={g.id}
                    className={
                      index % 2 === 0 ? "bg-white/60" : "bg-ivory/80"
                    }
                  >
                    <td className="border-b border-sage/10 px-3 py-2.5 text-[0.8rem] font-medium">
                      {g.name}
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5">
                      <span className="rounded-full bg-white/80 px-2 py-1 text-[0.7rem] text-sage-dark/80">
                        {g.side === "bride"
                          ? "Bride"
                          : g.side === "groom"
                          ? "Partner"
                          : g.side === "both"
                          ? "Both"
                          : "—"}
                      </span>
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                      {g.group || "—"}
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          toggleBooleanField(g.id, "saveTheDateSent")
                        }
                        className={`rounded-full px-2 py-1 text-[0.7rem] uppercase tracking-[0.16em] ${
                          g.saveTheDateSent
                            ? "bg-sage text-white"
                            : "bg-white text-sage-dark/80 border border-sage/40"
                        }`}
                      >
                        {g.saveTheDateSent ? "Sent" : "Not yet"}
                      </button>
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleBooleanField(g.id, "inviteSent")}
                        className={`rounded-full px-2 py-1 text-[0.7rem] uppercase tracking-[0.16em] ${
                          g.inviteSent
                            ? "bg-sage-dark text-white"
                            : "bg-white text-sage-dark/80 border border-sage/40"
                        }`}
                      >
                        {g.inviteSent ? "Sent" : "Not yet"}
                      </button>
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => cycleRsvp(g.id)}
                        className={`rounded-full px-2 py-1 text-[0.7rem] uppercase tracking-[0.16em] ${
                          g.rsvp === "yes"
                            ? "bg-sage text-white"
                            : g.rsvp === "no"
                            ? "bg-[#b54b4b] text-white"
                            : g.rsvp === "maybe"
                            ? "bg-gold text-white"
                            : "bg-white text-sage-dark/80 border border-sage/40"
                        }`}
                      >
                        {labelForRsvp(g.rsvp)}
                      </button>
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleBooleanField(g.id, "plusOne")}
                        className={`rounded-full px-2 py-1 text-[0.7rem] uppercase tracking-[0.16em] ${
                          g.plusOne
                            ? "bg-sage/90 text-white"
                            : "bg-white text-sage-dark/80 border border-sage/40"
                        }`}
                      >
                        {g.plusOne ? "Has plus one" : "No plus one"}
                      </button>
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5">
                      <span className="rounded-full bg-white/80 px-2 py-1 text-[0.7rem] text-sage-dark/80">
                        {g.dayGuest === false ? "Evening only" : "Day guest"}
                      </span>
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5 text-[0.7rem] text-sage-dark/80">
                      {g.tableId != null && g.seatIndex != null ? (
                        <span className="rounded-full bg-white/80 px-2 py-1">
                          At table, seat {g.seatIndex + 1}
                        </span>
                      ) : (
                        <span className="text-sage-dark/55">Not seated yet</span>
                      )}
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                      <textarea
                        value={g.notes}
                        onChange={(e) =>
                          updateGuest(g.id, { notes: e.target.value })
                        }
                        rows={2}
                        className="min-h-[34px] w-full rounded-md border border-sage/20 bg-white/80 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                      />
                    </td>
                    <td className="border-b border-sage/10 px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove ${g.name} from your guest list?`
                            )
                          ) {
                            removeGuest(g.id);
                          }
                        }}
                        className="text-[0.7rem] text-sage-dark/60 hover:text-[#b54b4b]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

