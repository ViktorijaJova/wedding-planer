"use client";

import { FormEvent, useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Plus,
} from "lucide-react";
import {
  Guest,
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

function seatPosition(index: number, total: number, radius: number, center: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return {
    left: `${center + x - 22}px`,
    top: `${center + y - 22}px`,
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

  // Drag state (desktop)
  const [draggingGuestId, setDraggingGuestId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    tableId: string;
    seatIndex: number;
  } | null>(null);

  // Tap-to-assign state (mobile)
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  // Carousel state
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0); // -1 left, 1 right

  // Search & filter state
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");

  // Responsive seat sizing
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const seatRadius = isMobile ? 105 : 130;
  const seatCenter = isMobile ? 120 : 140;

  const selectedGuest = useMemo(
    () => (selectedGuestId ? guests.find((g) => g.id === selectedGuestId) : null),
    [selectedGuestId, guests]
  );

  const unassignedGuests = useMemo(
    () =>
      guests.filter(
        (g) => g.tableId == null || g.seatIndex == null
      ) as Guest[],
    [guests]
  );

  const filteredUnassigned = useMemo(() => {
    return unassignedGuests.filter((g) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!g.name.toLowerCase().includes(q)) return false;
      }
      if (filterGroup !== "all") {
        if ((g.group || "").toLowerCase() !== filterGroup.toLowerCase())
          return false;
      }
      return true;
    });
  }, [unassignedGuests, search, filterGroup]);

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    guests.forEach((g) => {
      if (g.group) groups.add(g.group);
    });
    return Array.from(groups).sort();
  }, [guests]);

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

  const safeTableIndex =
    tables.length === 0 ? -1 : Math.min(currentTableIndex, tables.length - 1);
  const currentTable = safeTableIndex >= 0 ? tables[safeTableIndex] : null;

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
    setSlideDirection(1);
    setCurrentTableIndex(tables.length);
  }

  function goToTable(direction: -1 | 1) {
    setSlideDirection(direction);
    setCurrentTableIndex((i) => {
      const next = i + direction;
      return Math.max(0, Math.min(tables.length - 1, next));
    });
  }

  // Desktop drag handlers
  function handleDragStart(
    guestId: string,
    e: React.DragEvent<HTMLDivElement>
  ) {
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

  // Tap-to-assign: guest chip click
  const handleGuestTap = useCallback(
    (guestId: string) => {
      setSelectedGuestId((prev) => (prev === guestId ? null : guestId));
    },
    []
  );

  // Seat click: unseat (if occupied & no guest selected) or assign (if guest selected & seat empty)
  const handleSeatClick = useCallback(
    (tableId: string, seatIndex: number) => {
      const occupant = guests.find(
        (g) => g.tableId === tableId && g.seatIndex === seatIndex
      );

      // If a guest is selected and the seat is empty → assign
      if (selectedGuestId && !occupant) {
        assignSeat(selectedGuestId, tableId, seatIndex);
        setSelectedGuestId(null);
        return;
      }

      // If a guest is selected and seat is occupied → replace
      if (selectedGuestId && occupant) {
        assignSeat(selectedGuestId, tableId, seatIndex);
        setSelectedGuestId(null);
        return;
      }

      // No guest selected, occupied seat → unseat
      if (occupant) {
        if (
          window.confirm(
            `Remove ${occupant.name} from this seat?`
          )
        ) {
          clearSeat(occupant.id);
        }
      }
    },
    [guests, selectedGuestId, assignSeat, clearSeat]
  );

  // Carousel slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Selected guest banner (mobile tap flow) */}
      <AnimatePresence>
        {selectedGuest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="seating-selection-banner"
          >
            <span className="text-[0.8rem]">
              Tap a seat to place <strong>{selectedGuest.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedGuestId(null)}
              className="ml-2 rounded-full p-1 hover:bg-white/30 transition"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="wedding-card px-4 py-4 md:px-5 md:py-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Seating
            </p>
            <h2 className="mt-1 font-display text-xl text-sage-dark md:text-2xl">
              Round tables layout
            </h2>
            <p className="mt-2 max-w-xl text-[0.8rem] text-sage-dark/80">
              <span className="hidden md:inline">
                Drag guests onto seats, or use the arrows to flip between tables.
              </span>
              <span className="md:hidden">
                Tap a guest to select, then tap a seat to place them. Use arrows to switch tables.
              </span>
            </p>
          </div>
          <dl className="seating-stats">
            <div className="seating-stat">
              <dt>Tables</dt>
              <dd>{totals.tables}</dd>
            </div>
            <div className="seating-stat">
              <dt>Seated</dt>
              <dd>
                {totals.seated}<span className="seating-stat-divider">/</span>
                {totals.totalGuests}
              </dd>
            </div>
            <div className="seating-stat">
              <dt>Unassigned</dt>
              <dd>{unassignedGuests.length}</dd>
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
              className="w-full rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white transition-colors"
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
              className="w-24 rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="seating-add-btn"
            >
              <Plus size={14} />
              Add table
            </button>
          </div>
        </form>
      </motion.section>

      {/* Main content: table carousel + unassigned guests */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr),minmax(0,1.4fr)] md:gap-5">
        {/* On mobile: table first (order-1), guests second (order-2) */}
        {/* On desktop: guests left, table right */}

        {/* Unassigned guests panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="wedding-card px-4 py-4 md:px-5 md:py-5 order-2 md:order-1"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Unassigned guests
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/85 hidden md:inline-flex">
              Drag onto a seat
            </span>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/85 md:hidden">
              Tap to select
            </span>
          </div>

          {/* Search & filter */}
          <div className="mt-3 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-dark/40"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests..."
                className="w-full rounded-md border border-sage/30 bg-ivory/70 pl-8 pr-8 py-1.5 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-sage-dark/40 hover:text-sage-dark/70 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="rounded-md border border-sage/30 bg-ivory/70 px-2 py-1.5 text-[0.75rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white transition-colors"
            >
              <option value="all">All groups</option>
              {availableGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 max-h-72 md:max-h-96 space-y-1.5 overflow-y-auto pr-1 scroll-fade">
            {filteredUnassigned.length === 0 ? (
              <p className="text-[0.8rem] text-sage-dark/70 py-4 text-center">
                {unassignedGuests.length === 0 ? (
                  <span className="font-script text-lg text-gold/80">
                    Everyone is seated!
                  </span>
                ) : (
                  "No guests match your search."
                )}
              </p>
            ) : (
              filteredUnassigned.map((g) => (
                <motion.div
                  key={g.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={[
                    "guest-chip guest-chip-unassigned justify-between",
                    selectedGuestId === g.id ? "guest-chip-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  draggable
                  onClick={() => handleGuestTap(g.id)}
                  onDragStart={(e) =>
                    handleDragStart(
                      g.id,
                      e as unknown as React.DragEvent<HTMLDivElement>
                    )
                  }
                  onDragEnd={() => {
                    setDraggingGuestId((current) =>
                      current === g.id ? null : current
                    );
                    setDropTarget(null);
                  }}
                >
                  <span className="seating-initials-badge">
                    {getInitials(g.name)}
                  </span>
                  <span className="flex-1 truncate">{g.name}</span>
                  {g.side && (
                    <span className="guest-chip-small-tag">
                      {g.side === "bride"
                        ? "Bride"
                        : g.side === "groom"
                        ? "Partner"
                        : "Both"}
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Table carousel panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="wedding-card px-4 py-4 md:px-5 md:py-5 order-1 md:order-2"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Tables
            </p>
            <span className="wedding-pill bg-ivory/80 text-sage-dark/85">
              Click seat to unseat
            </span>
          </div>

          {tables.length === 0 ? (
            <div className="mt-8 mb-4 text-center">
              <p className="font-script text-2xl text-gold/70">
                No tables yet
              </p>
              <p className="mt-2 text-[0.8rem] text-sage-dark/60">
                Add your first table above to start seating guests.
              </p>
            </div>
          ) : currentTable ? (
            <div className="mt-4">
              {/* Carousel navigation */}
              <div className="seating-carousel-nav">
                <button
                  type="button"
                  disabled={safeTableIndex <= 0}
                  onClick={() => goToTable(-1)}
                  className="seating-carousel-arrow"
                  aria-label="Previous table"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="text-center">
                  <span className="seating-carousel-counter">
                    {safeTableIndex + 1} / {tables.length}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={safeTableIndex >= tables.length - 1}
                  onClick={() => goToTable(1)}
                  className="seating-carousel-arrow"
                  aria-label="Next table"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Animated single table view */}
              <div className="seating-carousel-viewport">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={currentTable.id}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="seating-table-single"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <input
                          value={currentTable.name}
                          onChange={(e) =>
                            updateTable(currentTable.id, {
                              name: e.target.value,
                            })
                          }
                          className="w-full rounded-md border-none bg-transparent px-0 py-0 text-[0.95rem] font-semibold text-sage-dark outline-none"
                        />
                        <p className="mt-0.5 text-[0.75rem] text-sage-dark/70">
                          {(byTable.get(currentTable.id) ?? []).length}/
                          {currentTable.capacity} seats filled
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove ${currentTable.name}? Guests will move back to the unassigned list.`
                            )
                          ) {
                            removeTable(currentTable.id);
                            setCurrentTableIndex((i) =>
                              Math.max(0, Math.min(i, tables.length - 2))
                            );
                          }
                        }}
                        className="text-[0.7rem] text-sage-dark/55 hover:text-[#b54b4b] transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="seating-table-circle-large mt-4">
                      {Array.from({ length: currentTable.capacity }).map(
                        (_, i) => {
                          const seatGuest = guests.find(
                            (g) =>
                              g.tableId === currentTable.id &&
                              g.seatIndex === i
                          );
                          const isDropTarget =
                            dropTarget &&
                            dropTarget.tableId === currentTable.id &&
                            dropTarget.seatIndex === i;
                          const isAssignTarget =
                            selectedGuestId && !seatGuest;

                          const style = seatPosition(
                            i,
                            currentTable.capacity,
                            seatRadius,
                            seatCenter
                          );

                          return (
                            <motion.div
                              key={i}
                              whileTap={{ scale: 0.9 }}
                              className={[
                                "seating-seat seating-seat-large",
                                seatGuest ? "occupied" : "empty",
                                isDropTarget
                                  ? "seating-seat-drop-target"
                                  : "",
                                isAssignTarget
                                  ? "seating-seat-assign-target"
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              style={style}
                              onClick={() =>
                                handleSeatClick(currentTable.id, i)
                              }
                              onDragOver={(e) => {
                                if (!draggingGuestId) return;
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                                setDropTarget({
                                  tableId: currentTable.id,
                                  seatIndex: i,
                                });
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                setDropTarget((current) =>
                                  current &&
                                  current.tableId === currentTable.id &&
                                  current.seatIndex === i
                                    ? null
                                    : current
                                );
                              }}
                              onDrop={(e) =>
                                handleSeatDrop(
                                  currentTable.id,
                                  i,
                                  e as unknown as React.DragEvent<HTMLDivElement>
                                )
                              }
                            >
                              {seatGuest ? (
                                <span title={seatGuest.name}>
                                  {getInitials(seatGuest.name)}
                                </span>
                              ) : (
                                <span className="text-[0.65rem]">
                                  {i + 1}
                                </span>
                              )}
                            </motion.div>
                          );
                        }
                      )}
                    </div>

                    {/* Seated guests list */}
                    {(byTable.get(currentTable.id) ?? []).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                        {(byTable.get(currentTable.id) ?? [])
                          .sort(
                            (a, b) =>
                              (a.seatIndex ?? 0) - (b.seatIndex ?? 0)
                          )
                          .map((g) => (
                            <span
                              key={g.id}
                              className="seating-seated-tag"
                            >
                              {(g.seatIndex ?? 0) + 1}. {g.name}
                            </span>
                          ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : null}
        </motion.div>
      </section>
    </div>
  );
}
