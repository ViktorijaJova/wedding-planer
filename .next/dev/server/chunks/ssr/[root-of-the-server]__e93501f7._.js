module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/components/wedding-template/WeddingTemplateProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WeddingTemplateProvider",
    ()=>WeddingTemplateProvider,
    "useWeddingTemplate",
    ()=>useWeddingTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const STORAGE_KEY = "wedding-template-state-v1";
const WeddingTemplateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function createInitialState() {
    return {
        settings: {
            weddingDate: "2026-08-15",
            brideName: "Viktorija",
            partnerName: "Partner",
            venueName: ""
        },
        guests: [],
        tables: [],
        vendors: [],
        timeline: [],
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
            files: []
        }
    };
}
function reviveState(raw) {
    if (!raw || typeof raw !== "object") {
        return createInitialState();
    }
    const data = raw;
    return {
        settings: {
            weddingDate: data.settings?.weddingDate || "2026-08-15",
            brideName: data.settings?.brideName || "Viktorija",
            partnerName: data.settings?.partnerName || "Partner",
            venueName: data.settings?.venueName || ""
        },
        guests: Array.isArray(data.guests) ? data.guests.map((g)=>({
                id: String(g.id),
                name: String(g.name || ""),
                side: g.side === "bride" || g.side === "groom" || g.side === "both" ? g.side : undefined,
                group: g.group ? String(g.group) : undefined,
                dayGuest: g.dayGuest === undefined ? true : Boolean(g.dayGuest),
                saveTheDateSent: Boolean(g.saveTheDateSent),
                inviteSent: Boolean(g.inviteSent),
                rsvp: g.rsvp === "yes" || g.rsvp === "no" || g.rsvp === "maybe" || g.rsvp === "pending" ? g.rsvp : "pending",
                plusOne: Boolean(g.plusOne),
                notes: g.notes ? String(g.notes) : "",
                tableId: g.tableId ? String(g.tableId) : null,
                seatIndex: typeof g.seatIndex === "number" && g.seatIndex >= 0 ? g.seatIndex : null
            })) : [],
        tables: Array.isArray(data.tables) ? data.tables.map((t, index)=>({
                id: String(t.id || `table-${index + 1}`),
                name: String(t.name || `Table ${index + 1}`),
                capacity: typeof t.capacity === "number" && t.capacity > 0 ? t.capacity : 10,
                notes: t.notes ? String(t.notes) : undefined
            })) : [],
        vendors: Array.isArray(data.vendors) ? data.vendors.map((v, index)=>({
                id: String(v.id || `vendor-${index + 1}`),
                name: String(v.name || "Vendor"),
                category: [
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
                    "other"
                ].includes(v.category) ? v.category : "other",
                contact: v.contact ? String(v.contact) : undefined,
                totalCost: typeof v.totalCost === "number" ? v.totalCost : undefined,
                amountPaid: typeof v.amountPaid === "number" ? v.amountPaid : undefined,
                dueDate: v.dueDate ? String(v.dueDate) : undefined,
                status: v.status === "researching" || v.status === "contacted" || v.status === "booked" || v.status === "paid" ? v.status : "researching",
                notes: v.notes ? String(v.notes) : undefined
            })) : [],
        timeline: Array.isArray(data.timeline) ? data.timeline.map((t, index)=>({
                id: String(t.id || `timeline-${index + 1}`),
                time: t.time ? String(t.time) : "",
                title: t.title ? String(t.title) : "",
                location: t.location ? String(t.location) : undefined,
                people: t.people ? String(t.people) : undefined,
                notes: t.notes ? String(t.notes) : undefined,
                images: Array.isArray(t.images) ? t.images.map((img)=>({
                        id: String(img.id || `img-${Date.now()}`),
                        name: String(img.name || "image"),
                        data: String(img.data || ""),
                        uploadedAt: String(img.uploadedAt || new Date().toISOString())
                    })) : undefined,
                files: Array.isArray(t.files) ? t.files.map((file)=>({
                        id: String(file.id || `file-${Date.now()}`),
                        name: String(file.name || "file"),
                        data: String(file.data || ""),
                        uploadedAt: String(file.uploadedAt || new Date().toISOString())
                    })) : undefined
            })) : [],
        inspiration: {
            photoInspo: data.inspiration?.photoInspo ? String(data.inspiration.photoInspo) : "",
            videoInspo: data.inspiration?.videoInspo ? String(data.inspiration.videoInspo) : "",
            colorPalette: data.inspiration?.colorPalette ? String(data.inspiration.colorPalette) : "",
            dayMenu: data.inspiration?.dayMenu ? String(data.inspiration.dayMenu) : "",
            drinksMenu: data.inspiration?.drinksMenu ? String(data.inspiration.drinksMenu) : "",
            accessories: data.inspiration?.accessories ? String(data.inspiration.accessories) : "",
            ordersChecklist: data.inspiration?.ordersChecklist ? String(data.inspiration.ordersChecklist) : "",
            otherIdeas: data.inspiration?.otherIdeas ? String(data.inspiration.otherIdeas) : "",
            images: Array.isArray(data.inspiration?.images) ? data.inspiration.images.map((img)=>({
                    id: String(img.id || `img-${Date.now()}`),
                    name: String(img.name || "image"),
                    data: String(img.data || ""),
                    uploadedAt: String(img.uploadedAt || new Date().toISOString())
                })) : [],
            files: Array.isArray(data.inspiration?.files) ? data.inspiration.files.map((file)=>({
                    id: String(file.id || `file-${Date.now()}`),
                    name: String(file.name || "file"),
                    data: String(file.data || ""),
                    uploadedAt: String(file.uploadedAt || new Date().toISOString())
                })) : []
        }
    };
}
function WeddingTemplateProvider({ children }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return createInitialState();
        }
        //TURBOPACK unreachable
        ;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        state
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            state,
            addGuest: (guestInput)=>{
                const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                const guest = {
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
                    seatIndex: typeof guestInput.seatIndex === "number" ? guestInput.seatIndex : null
                };
                setState((prev)=>({
                        ...prev,
                        guests: [
                            ...prev.guests,
                            guest
                        ]
                    }));
            },
            updateGuest: (id, updates)=>{
                setState((prev)=>({
                        ...prev,
                        guests: prev.guests.map((g)=>g.id === id ? {
                                ...g,
                                ...updates
                            } : g)
                    }));
            },
            removeGuest: (id)=>{
                setState((prev)=>({
                        ...prev,
                        guests: prev.guests.filter((g)=>g.id !== id)
                    }));
            },
            clearAllGuests: ()=>{
                setState((prev)=>({
                        ...prev,
                        guests: []
                    }));
            },
            addTable: (tableInput)=>{
                const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `table-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                const table = {
                    id,
                    name: tableInput.name || `Table ${state.tables.length + 1}`,
                    capacity: typeof tableInput.capacity === "number" && tableInput.capacity > 0 ? tableInput.capacity : 10,
                    notes: tableInput.notes
                };
                setState((prev)=>({
                        ...prev,
                        tables: [
                            ...prev.tables,
                            table
                        ]
                    }));
            },
            updateTable: (id, updates)=>{
                setState((prev)=>({
                        ...prev,
                        tables: prev.tables.map((t)=>t.id === id ? {
                                ...t,
                                ...updates
                            } : t)
                    }));
            },
            removeTable: (id)=>{
                setState((prev)=>({
                        ...prev,
                        tables: prev.tables.filter((t)=>t.id !== id),
                        guests: prev.guests.map((g)=>g.tableId === id ? {
                                ...g,
                                tableId: null,
                                seatIndex: null
                            } : g)
                    }));
            },
            assignSeat: (guestId, tableId, seatIndex)=>{
                setState((prev)=>({
                        ...prev,
                        guests: prev.guests.map((g)=>{
                            // Clear any guest currently in this seat
                            if (g.tableId === tableId && g.seatIndex === seatIndex) {
                                return {
                                    ...g,
                                    tableId: null,
                                    seatIndex: null
                                };
                            }
                            // Move the dragged guest
                            if (g.id === guestId) {
                                return {
                                    ...g,
                                    tableId,
                                    seatIndex
                                };
                            }
                            return g;
                        })
                    }));
            },
            clearSeat: (guestId)=>{
                setState((prev)=>({
                        ...prev,
                        guests: prev.guests.map((g)=>g.id === guestId ? {
                                ...g,
                                tableId: null,
                                seatIndex: null
                            } : g)
                    }));
            },
            addVendor: (vendorInput)=>{
                const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `vendor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                const vendor = {
                    id,
                    name: vendorInput.name,
                    category: vendorInput.category ?? "other",
                    contact: vendorInput.contact,
                    totalCost: vendorInput.totalCost,
                    amountPaid: vendorInput.amountPaid ?? 0,
                    dueDate: vendorInput.dueDate,
                    status: vendorInput.status ?? "researching",
                    notes: vendorInput.notes
                };
                setState((prev)=>({
                        ...prev,
                        vendors: [
                            ...prev.vendors,
                            vendor
                        ]
                    }));
            },
            updateVendor: (id, updates)=>{
                setState((prev)=>({
                        ...prev,
                        vendors: prev.vendors.map((v)=>v.id === id ? {
                                ...v,
                                ...updates
                            } : v)
                    }));
            },
            removeVendor: (id)=>{
                setState((prev)=>({
                        ...prev,
                        vendors: prev.vendors.filter((v)=>v.id !== id)
                    }));
            },
            addTimelineItem: (itemInput)=>{
                const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `timeline-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                const item = {
                    id,
                    time: itemInput.time,
                    title: itemInput.title,
                    location: itemInput.location,
                    people: itemInput.people,
                    notes: itemInput.notes
                };
                setState((prev)=>({
                        ...prev,
                        timeline: [
                            ...prev.timeline,
                            item
                        ]
                    }));
            },
            updateTimelineItem: (id, updates)=>{
                setState((prev)=>({
                        ...prev,
                        timeline: prev.timeline.map((t)=>t.id === id ? {
                                ...t,
                                ...updates
                            } : t)
                    }));
            },
            removeTimelineItem: (id)=>{
                setState((prev)=>({
                        ...prev,
                        timeline: prev.timeline.filter((t)=>t.id !== id)
                    }));
            },
            uploadTimelineImage: async (itemId, file)=>{
                return new Promise((resolve, reject)=>{
                    const reader = new FileReader();
                    reader.onload = ()=>{
                        const base64 = reader.result;
                        const imageId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                        setState((prev)=>({
                                ...prev,
                                timeline: prev.timeline.map((t)=>t.id === itemId ? {
                                        ...t,
                                        images: [
                                            ...t.images || [],
                                            {
                                                id: imageId,
                                                name: file.name,
                                                data: base64,
                                                uploadedAt: new Date().toISOString()
                                            }
                                        ]
                                    } : t)
                            }));
                        resolve();
                    };
                    reader.onerror = ()=>reject(reader.error);
                    reader.readAsDataURL(file);
                });
            },
            removeTimelineImage: (itemId, imageId)=>{
                setState((prev)=>({
                        ...prev,
                        timeline: prev.timeline.map((t)=>t.id === itemId ? {
                                ...t,
                                images: (t.images || []).filter((img)=>img.id !== imageId)
                            } : t)
                    }));
            },
            uploadTimelineFile: async (itemId, file)=>{
                return new Promise((resolve, reject)=>{
                    const reader = new FileReader();
                    reader.onload = ()=>{
                        const base64 = reader.result;
                        const fileId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `file-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                        setState((prev)=>({
                                ...prev,
                                timeline: prev.timeline.map((t)=>t.id === itemId ? {
                                        ...t,
                                        files: [
                                            ...t.files || [],
                                            {
                                                id: fileId,
                                                name: file.name,
                                                data: base64,
                                                uploadedAt: new Date().toISOString()
                                            }
                                        ]
                                    } : t)
                            }));
                        resolve();
                    };
                    reader.onerror = ()=>reject(reader.error);
                    reader.readAsDataURL(file);
                });
            },
            removeTimelineFile: (itemId, fileId)=>{
                setState((prev)=>({
                        ...prev,
                        timeline: prev.timeline.map((t)=>t.id === itemId ? {
                                ...t,
                                files: (t.files || []).filter((file)=>file.id !== fileId)
                            } : t)
                    }));
            },
            updateInspiration: (updates)=>{
                setState((prev)=>({
                        ...prev,
                        inspiration: {
                            ...prev.inspiration,
                            ...updates
                        }
                    }));
            },
            uploadInspirationImage: async (file)=>{
                return new Promise((resolve, reject)=>{
                    const reader = new FileReader();
                    reader.onload = ()=>{
                        const base64 = reader.result;
                        const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                        setState((prev)=>({
                                ...prev,
                                inspiration: {
                                    ...prev.inspiration,
                                    images: [
                                        ...prev.inspiration.images,
                                        {
                                            id,
                                            name: file.name,
                                            data: base64,
                                            uploadedAt: new Date().toISOString()
                                        }
                                    ]
                                }
                            }));
                        resolve();
                    };
                    reader.onerror = ()=>reject(reader.error);
                    reader.readAsDataURL(file);
                });
            },
            removeInspirationImage: (id)=>{
                setState((prev)=>({
                        ...prev,
                        inspiration: {
                            ...prev.inspiration,
                            images: prev.inspiration.images.filter((img)=>img.id !== id)
                        }
                    }));
            },
            uploadInspirationFile: async (file)=>{
                return new Promise((resolve, reject)=>{
                    const reader = new FileReader();
                    reader.onload = ()=>{
                        const base64 = reader.result;
                        const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `file-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                        setState((prev)=>({
                                ...prev,
                                inspiration: {
                                    ...prev.inspiration,
                                    files: [
                                        ...prev.inspiration.files,
                                        {
                                            id,
                                            name: file.name,
                                            data: base64,
                                            uploadedAt: new Date().toISOString()
                                        }
                                    ]
                                }
                            }));
                        resolve();
                    };
                    reader.onerror = ()=>reject(reader.error);
                    reader.readAsDataURL(file);
                });
            },
            removeInspirationFile: (id)=>{
                setState((prev)=>({
                        ...prev,
                        inspiration: {
                            ...prev.inspiration,
                            files: prev.inspiration.files.filter((file)=>file.id !== id)
                        }
                    }));
            }
        }), [
        state
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WeddingTemplateContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/wedding-template/WeddingTemplateProvider.tsx",
        lineNumber: 775,
        columnNumber: 5
    }, this);
}
function useWeddingTemplate() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(WeddingTemplateContext);
    if (!ctx) {
        throw new Error("useWeddingTemplate must be used within a WeddingTemplateProvider");
    }
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e93501f7._.js.map