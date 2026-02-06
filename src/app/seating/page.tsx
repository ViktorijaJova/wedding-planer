"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Guest,
  Table,
  useWeddingTemplate,
} from "@/components/wedding-template/WeddingTemplateProvider";

type DragData = {
  guestId: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function seatPosition(index: number, total: number) {
  const radius = 90;
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  const center = 90;
  return {
    left: `${center + x - 20}px`,
    top: `${center + y - 20}px`,
  };
}

export default function SeatingPage() {
  const {
    state: { guests, tables },
    addTable,
    updateTable,
    removeTable,
    assignSeat,
    clearSeat,
  } = useWeddingTemplate();

  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState(10);

  const [draggingGuestId, setDraggingGuestId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    tableId: string;
    seatIndex: number;
  } | null>(null);

  const unassignedGuests = useMemo(
    () =>
      guests.filter(
        (g) => g.tableId == null || g.seatIndex == null
      ) as Guest[],
    [guests]
  );

  const byTable = useMemo(() => {
    const map = new Map<string, Guest[]>();
    tables.forEach((t) => {
      map.set(t.id, []);
    });
    guests.forEach((g) => {
      if (g.tableId && g.seatIndex != null && map.has(g.tableId)) {
        map.get(g.tableId)!.push(g);
      }
    });
    return map;
  }, [guests, tables]);

  const totals = useMemo(
    () => ({
      tables: tables.length,
      seated: guests.filter(
        (g) => g.tableId && g.seatIndex != null
      ).length,
      totalGuests: guests.length,
    }),
    [guests, tables]
  );

  function handleAddTable(e: FormEvent) {
    e.preventDefault();
    const name = tableName.trim();
    const safeCapacity = Math.min(12, Math.max(4, capacity || 10));
    addTable({
      name: name || `Table ${tables.length + 1}`,
      capacity: safeCapacity,
      notes: "",
    });
    setTableName("");
    setCapacity(10);
  }

  function handleDragStart(guestId: string, e: React.DragEvent<HTMLDivElement>) {
    const data: DragData = { guestId };
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
    setDraggingGuestId(guestId);
  }

  function readDragData(e: React.DragEvent<HTMLDivElement>): DragData | null {
    try {
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return null;
      return JSON.parse(raw) as DragData;
    } catch {
      return null;
    }
  }

  function handleSeatDrop(
    tableId: string,
    seatIndex: number,
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    const data = readDragData(e);
    if (!data) return;
    assignSeat(data.guestId, tableId, seatIndex);
    setDraggingGuestId(null);
    setDropTarget(null);
  }

  function handleSeatClick(tableId: string, seatIndex: number) {
    const occupant = guests.find(
      (g) => g.tableId === tableId && g.seatIndex === seatIndex
    );
    if (!occupant) return;
    if (
      window.confirm(
        `Remove ${occupant.name} from this seat (they will go back to the unassigned list)?`
      )
    ) {
      clearSeat(occupant.id);
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="wedding-card px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Seating
            </p>
            <h2 className="mt-1 font-display text-xl text-sage-dark md:text-2xl">
              Round tables layout
            </h2>
            <p className="mt-2 max-w-xl text-[0.8rem] text-sage-dark/80">
              Drag guests from the list onto the little chairs around each
              table. You can seat around 10–12 people per table, perfect for a
              cosy dinner mood.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-[0.7rem] text-sage-dark/80 md:text-right">
            <div>
              <dt className="uppercase tracking-[0.18em]">Tables</dt>
              <dd className="mt-1 font-display text-lg text-sage-dark">
                {totals.tables}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Seated</dt>
              <dd className="mt-1">
                {totals.seated} / {totals.totalGuests}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Unassigned</dt>
              <dd className="mt-1">
                {unassignedGuests.length}/{totals.totalGuests}
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleAddTable}
          className="mt-4 grid gap-3 text-[0.8rem] md:grid-cols-[minmax(0,1.6fr),minmax(0,1fr),auto]"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
              Table name
            </label>
            <input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder={`e.g. V & T's Family, Friends 1`}
              className="w-full rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
              Seats (4–12)
            </label>
            <input
              type="number"
              min={4}
              max={12}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 10)}
              className="w-24 rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-gold/70 bg-gradient-to-r from-gold/90 to-gold text-xs font-semibold uppercase tracking-[0.22em] text-white px-4 py-2 shadow-sm transition hover:from-gold hover:to-gold/90 hover:shadow-md"
            >
              Add table
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.2fr),minmax(0,1.4fr)] md:gap-5">
        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Unassigned guests
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/85">
              Drag onto a seat
            </span>
          </div>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 scroll-fade">
            {unassignedGuests.length === 0 ? (
              <p className="text-[0.8rem] text-sage-dark/70">
                Everyone is seated already. You can click a seat to remove
                someone back to this list.
              </p>
            ) : (
              unassignedGuests.map((g) => (
                <div
                  key={g.id}
                  className="guest-chip guest-chip-unassigned justify-between"
                  draggable
                  onDragStart={(e) => handleDragStart(g.id, e)}
                  onDragEnd={() => {
                    setDraggingGuestId((current) =>
                      current === g.id ? null : current
                    );
                    setDropTarget(null);
                  }}
                >
                  <span className="guest-chip-small-tag">
                    {getInitials(g.name)}
                  </span>
                  <span>{g.name}</span>
                  {g.side && (
                    <span className="guest-chip-small-tag">
                      {g.side === "bride"
                        ? "Bride"
                        : g.side === "groom"
                        ? "Partner"
                        : "Both"}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="wedding-card px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Tables
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/85">
              Click guest to unseat
            </span>
          </div>

          {tables.length === 0 ? (
            <p className="mt-3 text-[0.8rem] text-sage-dark/75">
              Start by adding your first table above. A good starting point is
              10 guests per table, and you can gently adjust later.
            </p>
          ) : (
            <div className="mt-4 seating-grid">
              {tables.map((table: Table) => {
                const seatedHere = byTable.get(table.id) ?? [];

                return (
                  <div
                    key={table.id}
                    className="seating-table wedding-card border-sage/35 bg-white/90"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <input
                          value={table.name}
                          onChange={(e) =>
                            updateTable(table.id, { name: e.target.value })
                          }
                          className="w-full rounded-md border-none bg-transparent px-0 py-0 text-[0.85rem] font-semibold text-sage-dark outline-none"
                        />
                        <p className="mt-0.5 text-[0.7rem] text-sage-dark/70">
                          {seatedHere.length}/{table.capacity} seats filled
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove ${table.name}? Guests will move back to the unassigned list.`
                            )
                          ) {
                            removeTable(table.id);
                          }
                        }}
                        className="text-[0.7rem] text-sage-dark/55 hover:text-[#b54b4b]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="seating-table-circle mt-3">
                      {Array.from({ length: table.capacity }).map((_, i) => {
                        const seatGuest = guests.find(
                          (g) => g.tableId === table.id && g.seatIndex === i
                        );
                        const isDropTarget =
                          dropTarget &&
                          dropTarget.tableId === table.id &&
                          dropTarget.seatIndex === i;

                        const style = seatPosition(i, table.capacity);

                        return (
                          <div
                            key={i}
                            className={[
                              "seating-seat",
                              seatGuest ? "occupied" : "empty",
                              isDropTarget ? "seating-seat-drop-target" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            style={style}
                            onClick={() =>
                              seatGuest &&
                              handleSeatClick(table.id, i)
                            }
                            onDragOver={(e) => {
                              if (!draggingGuestId) return;
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                              setDropTarget({ tableId: table.id, seatIndex: i });
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              setDropTarget((current) =>
                                current &&
                                current.tableId === table.id &&
                                current.seatIndex === i
                                  ? null
                                  : current
                              );
                            }}
                            onDrop={(e) =>
                              handleSeatDrop(table.id, i, e)
                            }
                          >
                            {seatGuest ? (
                              <span title={seatGuest.name}>
                                {getInitials(seatGuest.name)}
                              </span>
                            ) : (
                              <span className="text-[0.6rem]">
                                {i + 1}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

