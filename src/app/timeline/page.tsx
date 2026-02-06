"use client";

import { FormEvent, useRef, useMemo, useState } from "react";
import {
  TimelineItem,
  useWeddingTemplate,
} from "@/components/wedding-template/WeddingTemplateProvider";

type SortMode = "time" | "manual";

export default function TimelinePage() {
  const {
    state: { timeline, settings },
    addTimelineItem,
    updateTimelineItem,
    removeTimelineItem,
    uploadTimelineImage,
    removeTimelineImage,
    uploadTimelineFile,
    removeTimelineFile,
  } = useWeddingTemplate();

  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [notes, setNotes] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [printMode, setPrintMode] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<Record<string, boolean>>({});
  const [uploadingFile, setUploadingFile] = useState<Record<string, boolean>>({});
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const sortedTimeline = useMemo(() => {
    if (sortMode === "manual") return timeline;
    // Very soft sort by time if it looks like HH:MM
    const parseTime = (t: string) => {
      const match = t.match(/^(\d{1,2}):(\d{2})/);
      if (!match) return Number.POSITIVE_INFINITY;
      const h = Number(match[1]);
      const m = Number(match[2]);
      return h * 60 + m;
    };
    return [...timeline].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  }, [timeline, sortMode]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addTimelineItem({
      time: time.trim(),
      title: title.trim(),
      location: location.trim() || undefined,
      people: people.trim() || undefined,
      notes: notes.trim() || undefined,
      images: [],
      files: [],
    });

    setTime("");
    setTitle("");
    setLocation("");
    setPeople("");
    setNotes("");
  }

  const handleImageUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage((prev) => ({ ...prev, [itemId]: true }));
    try {
      await uploadTimelineImage(itemId, file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage((prev) => ({ ...prev, [itemId]: false }));
      if (imageInputRefs.current[itemId]) {
        imageInputRefs.current[itemId]!.value = "";
      }
    }
  };

  const handleFileUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile((prev) => ({ ...prev, [itemId]: true }));
    try {
      await uploadTimelineFile(itemId, file);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploadingFile((prev) => ({ ...prev, [itemId]: false }));
      if (fileInputRefs.current[itemId]) {
        fileInputRefs.current[itemId]!.value = "";
      }
    }
  };

  function friendlyDateLabel() {
    return settings.weddingDate || "Wedding day";
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="wedding-card px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
              Timeline
            </p>
            <h2 className="mt-1 font-display text-xl text-sage-dark md:text-2xl">
              Wedding day schedule
            </h2>
            <p className="mt-2 max-w-xl text-[0.8rem] text-sage-dark/80">
              Plan out your day from getting ready to the last dance. This is
              where you can see{" "}
              <span className="font-medium">what happens, when, and who</span>{" "}
              is involved.
            </p>
          </div>
          <div className="text-right text-[0.8rem] text-sage-dark/80 space-y-1.5">
            <p className="uppercase tracking-[0.18em] text-sage-dark/70">
              Wedding date
            </p>
            <p className="mt-1 font-display text-base text-sage-dark">
              {friendlyDateLabel()}
            </p>
            <p className="text-[0.7rem]">
              Sort by{" "}
              <button
                type="button"
                onClick={() =>
                  setSortMode((prev) => (prev === "time" ? "manual" : "time"))
                }
                className="underline decoration-dotted underline-offset-4"
              >
                {sortMode === "time" ? "time" : "manual order"}
              </button>
            </p>
            <button
              type="button"
              onClick={() => setPrintMode((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-full border border-sage/40 bg-white/80 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-sage-dark shadow-sm transition hover:border-gold"
            >
              {printMode ? "Exit print view" : "Print-friendly view"}
            </button>
          </div>
        </div>

        {!printMode && (
          <form
            onSubmit={handleAdd}
            className="mt-4 grid gap-3 text-[0.8rem] md:grid-cols-[minmax(0,0.7fr),minmax(0,1.4fr)]"
          >
            <div className="space-y-2 rounded-lg border border-sage/20 bg-ivory/70 p-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Time
                </label>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 14:30, After ceremony"
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Where
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ceremony, church, venue terrace..."
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-sage/20 bg-ivory/70 p-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  What happens
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ceremony, First dance, Cake cutting..."
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80">
                  Who is involved
                </label>
                <input
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="E.g. Viktorija & partner, parents, band, photographer"
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
                  placeholder="Special songs, reminders, who walks when, speeches..."
                  className="w-full rounded-md border border-sage/30 bg-white/80 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none focus:border-gold"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-gold/70 bg-gradient-to-r from-gold/90 to-gold text-xs font-semibold uppercase tracking-[0.22em] text-white px-4 py-2 shadow-sm transition hover:from-gold hover:to-gold/90 hover:shadow-md"
                >
                  Add to timeline
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      <section className="wedding-card px-4 py-4 md:px-5 md:py-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs tracking-[0.2em] uppercase text-sage-dark/70">
            Day flow
          </p>
          <p className="text-[0.75rem] text-sage-dark/75">
            You can print this page or screenshot it for your planner,
            photographer or band.
          </p>
        </div>

        {sortedTimeline.length === 0 ? (
          <p className="mt-3 text-[0.8rem] text-sage-dark/75">
            Start by adding your first moment above. Examples: &quot;Getting
            ready&quot;, &quot;Ceremony&quot;, &quot;Photos with family&quot;,
            &quot;First dance&quot;, &quot;Cake&quot;, &quot;Party&quot;.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {sortedTimeline.map((item: TimelineItem, index) => (
              <li
                key={item.id}
                className="relative rounded-lg border border-sage/25 bg-white/90 px-3 py-3 text-[0.8rem] text-sage-dark shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 text-[0.8rem] font-medium text-sage-dark">
                    {item.time || `${index + 1}.`}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateTimelineItem(item.id, {
                            title: e.target.value,
                          })
                        }
                        className="w-full rounded-md border-none bg-transparent px-0 py-0 text-[0.85rem] font-semibold text-sage-dark outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove "${item.title || "this moment"}" from the timeline?`
                            )
                          ) {
                            removeTimelineItem(item.id);
                          }
                        }}
                        className="text-[0.7rem] text-sage-dark/60 hover:text-[#b54b4b]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-2 text-[0.75rem] text-sage-dark/80 md:grid-cols-3">
                      <div className="space-y-0.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage-dark/70">
                          Time
                        </p>
                        <input
                          value={item.time}
                          onChange={(e) =>
                            updateTimelineItem(item.id, {
                              time: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-sage/25 bg-white/90 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage-dark/70">
                          Where
                        </p>
                        <input
                          value={item.location ?? ""}
                          onChange={(e) =>
                            updateTimelineItem(item.id, {
                              location: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-sage/25 bg-white/90 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage-dark/70">
                          Who
                        </p>
                        <input
                          value={item.people ?? ""}
                          onChange={(e) =>
                            updateTimelineItem(item.id, {
                              people: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-sage/25 bg-white/90 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                    <div className="mt-2 space-y-0.5 text-[0.75rem] text-sage-dark/80">
                      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage-dark/70">
                        Notes
                      </p>
                      <textarea
                        value={item.notes ?? ""}
                        onChange={(e) =>
                          updateTimelineItem(item.id, {
                            notes: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full rounded-md border border-sage/25 bg-white/90 px-2 py-1 text-[0.75rem] text-sage-dark outline-none focus:border-gold"
                      />
                    </div>

                    <div className="mt-3 space-y-3 border-t border-sage/20 pt-3">
                      <div className="space-y-2">
                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage-dark/70">
                          Upload images
                        </p>
                        <input
                          ref={(el) => {
                            if (el) imageInputRefs.current[item.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(item.id, e)}
                          disabled={uploadingImage[item.id]}
                          className="w-full rounded-md border border-sage/25 bg-white/90 px-2 py-1 text-[0.7rem] text-sage-dark file:rounded-md file:border-0 file:bg-gold file:px-2 file:py-0.5 file:text-white file:cursor-pointer disabled:opacity-50"
                        />
                        {uploadingImage[item.id] && (
                          <p className="text-[0.65rem] text-sage-dark/70 italic">Uploading...</p>
                        )}
                        {(item.images ?? []).length > 0 && (
                          <div className="grid grid-cols-4 gap-1">
                            {item.images!.map((img) => (
                              <div
                                key={img.id}
                                className="relative group rounded-md overflow-hidden bg-ivory border border-sage/25"
                              >
                                <img
                                  src={img.data}
                                  alt={img.name}
                                  className="w-full h-12 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTimelineImage(item.id, img.id)
                                  }
                                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[0.6rem] font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sage-dark/70">
                          Upload files
                        </p>
                        <input
                          ref={(el) => {
                            if (el) fileInputRefs.current[item.id] = el;
                          }}
                          type="file"
                          onChange={(e) => handleFileUpload(item.id, e)}
                          disabled={uploadingFile[item.id]}
                          className="w-full rounded-md border border-sage/25 bg-white/90 px-2 py-1 text-[0.7rem] text-sage-dark file:rounded-md file:border-0 file:bg-gold file:px-2 file:py-0.5 file:text-white file:cursor-pointer disabled:opacity-50"
                        />
                        {uploadingFile[item.id] && (
                          <p className="text-[0.65rem] text-sage-dark/70 italic">Uploading...</p>
                        )}
                        {(item.files ?? []).length > 0 && (
                          <ul className="space-y-1">
                            {item.files!.map((file) => (
                              <li
                                key={file.id}
                                className="flex items-center justify-between gap-1 p-1 rounded-md bg-ivory border border-sage/25 text-[0.65rem] text-sage-dark"
                              >
                                <span className="truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTimelineFile(item.id, file.id)
                                  }
                                  className="flex-shrink-0 text-gold hover:text-gold/80 font-medium text-[0.6rem]"
                                >
                                  ✕
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

