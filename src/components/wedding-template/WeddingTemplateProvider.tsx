"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type RsvpStatus = "pending" | "yes" | "no" | "maybe";

export type Guest = {
  id: string;
  name: string;
  side?: "bride" | "groom" | "both";
  group?: string;
  /** True if this person is invited for the full day (ceremony + dinner), false if only for the party/evening. */
  dayGuest?: boolean;
  saveTheDateSent: boolean;
  inviteSent: boolean;
  rsvp: RsvpStatus;
  plusOne: boolean;
  notes: string;
  tableId?: string | null;
  seatIndex?: number | null;
};

export type TimelineItem = {
  id: string;
  /** Time of the moment, free text like "14:30" or "After ceremony". */
  time: string;
  /** Short title: what happens. */
  title: string;
  /** Optional: where it happens. */
  location?: string;
  /** Optional: who is mainly involved (guests, vendors). */
  people?: string;
  /** Any extra notes. */
  notes?: string;
  /** Optional: images for this timeline item */
  images?: Array<{
    id: string;
    name: string;
    data: string; // base64 encoded image
    uploadedAt: string;
  }>;
  /** Optional: files for this timeline item */
  files?: Array<{
    id: string;
    name: string;
    data: string; // base64 encoded file
    uploadedAt: string;
  }>;
};

export type Table = {
  id: string;
  name: string;
  capacity: number;
  notes?: string;
};

export type VendorCategory =
  | "music"
  | "photography"
  | "video"
  | "flowers"
  | "venue"
  | "planner"
  | "cake"
  | "decor"
  | "transport"
  | "beauty"
  | "other";

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  contact?: string;
  totalCost?: number;
  amountPaid?: number;
  dueDate?: string;
  status?: "researching" | "contacted" | "booked" | "paid";
  notes?: string;
};

type Settings = {
  weddingDate: string; // ISO date string
  brideName: string;
  partnerName: string;
  venueName?: string;
};

export type MusicCategory =
  | "ceremony"
  | "cocktail"
  | "first-dance"
  | "dinner"
  | "party"
  | "special"
  | "do-not-play";

export type PartyMemberRole =
  | "maid-of-honor"
  | "best-man"
  | "bridesmaid"
  | "groomsman"
  | "flower-girl"
  | "ring-bearer"
  | "usher"
  | "reader"
  | "officiant"
  | "other";

export type PartyMember = {
  id: string;
  name: string;
  role: PartyMemberRole;
  side: "bride" | "groom";
  phone?: string;
  email?: string;
  outfit?: string;
  notes?: string;
};

export type MusicItem = {
  id: string;
  title: string;
  artist: string;
  category: MusicCategory;
  notes?: string;
};

export type InspirationBoard = {
  photoInspo: string;
  videoInspo: string;
  colorPalette: string;
  dayMenu: string;
  drinksMenu: string;
  accessories: string;
  ordersChecklist: string;
  otherIdeas: string;
  images: Array<{
    id: string;
    name: string;
    data: string; // base64 encoded image
    uploadedAt: string;
  }>;
  files: Array<{
    id: string;
    name: string;
    data: string; // base64 encoded file
    uploadedAt: string;
  }>;
};

export type WeddingTemplateState = {
  settings: Settings;
  guests: Guest[];
  tables: Table[];
  vendors: Vendor[];
  timeline: TimelineItem[];
  music: MusicItem[];
  weddingParty: PartyMember[];
  inspiration: InspirationBoard;
};

type WeddingTemplateContextValue = {
  state: WeddingTemplateState;
  addGuest: (guest: Omit<Guest, "id">) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
  clearAllGuests: () => void;
  bulkImportGuests: (guests: Omit<Guest, "id">[]) => void;
  addTable: (table: Omit<Table, "id">) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  removeTable: (id: string) => void;
  assignSeat: (guestId: string, tableId: string, seatIndex: number) => void;
  clearSeat: (guestId: string) => void;
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  removeVendor: (id: string) => void;
  addTimelineItem: (item: Omit<TimelineItem, "id">) => void;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  removeTimelineItem: (id: string) => void;
  uploadTimelineImage: (itemId: string, file: File) => Promise<void>;
  removeTimelineImage: (itemId: string, imageId: string) => void;
  uploadTimelineFile: (itemId: string, file: File) => Promise<void>;
  removeTimelineFile: (itemId: string, fileId: string) => void;
  addMusicItem: (item: Omit<MusicItem, "id">) => void;
  removeMusicItem: (id: string) => void;
  addPartyMember: (member: Omit<PartyMember, "id">) => void;
  updatePartyMember: (id: string, updates: Partial<PartyMember>) => void;
  removePartyMember: (id: string) => void;
  updateInspiration: (updates: Partial<InspirationBoard>) => void;
  uploadInspirationImage: (file: File) => Promise<void>;
  removeInspirationImage: (id: string) => void;
  uploadInspirationFile: (file: File) => Promise<void>;
  removeInspirationFile: (id: string) => void;
};

const STORAGE_KEY = "wedding-template-state-v1";

const WeddingTemplateContext = createContext<
  WeddingTemplateContextValue | undefined
>(undefined);

function createInitialState(): WeddingTemplateState {
  return {
    settings: {
      weddingDate: "2026-08-15",
      brideName: "Viktorija",
      partnerName: "Partner",
      venueName: "",
    },
    guests: [],
    tables: [],
    vendors: [],
    timeline: [],
    music: [],
    weddingParty: [],
    inspiration: {
      photoInspo: "",
      videoInspo: "",
      colorPalette: "",
      dayMenu: "",
      drinksMenu: "",
      accessories: "",
      ordersChecklist: "",
      otherIdeas: "",
      images: [],
      files: [],
    },
  };
}

function reviveState(raw: unknown): WeddingTemplateState {
  if (!raw || typeof raw !== "object") {
    return createInitialState();
  }

  const data = raw as any;

  return {
    settings: {
      weddingDate: data.settings?.weddingDate || "2026-08-15",
      brideName: data.settings?.brideName || "Viktorija",
      partnerName: data.settings?.partnerName || "Partner",
      venueName: data.settings?.venueName || "",
    },
    guests: Array.isArray(data.guests)
      ? data.guests.map((g: any) => ({
          id: String(g.id),
          name: String(g.name || ""),
          side: g.side === "bride" || g.side === "groom" || g.side === "both"
            ? g.side
            : undefined,
          group: g.group ? String(g.group) : undefined,
          dayGuest: g.dayGuest === undefined ? true : Boolean(g.dayGuest),
          saveTheDateSent: Boolean(g.saveTheDateSent),
          inviteSent: Boolean(g.inviteSent),
          rsvp:
            g.rsvp === "yes" ||
            g.rsvp === "no" ||
            g.rsvp === "maybe" ||
            g.rsvp === "pending"
              ? g.rsvp
              : "pending",
          plusOne: Boolean(g.plusOne),
          notes: g.notes ? String(g.notes) : "",
          tableId: g.tableId ? String(g.tableId) : null,
          seatIndex:
            typeof g.seatIndex === "number" && g.seatIndex >= 0
              ? g.seatIndex
              : null,
        }))
      : [],
    tables: Array.isArray(data.tables)
      ? data.tables.map((t: any, index: number) => ({
          id: String(t.id || `table-${index + 1}`),
          name: String(t.name || `Table ${index + 1}`),
          capacity:
            typeof t.capacity === "number" && t.capacity > 0
              ? t.capacity
              : 10,
          notes: t.notes ? String(t.notes) : undefined,
        }))
      : [],
    vendors: Array.isArray(data.vendors)
      ? data.vendors.map((v: any, index: number) => ({
          id: String(v.id || `vendor-${index + 1}`),
          name: String(v.name || "Vendor"),
          category: ([
            "music",
            "photography",
            "video",
            "flowers",
            "venue",
            "planner",
            "cake",
            "decor",
            "transport",
            "beauty",
            "other",
          ] as VendorCategory[]).includes(v.category)
            ? v.category
            : "other",
          contact: v.contact ? String(v.contact) : undefined,
          totalCost:
            typeof v.totalCost === "number" ? v.totalCost : undefined,
          amountPaid:
            typeof v.amountPaid === "number" ? v.amountPaid : undefined,
          dueDate: v.dueDate ? String(v.dueDate) : undefined,
          status:
            v.status === "researching" ||
            v.status === "contacted" ||
            v.status === "booked" ||
            v.status === "paid"
              ? v.status
              : "researching",
          notes: v.notes ? String(v.notes) : undefined,
        }))
      : [],
    timeline: Array.isArray(data.timeline)
      ? data.timeline.map((t: any, index: number) => ({
          id: String(t.id || `timeline-${index + 1}`),
          time: t.time ? String(t.time) : "",
          title: t.title ? String(t.title) : "",
          location: t.location ? String(t.location) : undefined,
          people: t.people ? String(t.people) : undefined,
          notes: t.notes ? String(t.notes) : undefined,
          images: Array.isArray(t.images)
            ? t.images.map((img: any) => ({
                id: String(img.id || `img-${Date.now()}`),
                name: String(img.name || "image"),
                data: String(img.data || ""),
                uploadedAt: String(img.uploadedAt || new Date().toISOString()),
              }))
            : undefined,
          files: Array.isArray(t.files)
            ? t.files.map((file: any) => ({
                id: String(file.id || `file-${Date.now()}`),
                name: String(file.name || "file"),
                data: String(file.data || ""),
                uploadedAt: String(file.uploadedAt || new Date().toISOString()),
              }))
            : undefined,
        }))
      : [],
    inspiration: {
      photoInspo: data.inspiration?.photoInspo
        ? String(data.inspiration.photoInspo)
        : "",
      videoInspo: data.inspiration?.videoInspo
        ? String(data.inspiration.videoInspo)
        : "",
      colorPalette: data.inspiration?.colorPalette
        ? String(data.inspiration.colorPalette)
        : "",
      dayMenu: data.inspiration?.dayMenu
        ? String(data.inspiration.dayMenu)
        : "",
      drinksMenu: data.inspiration?.drinksMenu
        ? String(data.inspiration.drinksMenu)
        : "",
      accessories: data.inspiration?.accessories
        ? String(data.inspiration.accessories)
        : "",
      ordersChecklist: data.inspiration?.ordersChecklist
        ? String(data.inspiration.ordersChecklist)
        : "",
      otherIdeas: data.inspiration?.otherIdeas
        ? String(data.inspiration.otherIdeas)
        : "",
      images: Array.isArray(data.inspiration?.images)
        ? data.inspiration.images.map((img: any) => ({
            id: String(img.id || `img-${Date.now()}`),
            name: String(img.name || "image"),
            data: String(img.data || ""),
            uploadedAt: String(img.uploadedAt || new Date().toISOString()),
          }))
        : [],
      files: Array.isArray(data.inspiration?.files)
        ? data.inspiration.files.map((file: any) => ({
            id: String(file.id || `file-${Date.now()}`),
            name: String(file.name || "file"),
            data: String(file.data || ""),
            uploadedAt: String(file.uploadedAt || new Date().toISOString()),
          }))
        : [],
    },
    music: Array.isArray(data.music)
      ? data.music.map((m: any, index: number) => ({
          id: String(m.id || `music-${index + 1}`),
          title: String(m.title || ""),
          artist: String(m.artist || ""),
          category: (
            [
              "ceremony",
              "cocktail",
              "first-dance",
              "dinner",
              "party",
              "special",
              "do-not-play",
            ] as MusicCategory[]
          ).includes(m.category)
            ? m.category
            : "party",
          notes: m.notes ? String(m.notes) : undefined,
        }))
      : [],
    weddingParty: Array.isArray(data.weddingParty)
      ? data.weddingParty.map((p: any, index: number) => ({
          id: String(p.id || `party-${index + 1}`),
          name: String(p.name || ""),
          role: (
            [
              "maid-of-honor",
              "best-man",
              "bridesmaid",
              "groomsman",
              "flower-girl",
              "ring-bearer",
              "usher",
              "reader",
              "officiant",
              "other",
            ] as PartyMemberRole[]
          ).includes(p.role)
            ? p.role
            : "other",
          side: p.side === "bride" || p.side === "groom" ? p.side : "bride",
          phone: p.phone ? String(p.phone) : undefined,
          email: p.email ? String(p.email) : undefined,
          outfit: p.outfit ? String(p.outfit) : undefined,
          notes: p.notes ? String(p.notes) : undefined,
        }))
      : [],
  };
}

export function WeddingTemplateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<WeddingTemplateState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialState();
      const parsed = JSON.parse(raw);
      return reviveState(parsed);
    } catch {
      return createInitialState();
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors (e.g. private mode)
    }
  }, [state]);

  const value: WeddingTemplateContextValue = useMemo(
    () => ({
      state,
      addGuest: (guestInput) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const guest: Guest = {
          id,
          name: guestInput.name,
          side: guestInput.side,
          group: guestInput.group,
          dayGuest: guestInput.dayGuest ?? true,
          saveTheDateSent: guestInput.saveTheDateSent ?? false,
          inviteSent: guestInput.inviteSent ?? false,
          rsvp: guestInput.rsvp ?? "pending",
          plusOne: guestInput.plusOne ?? false,
          notes: guestInput.notes ?? "",
          tableId: guestInput.tableId ?? null,
          seatIndex:
            typeof guestInput.seatIndex === "number"
              ? guestInput.seatIndex
              : null,
        };
        setState((prev) => ({
          ...prev,
          guests: [...prev.guests, guest],
        }));
      },
      updateGuest: (id, updates) => {
        setState((prev) => ({
          ...prev,
          guests: prev.guests.map((g) =>
            g.id === id
              ? {
                  ...g,
                  ...updates,
                }
              : g
          ),
        }));
      },
      removeGuest: (id) => {
        setState((prev) => ({
          ...prev,
          guests: prev.guests.filter((g) => g.id !== id),
        }));
      },
      clearAllGuests: () => {
        setState((prev) => ({
          ...prev,
          guests: [],
        }));
      },
      bulkImportGuests: (guestsToImport) => {
        const newGuests = guestsToImport.map((guest) => ({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: guest.name,
          side: guest.side,
          group: guest.group,
          dayGuest: guest.dayGuest ?? true,
          saveTheDateSent: guest.saveTheDateSent ?? false,
          inviteSent: guest.inviteSent ?? false,
          rsvp: guest.rsvp ?? ("pending" as RsvpStatus),
          plusOne: guest.plusOne ?? false,
          notes: guest.notes ?? "",
          tableId: guest.tableId ?? null,
          seatIndex: guest.seatIndex ?? null,
        }));
        setState((prev) => ({
          ...prev,
          guests: [...prev.guests, ...newGuests],
        }));
      },
      addTable: (tableInput) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `table-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const table: Table = {
          id,
          name: tableInput.name || `Table ${state.tables.length + 1}`,
          capacity:
            typeof tableInput.capacity === "number" && tableInput.capacity > 0
              ? tableInput.capacity
              : 10,
          notes: tableInput.notes,
        };
        setState((prev) => ({
          ...prev,
          tables: [...prev.tables, table],
        }));
      },
      updateTable: (id, updates) => {
        setState((prev) => ({
          ...prev,
          tables: prev.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                }
              : t
          ),
        }));
      },
      removeTable: (id) => {
        setState((prev) => ({
          ...prev,
          tables: prev.tables.filter((t) => t.id !== id),
          guests: prev.guests.map((g) =>
            g.tableId === id
              ? {
                  ...g,
                  tableId: null,
                  seatIndex: null,
                }
              : g
          ),
        }));
      },
      assignSeat: (guestId, tableId, seatIndex) => {
        setState((prev) => ({
          ...prev,
          guests: prev.guests.map((g) => {
            // Clear any guest currently in this seat
            if (g.tableId === tableId && g.seatIndex === seatIndex) {
              return {
                ...g,
                tableId: null,
                seatIndex: null,
              };
            }
            // Move the dragged guest
            if (g.id === guestId) {
              return {
                ...g,
                tableId,
                seatIndex,
              };
            }
            return g;
          }),
        }));
      },
      clearSeat: (guestId) => {
        setState((prev) => ({
          ...prev,
          guests: prev.guests.map((g) =>
            g.id === guestId
              ? {
                  ...g,
                  tableId: null,
                  seatIndex: null,
                }
              : g
          ),
        }));
      },
      addVendor: (vendorInput) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `vendor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const vendor: Vendor = {
          id,
          name: vendorInput.name,
          category: vendorInput.category ?? "other",
          contact: vendorInput.contact,
          totalCost: vendorInput.totalCost,
          amountPaid: vendorInput.amountPaid ?? 0,
          dueDate: vendorInput.dueDate,
          status: vendorInput.status ?? "researching",
          notes: vendorInput.notes,
        };
        setState((prev) => ({
          ...prev,
          vendors: [...prev.vendors, vendor],
        }));
      },
      updateVendor: (id, updates) => {
        setState((prev) => ({
          ...prev,
          vendors: prev.vendors.map((v) =>
            v.id === id
              ? {
                  ...v,
                  ...updates,
                }
              : v
          ),
        }));
      },
      removeVendor: (id) => {
        setState((prev) => ({
          ...prev,
          vendors: prev.vendors.filter((v) => v.id !== id),
        }));
      },
      addTimelineItem: (itemInput) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `timeline-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const item: TimelineItem = {
          id,
          time: itemInput.time,
          title: itemInput.title,
          location: itemInput.location,
          people: itemInput.people,
          notes: itemInput.notes,
        };
        setState((prev) => ({
          ...prev,
          timeline: [...prev.timeline, item],
        }));
      },
      updateTimelineItem: (id, updates) => {
        setState((prev) => ({
          ...prev,
          timeline: prev.timeline.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                }
              : t
          ),
        }));
      },
      removeTimelineItem: (id) => {
        setState((prev) => ({
          ...prev,
          timeline: prev.timeline.filter((t) => t.id !== id),
        }));
      },
      uploadTimelineImage: async (itemId: string, file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const imageId = typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            setState((prev) => ({
              ...prev,
              timeline: prev.timeline.map((t) =>
                t.id === itemId
                  ? {
                      ...t,
                      images: [
                        ...(t.images || []),
                        {
                          id: imageId,
                          name: file.name,
                          data: base64,
                          uploadedAt: new Date().toISOString(),
                        },
                      ],
                    }
                  : t
              ),
            }));
            resolve();
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      },
      removeTimelineImage: (itemId: string, imageId: string) => {
        setState((prev) => ({
          ...prev,
          timeline: prev.timeline.map((t) =>
            t.id === itemId
              ? {
                  ...t,
                  images: (t.images || []).filter((img) => img.id !== imageId),
                }
              : t
          ),
        }));
      },
      uploadTimelineFile: async (itemId: string, file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const fileId = typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `file-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            setState((prev) => ({
              ...prev,
              timeline: prev.timeline.map((t) =>
                t.id === itemId
                  ? {
                      ...t,
                      files: [
                        ...(t.files || []),
                        {
                          id: fileId,
                          name: file.name,
                          data: base64,
                          uploadedAt: new Date().toISOString(),
                        },
                      ],
                    }
                  : t
              ),
            }));
            resolve();
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      },
      removeTimelineFile: (itemId: string, fileId: string) => {
        setState((prev) => ({
          ...prev,
          timeline: prev.timeline.map((t) =>
            t.id === itemId
              ? {
                  ...t,
                  files: (t.files || []).filter((file) => file.id !== fileId),
                }
              : t
          ),
        }));
      },
      updateInspiration: (updates) => {
        setState((prev) => ({
          ...prev,
          inspiration: {
            ...prev.inspiration,
            ...updates,
          },
        }));
      },
      uploadInspirationImage: async (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const id = typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            setState((prev) => ({
              ...prev,
              inspiration: {
                ...prev.inspiration,
                images: [
                  ...prev.inspiration.images,
                  {
                    id,
                    name: file.name,
                    data: base64,
                    uploadedAt: new Date().toISOString(),
                  },
                ],
              },
            }));
            resolve();
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      },
      removeInspirationImage: (id: string) => {
        setState((prev) => ({
          ...prev,
          inspiration: {
            ...prev.inspiration,
            images: prev.inspiration.images.filter((img) => img.id !== id),
          },
        }));
      },
      uploadInspirationFile: async (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const id = typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `file-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            setState((prev) => ({
              ...prev,
              inspiration: {
                ...prev.inspiration,
                files: [
                  ...prev.inspiration.files,
                  {
                    id,
                    name: file.name,
                    data: base64,
                    uploadedAt: new Date().toISOString(),
                  },
                ],
              },
            }));
            resolve();
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      },
      removeInspirationFile: (id: string) => {
        setState((prev) => ({
          ...prev,
          inspiration: {
            ...prev.inspiration,
            files: prev.inspiration.files.filter((file) => file.id !== id),
          },
        }));
      },
      addMusicItem: (musicInput) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `music-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const musicItem: MusicItem = {
          id,
          title: musicInput.title,
          artist: musicInput.artist,
          category: musicInput.category,
          notes: musicInput.notes,
        };
        setState((prev) => ({
          ...prev,
          music: [...prev.music, musicItem],
        }));
      },
      removeMusicItem: (id: string) => {
        setState((prev) => ({
          ...prev,
          music: prev.music.filter((m) => m.id !== id),
        }));
      },
      addPartyMember: (memberInput) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `party-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const member: PartyMember = {
          id,
          name: memberInput.name,
          role: memberInput.role,
          side: memberInput.side,
          phone: memberInput.phone,
          email: memberInput.email,
          outfit: memberInput.outfit,
          notes: memberInput.notes,
        };
        setState((prev) => ({
          ...prev,
          weddingParty: [...prev.weddingParty, member],
        }));
      },
      updatePartyMember: (id, updates) => {
        setState((prev) => ({
          ...prev,
          weddingParty: prev.weddingParty.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },
      removePartyMember: (id: string) => {
        setState((prev) => ({
          ...prev,
          weddingParty: prev.weddingParty.filter((m) => m.id !== id),
        }));
      },
    }),
    [state]
  );

  return (
    <WeddingTemplateContext.Provider value={value}>
      {children}
    </WeddingTemplateContext.Provider>
  );
}

export function useWeddingTemplate(): WeddingTemplateContextValue {
  const ctx = useContext(WeddingTemplateContext);
  if (!ctx) {
    throw new Error(
      "useWeddingTemplate must be used within a WeddingTemplateProvider"
    );
  }
  return ctx;
}

