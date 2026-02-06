"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  PartyMemberRole,
  useWeddingTemplate,
} from "@/components/wedding-template/WeddingTemplateProvider";
import { Crown, Plus, Trash2, Phone, Mail, Shirt } from "lucide-react";

const ROLE_LABELS: Record<PartyMemberRole, string> = {
  "maid-of-honor": "Maid of Honour",
  "best-man": "Best Man",
  bridesmaid: "Bridesmaid",
  groomsman: "Groomsman",
  "flower-girl": "Flower Girl",
  "ring-bearer": "Ring Bearer",
  usher: "Usher",
  reader: "Reader",
  officiant: "Officiant",
  other: "Other",
};

const ROLE_COLORS: Record<PartyMemberRole, string> = {
  "maid-of-honor": "bg-rose/15 text-rose border-rose/20",
  "best-man": "bg-gold/10 text-gold border-gold/20",
  bridesmaid: "bg-dusty-rose/10 text-dusty-rose border-dusty-rose/20",
  groomsman: "bg-sage/15 text-sage border-sage/25",
  "flower-girl": "bg-blush/40 text-dusty-rose border-rose/15",
  "ring-bearer": "bg-gold-light/20 text-gold border-gold/15",
  usher: "bg-champagne/30 text-sage-dark/60 border-gold/15",
  reader: "bg-mauve/10 text-mauve border-mauve/20",
  officiant: "bg-sage-dark/5 text-sage-dark/70 border-sage-dark/10",
  other: "bg-cream text-sage-dark/60 border-gold/10",
};

export default function PartyPage() {
  const {
    state: { weddingParty },
    addPartyMember,
    updatePartyMember,
    removePartyMember,
  } = useWeddingTemplate();

  const [name, setName] = useState("");
  const [role, setRole] = useState<PartyMemberRole>("bridesmaid");
  const [side, setSide] = useState<"bride" | "groom">("bride");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [outfit, setOutfit] = useState("");
  const [notes, setNotes] = useState("");

  const bridesSide = useMemo(() => weddingParty.filter((p) => p.side === "bride"), [weddingParty]);
  const groomsSide = useMemo(() => weddingParty.filter((p) => p.side === "groom"), [weddingParty]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addPartyMember({
      name: name.trim(),
      role,
      side,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      outfit: outfit.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setName("");
    setPhone("");
    setEmail("");
    setOutfit("");
    setNotes("");
  }

  function MemberCard({ member }: { member: typeof weddingParty[0] }) {
    return (
      <div className="wedding-card px-4 py-4 group animate-fade-in-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-rose/20 to-dusty-rose/20 text-dusty-rose font-display text-sm font-semibold">
              {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[0.85rem] font-medium text-sage-dark">{member.name}</p>
              <span className={`inline-block mt-0.5 rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.1em] uppercase ${ROLE_COLORS[member.role]}`}>
                {ROLE_LABELS[member.role]}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove ${member.name} from the wedding party?`)) {
                removePartyMember(member.id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-sage-dark/30 hover:text-mauve"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-1.5 text-[0.72rem] text-sage-dark/60">
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gold/60" />
              <span>{member.phone}</span>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gold/60" />
              <span>{member.email}</span>
            </div>
          )}
          {member.outfit && (
            <div className="flex items-center gap-2">
              <Shirt className="h-3 w-3 text-gold/60" />
              <span>{member.outfit}</span>
            </div>
          )}
        </div>

        {member.notes && (
          <p className="mt-2 text-[0.7rem] text-sage-dark/45 italic">{member.notes}</p>
        )}

        {/* Inline edit for outfit */}
        <div className="mt-3 pt-2 border-t border-gold/8">
          <input
            value={member.outfit ?? ""}
            onChange={(e) => updatePartyMember(member.id, { outfit: e.target.value })}
            placeholder="Outfit details (colour, style...)"
            className="w-full bg-transparent text-[0.7rem] text-sage-dark/60 outline-none placeholder:text-sage-dark/30 focus:text-sage-dark"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="wedding-card px-5 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="section-label">Wedding Party</p>
            <h2 className="section-title">Your dream team</h2>
            <p className="mt-2 max-w-lg text-[0.8rem] text-sage-dark/65">
              Keep track of your bridesmaids, groomsmen, and everyone helping
              make your day perfect. Add their contact details and outfit notes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dusty-rose/10">
              <Crown className="h-5 w-5 text-dusty-rose" />
            </div>
            <div className="text-right">
              <p className="font-display text-2xl text-sage-dark">{weddingParty.length}</p>
              <p className="text-[0.65rem] tracking-[0.15em] uppercase text-sage-dark/50">Members</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAdd} className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-gold/10 bg-cream/40 p-4">
            <div className="space-y-1.5">
              <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ana Petrovic" className="input-elegant" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value as PartyMemberRole)} className="input-elegant">
                  {(Object.keys(ROLE_LABELS) as PartyMemberRole[]).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Side</label>
                <select value={side} onChange={(e) => setSide(e.target.value as "bride" | "groom")} className="input-elegant">
                  <option value="bride">Bride&apos;s side</option>
                  <option value="groom">Partner&apos;s side</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-gold/10 bg-cream/40 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className="input-elegant" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" className="input-elegant" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Outfit / attire</label>
              <input value={outfit} onChange={(e) => setOutfit(e.target.value)} placeholder="Dress colour, suit style..." className="input-elegant" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Notes</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, speech, transport..." className="input-elegant" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                <Plus className="h-3.5 w-3.5" />
                Add member
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Two columns: bride's side / partner's side */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-linear-to-r from-rose/30 to-transparent" />
            <p className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-rose/70">
              Bride&apos;s Side
            </p>
            <div className="h-px flex-1 bg-linear-to-l from-rose/30 to-transparent" />
          </div>
          {bridesSide.length === 0 ? (
            <div className="wedding-card px-4 py-6 text-center">
              <p className="text-[0.8rem] text-sage-dark/40">No members added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bridesSide.map((m) => <MemberCard key={m.id} member={m} />)}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-linear-to-r from-gold/30 to-transparent" />
            <p className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-gold/70">
              Partner&apos;s Side
            </p>
            <div className="h-px flex-1 bg-linear-to-l from-gold/30 to-transparent" />
          </div>
          {groomsSide.length === 0 ? (
            <div className="wedding-card px-4 py-6 text-center">
              <p className="text-[0.8rem] text-sage-dark/40">No members added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groomsSide.map((m) => <MemberCard key={m.id} member={m} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
