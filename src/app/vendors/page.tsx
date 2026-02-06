"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Vendor,
  VendorCategory,
  useWeddingTemplate,
} from "@/components/wedding-template/WeddingTemplateProvider";

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  music: "Music",
  photography: "Photography",
  video: "Video",
  flowers: "Flowers",
  venue: "Venue",
  planner: "Planner",
  cake: "Cake",
  decor: "Decor",
  transport: "Transport",
  beauty: "Beauty",
  other: "Other",
};

export default function VendorsPage() {
  const {
    state: { vendors },
    addVendor,
    updateVendor,
    removeVendor,
  } = useWeddingTemplate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>("music");
  const [contact, setContact] = useState("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Vendor["status"]>("researching");
  const [notes, setNotes] = useState("");

  const [filterCategory, setFilterCategory] = useState<"all" | VendorCategory>(
    "all"
  );

  const totals = useMemo(() => {
    const budget = vendors.reduce(
      (sum, v) => sum + (v.totalCost ?? 0),
      0
    );
    const paid = vendors.reduce(
      (sum, v) => sum + (v.amountPaid ?? 0),
      0
    );
    return { budget, paid, remaining: Math.max(0, budget - paid) };
  }, [vendors]);

  const filtered = useMemo(
    () =>
      vendors.filter((v) =>
        filterCategory === "all" ? true : v.category === filterCategory
      ),
    [vendors, filterCategory]
  );

  function handleAddVendor(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const total = totalCost ? Number(totalCost.replace(",", ".")) : undefined;
    const paid = amountPaid ? Number(amountPaid.replace(",", ".")) : 0;

    addVendor({
      name: trimmed,
      category,
      contact: contact.trim() || undefined,
      totalCost: Number.isFinite(total as number) ? total : undefined,
      amountPaid: Number.isFinite(paid as number) ? paid : 0,
      dueDate: dueDate || undefined,
      status: status ?? "researching",
      notes: notes.trim() || undefined,
    });

    setName("");
    setContact("");
    setTotalCost("");
    setAmountPaid("");
    setDueDate("");
    setStatus("researching");
    setNotes("");
  }

  function formatMoney(value?: number): string {
    if (!value || !Number.isFinite(value)) return "—";
    return `€${value.toLocaleString()}`;
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="wedding-card px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Vendors & budget
            </p>
            <h2 className="mt-1 font-display text-xl text-sage-dark md:text-2xl">
              People making your day special
            </h2>
            <p className="mt-2 max-w-xl text-[0.8rem] text-sage-dark/80">
              Keep track of musicians, photographers, florists, venue and more.
              Log what you&apos;ve paid, what&apos;s left, and any sweet little
              details to remember.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-[0.7rem] text-sage-dark/80 md:text-right">
            <div>
              <dt className="uppercase tracking-[0.18em]">Vendors</dt>
              <dd className="mt-1 font-display text-lg text-sage-dark">
                {vendors.length}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Budgeted</dt>
              <dd className="mt-1">{formatMoney(totals.budget)}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em]">Remaining</dt>
              <dd className="mt-1">{formatMoney(totals.remaining)}</dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleAddVendor}
          className="mt-4 grid gap-3 text-[0.8rem] md:grid-cols-2"
        >
          <div className="space-y-2 rounded-lg border border-sage/20 bg-ivory/70 p-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. String Quartet, Venue name"
                className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as VendorCategory)
                  }
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                >
                  {(
                    Object.keys(CATEGORY_LABELS) as VendorCategory[]
                  ).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Status
                </label>
                <select
                  value={status ?? "researching"}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "researching"
                        | "contacted"
                        | "booked"
                        | "paid"
                    )
                  }
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                >
                  <option value="researching">Researching</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                Contact
              </label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone, email, Instagram..."
                className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-sage/20 bg-ivory/70 p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Total cost (€)
                </label>
                <input
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Paid so far (€)
                </label>
                <input
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="Deposit, etc."
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                Next payment / due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Song for first dance, style, arrival time, special requests..."
                className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-gold/70 bg-gradient-to-r from-gold/90 to-gold text-xs font-semibold uppercase tracking-[0.22em] text-white px-4 py-2 shadow-sm transition hover:from-gold hover:to-gold/90 hover:shadow-md"
              >
                Add vendor
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="wedding-card px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Vendor list
            </p>
            <p className="text-[0.8rem] text-sage-dark/80">
              Update payments as you go. When everything is fully paid you can
              mark the vendor as{" "}
              <span className="font-semibold text-sage-dark">Paid</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[0.75rem]">
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as "all" | VendorCategory)
              }
              className="rounded-full border border-sage/30 bg-ivory/80 px-3 py-1.5 text-[0.75rem] text-sage-dark shadow-sm outline-none focus:border-gold focus:bg-white"
            >
              <option value="all">All categories</option>
              {(Object.keys(CATEGORY_LABELS) as VendorCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-sage/25 bg-ivory/40">
          <table className="min-w-full border-separate border-spacing-0 text-left text-[0.78rem] text-sage-dark">
            <thead className="bg-sage/5 text-[0.7rem] uppercase tracking-[0.18em] text-sage-dark/75">
              <tr>
                <th className="border-b border-sage/20 px-3 py-2.5">Name</th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Category
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Contact
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Status
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Total
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Paid
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Remaining
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Due date
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5">
                  Notes
                </th>
                <th className="border-b border-sage/20 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-6 text-center text-[0.8rem] text-sage-dark/65"
                  >
                    Add your first vendor above to start tracking your budget.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const remaining =
                    (v.totalCost ?? 0) - (v.amountPaid ?? 0) || 0;
                  return (
                    <tr key={v.id} className="bg-white/70">
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.8rem] font-medium">
                        {v.name}
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                        {CATEGORY_LABELS[v.category]}
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                        <input
                          value={v.contact ?? ""}
                          onChange={(e) =>
                            updateVendor(v.id, { contact: e.target.value })
                          }
                          className="w-full rounded-md border border-sage/20 bg-white/80 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                        />
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5">
                        <select
                          value={v.status ?? "researching"}
                          onChange={(e) =>
                            updateVendor(v.id, {
                              status:
                                e.target.value as
                                  | "researching"
                                  | "contacted"
                                  | "booked"
                                  | "paid",
                            })
                          }
                          className="rounded-full border border-sage/30 bg-white/80 px-2 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-sage-dark shadow-sm outline-none focus:border-gold"
                        >
                          <option value="researching">Researching</option>
                          <option value="contacted">Contacted</option>
                          <option value="booked">Booked</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                        <input
                          value={v.totalCost ?? ""}
                          onChange={(e) =>
                            updateVendor(v.id, {
                              totalCost: e.target.value
                                ? Number(
                                    e.target.value.toString().replace(",", ".")
                                  ) || undefined
                                : undefined,
                            })
                          }
                          className="w-full rounded-md border border-sage/20 bg-white/80 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                        />
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                        <input
                          value={v.amountPaid ?? ""}
                          onChange={(e) =>
                            updateVendor(v.id, {
                              amountPaid: e.target.value
                                ? Number(
                                    e.target.value.toString().replace(",", ".")
                                  ) || 0
                                : 0,
                            })
                          }
                          className="w-full rounded-md border border-sage/20 bg-white/80 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                        />
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                        {formatMoney(remaining)}
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                          <input
                            type="date"
                            value={v.dueDate ?? ""}
                            onChange={(e) =>
                              updateVendor(v.id, { dueDate: e.target.value })
                            }
                            className="w-full rounded-md border border-sage/20 bg-white/80 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                          />
                      </td>
                      <td className="border-b border-sage/10 px-3 py-2.5 text-[0.75rem] text-sage-dark/80">
                        <textarea
                          value={v.notes ?? ""}
                          onChange={(e) =>
                            updateVendor(v.id, { notes: e.target.value })
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
                                `Remove ${v.name} from your vendor list?`
                              )
                            ) {
                              removeVendor(v.id);
                            }
                          }}
                          className="text-[0.7rem] text-sage-dark/60 hover:text-[#b54b4b]"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

