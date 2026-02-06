"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  MusicCategory,
  useWeddingTemplate,
} from "@/components/wedding-template/WeddingTemplateProvider";
import { Music, Plus, Trash2, Ban } from "lucide-react";

const CATEGORY_LABELS: Record<MusicCategory, string> = {
  ceremony: "Ceremony",
  cocktail: "Cocktail Hour",
  "first-dance": "First Dance",
  dinner: "Dinner",
  party: "Party & Dancing",
  special: "Special Moments",
  "do-not-play": "Do Not Play",
};

const CATEGORY_ICONS: Record<MusicCategory, string> = {
  ceremony: "bg-sage/15 text-sage",
  cocktail: "bg-gold/10 text-gold",
  "first-dance": "bg-rose/10 text-rose",
  dinner: "bg-champagne/30 text-gold",
  party: "bg-dusty-rose/10 text-dusty-rose",
  special: "bg-mauve/10 text-mauve",
  "do-not-play": "bg-sage-dark/5 text-sage-dark/50",
};

export default function MusicPage() {
  const {
    state: { music },
    addMusicItem,
    removeMusicItem,
  } = useWeddingTemplate();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState<MusicCategory>("party");
  const [notes, setNotes] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | MusicCategory>("all");

  const filtered = useMemo(
    () => filterCategory === "all" ? music : music.filter((m) => m.category === filterCategory),
    [music, filterCategory]
  );

  const grouped = useMemo(() => {
    const groups: Partial<Record<MusicCategory, typeof music>> = {};
    filtered.forEach((m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category]!.push(m);
    });
    return groups;
  }, [filtered]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addMusicItem({
      title: title.trim(),
      artist: artist.trim(),
      category,
      notes: notes.trim() || undefined,
    });
    setTitle("");
    setArtist("");
    setNotes("");
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="wedding-card px-5 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="section-label">Music & Playlist</p>
            <h2 className="section-title">Songs for your day</h2>
            <p className="mt-2 max-w-lg text-[0.8rem] text-sage-dark/65">
              Build your dream playlist for every moment &mdash; from walking
              down the aisle to the last dance. Share this with your DJ or band!
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <Music className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-display text-2xl text-sage-dark">{music.length}</p>
              <p className="text-[0.65rem] tracking-[0.15em] uppercase text-sage-dark/50">Total songs</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAdd} className="mt-6 grid gap-3 md:grid-cols-[1fr,1fr,auto]">
          <div className="space-y-1.5">
            <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Song title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Perfect" className="input-elegant" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Artist</label>
            <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Ed Sheeran" className="input-elegant" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">For</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MusicCategory)}
              className="input-elegant"
            >
              {(Object.keys(CATEGORY_LABELS) as MusicCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-sage-dark/60">Notes (optional)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special version, timing, who requested it..." className="input-elegant" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full md:w-auto">
              <Plus className="h-3.5 w-3.5" />
              Add song
            </button>
          </div>
        </form>
      </section>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterCategory("all")}
          className={`music-category-tab ${filterCategory === "all" ? "active" : ""}`}
        >
          All ({music.length})
        </button>
        {(Object.keys(CATEGORY_LABELS) as MusicCategory[]).map((c) => {
          const count = music.filter((m) => m.category === c).length;
          if (count === 0) return null;
          return (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`music-category-tab ${filterCategory === c ? "active" : ""}`}
            >
              {CATEGORY_LABELS[c]} ({count})
            </button>
          );
        })}
      </div>

      {/* Songs grouped by category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="wedding-card px-5 py-8 text-center">
          <Music className="mx-auto h-8 w-8 text-gold/30" />
          <p className="mt-3 text-[0.85rem] text-sage-dark/50">
            No songs added yet. Start building your perfect playlist!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.entries(grouped) as [MusicCategory, typeof music][]).map(([cat, songs]) => (
            <section key={cat} className="wedding-card px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${CATEGORY_ICONS[cat]}`}>
                  {cat === "do-not-play" ? <Ban className="h-3.5 w-3.5" /> : <Music className="h-3.5 w-3.5" />}
                </div>
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-dusty-rose">
                  {CATEGORY_LABELS[cat]}
                </p>
                <span className="text-[0.62rem] text-sage-dark/40">({songs.length})</span>
              </div>
              <div className="mt-3 space-y-1">
                {songs.map((song, i) => (
                  <div key={song.id} className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-cream/50 transition-colors">
                    <span className="text-[0.68rem] font-medium text-sage-dark/30 w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8rem] font-medium text-sage-dark truncate">{song.title}</p>
                      <p className="text-[0.7rem] text-sage-dark/50 truncate">{song.artist}{song.notes ? ` — ${song.notes}` : ""}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMusicItem(song.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-sage-dark/30 hover:text-mauve"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
