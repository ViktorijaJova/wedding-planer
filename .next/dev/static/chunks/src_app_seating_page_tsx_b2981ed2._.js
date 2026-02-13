(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/seating/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SeatingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wedding$2d$template$2f$WeddingTemplateProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/wedding-template/WeddingTemplateProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}
function seatPosition(index, total) {
    const radius = 130;
    const angle = index / total * Math.PI * 2 - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const center = 140;
    return {
        left: `${center + x - 22}px`,
        top: `${center + y - 22}px`
    };
}
function SeatingPage() {
    _s();
    const { state: { guests, tables }, addTable, updateTable, removeTable, assignSeat, clearSeat } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wedding$2d$template$2f$WeddingTemplateProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeddingTemplate"])();
    const [tableName, setTableName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [capacity, setCapacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [draggingGuestId, setDraggingGuestId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dropTarget, setDropTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Carousel state
    const [currentTableIndex, setCurrentTableIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Search & filter state
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterGroup, setFilterGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const unassignedGuests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SeatingPage.useMemo[unassignedGuests]": ()=>guests.filter({
                "SeatingPage.useMemo[unassignedGuests]": (g)=>g.tableId == null || g.seatIndex == null
            }["SeatingPage.useMemo[unassignedGuests]"])
    }["SeatingPage.useMemo[unassignedGuests]"], [
        guests
    ]);
    // Filtered unassigned guests (search + group)
    const filteredUnassigned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SeatingPage.useMemo[filteredUnassigned]": ()=>{
            return unassignedGuests.filter({
                "SeatingPage.useMemo[filteredUnassigned]": (g)=>{
                    if (search.trim()) {
                        const q = search.toLowerCase();
                        if (!g.name.toLowerCase().includes(q)) return false;
                    }
                    if (filterGroup !== "all") {
                        if ((g.group || "").toLowerCase() !== filterGroup.toLowerCase()) return false;
                    }
                    return true;
                }
            }["SeatingPage.useMemo[filteredUnassigned]"]);
        }
    }["SeatingPage.useMemo[filteredUnassigned]"], [
        unassignedGuests,
        search,
        filterGroup
    ]);
    // Available groups from all guests (for filter dropdown)
    const availableGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SeatingPage.useMemo[availableGroups]": ()=>{
            const groups = new Set();
            guests.forEach({
                "SeatingPage.useMemo[availableGroups]": (g)=>{
                    if (g.group) groups.add(g.group);
                }
            }["SeatingPage.useMemo[availableGroups]"]);
            return Array.from(groups).sort();
        }
    }["SeatingPage.useMemo[availableGroups]"], [
        guests
    ]);
    const byTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SeatingPage.useMemo[byTable]": ()=>{
            const map = new Map();
            tables.forEach({
                "SeatingPage.useMemo[byTable]": (t)=>{
                    map.set(t.id, []);
                }
            }["SeatingPage.useMemo[byTable]"]);
            guests.forEach({
                "SeatingPage.useMemo[byTable]": (g)=>{
                    if (g.tableId && g.seatIndex != null && map.has(g.tableId)) {
                        map.get(g.tableId).push(g);
                    }
                }
            }["SeatingPage.useMemo[byTable]"]);
            return map;
        }
    }["SeatingPage.useMemo[byTable]"], [
        guests,
        tables
    ]);
    const totals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SeatingPage.useMemo[totals]": ()=>({
                tables: tables.length,
                seated: guests.filter({
                    "SeatingPage.useMemo[totals]": (g)=>g.tableId && g.seatIndex != null
                }["SeatingPage.useMemo[totals]"]).length,
                totalGuests: guests.length
            })
    }["SeatingPage.useMemo[totals]"], [
        guests,
        tables
    ]);
    // Keep carousel index in bounds
    const safeTableIndex = tables.length === 0 ? -1 : Math.min(currentTableIndex, tables.length - 1);
    const currentTable = safeTableIndex >= 0 ? tables[safeTableIndex] : null;
    function handleAddTable(e) {
        e.preventDefault();
        const name = tableName.trim();
        const safeCapacity = Math.min(12, Math.max(4, capacity || 10));
        addTable({
            name: name || `Table ${tables.length + 1}`,
            capacity: safeCapacity,
            notes: ""
        });
        setTableName("");
        setCapacity(10);
        // Navigate to the newly added table
        setCurrentTableIndex(tables.length);
    }
    function handleDragStart(guestId, e) {
        const data = {
            guestId
        };
        e.dataTransfer.setData("application/json", JSON.stringify(data));
        e.dataTransfer.effectAllowed = "move";
        setDraggingGuestId(guestId);
    }
    function readDragData(e) {
        try {
            const raw = e.dataTransfer.getData("application/json");
            if (!raw) return null;
            return JSON.parse(raw);
        } catch  {
            return null;
        }
    }
    function handleSeatDrop(tableId, seatIndex, e) {
        e.preventDefault();
        const data = readDragData(e);
        if (!data) return;
        assignSeat(data.guestId, tableId, seatIndex);
        setDraggingGuestId(null);
        setDropTarget(null);
    }
    function handleSeatClick(tableId, seatIndex) {
        const occupant = guests.find((g)=>g.tableId === tableId && g.seatIndex === seatIndex);
        if (!occupant) return;
        if (window.confirm(`Remove ${occupant.name} from this seat (they will go back to the unassigned list)?`)) {
            clearSeat(occupant.id);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5 md:space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "wedding-card px-4 py-4 md:px-5 md:py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs tracking-[0.2em] uppercase text-sage-dark/70",
                                        children: "Seating"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mt-1 font-display text-xl text-sage-dark md:text-2xl",
                                        children: "Round tables layout"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 max-w-xl text-[0.8rem] text-sage-dark/80",
                                        children: "Drag guests from the list onto the little chairs around each table. Use the arrows to navigate between tables."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                className: "grid grid-cols-3 gap-2 text-[0.7rem] text-sage-dark/80 md:text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "uppercase tracking-[0.18em]",
                                                children: "Tables"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "mt-1 font-display text-lg text-sage-dark",
                                                children: totals.tables
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "uppercase tracking-[0.18em]",
                                                children: "Seated"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 201,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "mt-1",
                                                children: [
                                                    totals.seated,
                                                    " / ",
                                                    totals.totalGuests
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 200,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                className: "uppercase tracking-[0.18em]",
                                                children: "Unassigned"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 207,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                className: "mt-1",
                                                children: [
                                                    unassignedGuests.length,
                                                    "/",
                                                    totals.totalGuests
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/seating/page.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddTable,
                        className: "mt-4 grid gap-3 text-[0.8rem] md:grid-cols-[minmax(0,1.6fr),minmax(0,1fr),auto]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80",
                                        children: "Table name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: tableName,
                                        onChange: (e)=>setTableName(e.target.value),
                                        placeholder: `e.g. V & T's Family, Friends 1`,
                                        className: "w-full rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-medium uppercase tracking-[0.18em] text-sage-dark/80",
                                        children: "Seats (4–12)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 4,
                                        max: 12,
                                        value: capacity,
                                        onChange: (e)=>setCapacity(Number(e.target.value) || 10),
                                        className: "w-24 rounded-md border border-sage/30 bg-ivory/70 px-3 py-2 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "inline-flex items-center justify-center rounded-full border border-gold/70 bg-gradient-to-r from-gold/90 to-gold text-xs font-semibold uppercase tracking-[0.22em] text-white px-4 py-2 shadow-sm transition hover:from-gold hover:to-gold/90 hover:shadow-md",
                                    children: "Add table"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/seating/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/seating/page.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/seating/page.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "grid gap-4 md:grid-cols-[minmax(0,1fr),minmax(0,1.4fr)] md:gap-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wedding-card px-4 py-4 md:px-5 md:py-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs tracking-[0.2em] uppercase text-sage-dark/70",
                                        children: "Unassigned guests"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wedding-pill bg-ivory/80 text-sage-dark/85",
                                        children: "Drag onto a seat"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value),
                                        placeholder: "Search guests...",
                                        className: "min-w-0 flex-1 rounded-md border border-sage/30 bg-ivory/70 px-3 py-1.5 text-[0.8rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filterGroup,
                                        onChange: (e)=>setFilterGroup(e.target.value),
                                        className: "rounded-md border border-sage/30 bg-ivory/70 px-2 py-1.5 text-[0.75rem] text-sage-dark shadow-sm outline-none ring-0 focus:border-gold focus:bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All groups"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 280,
                                                columnNumber: 15
                                            }, this),
                                            availableGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: group,
                                                    children: group
                                                }, group, false, {
                                                    fileName: "[project]/src/app/seating/page.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 scroll-fade",
                                children: filteredUnassigned.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[0.8rem] text-sage-dark/70",
                                    children: unassignedGuests.length === 0 ? "Everyone is seated already. You can click a seat to remove someone back to this list." : "No guests match your search."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/seating/page.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this) : filteredUnassigned.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "guest-chip guest-chip-unassigned justify-between",
                                        draggable: true,
                                        onDragStart: (e)=>handleDragStart(g.id, e),
                                        onDragEnd: ()=>{
                                            setDraggingGuestId((current)=>current === g.id ? null : current);
                                            setDropTarget(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "guest-chip-small-tag",
                                                children: getInitials(g.name)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 310,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: g.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 19
                                            }, this),
                                            g.side && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "guest-chip-small-tag",
                                                children: g.side === "bride" ? "Bride" : g.side === "groom" ? "Partner" : "Both"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 315,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, g.id, true, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/seating/page.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wedding-card px-4 py-4 md:px-5 md:py-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs tracking-[0.2em] uppercase text-sage-dark/70",
                                        children: "Tables"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wedding-pill bg-ivory/80 text-sage-dark/85",
                                        children: "Click guest to unseat"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this),
                            tables.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-[0.8rem] text-sage-dark/75",
                                children: "Start by adding your first table above. A good starting point is 10 guests per table, and you can gently adjust later."
                            }, void 0, false, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 341,
                                columnNumber: 13
                            }, this) : currentTable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "seating-carousel-nav",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: safeTableIndex <= 0,
                                                onClick: ()=>setCurrentTableIndex((i)=>Math.max(0, i - 1)),
                                                className: "seating-carousel-arrow",
                                                "aria-label": "Previous table",
                                                children: "‹"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "seating-carousel-counter",
                                                children: [
                                                    safeTableIndex + 1,
                                                    " / ",
                                                    tables.length
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: safeTableIndex >= tables.length - 1,
                                                onClick: ()=>setCurrentTableIndex((i)=>Math.min(tables.length - 1, i + 1)),
                                                className: "seating-carousel-arrow",
                                                "aria-label": "Next table",
                                                children: "›"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/seating/page.tsx",
                                                lineNumber: 363,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/seating/page.tsx",
                                        lineNumber: 348,
                                        columnNumber: 15
                                    }, this),
                                    (()=>{
                                        const table = currentTable;
                                        const seatedHere = byTable.get(table.id) ?? [];
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "seating-table-single",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    value: table.name,
                                                                    onChange: (e)=>updateTable(table.id, {
                                                                            name: e.target.value
                                                                        }),
                                                                    className: "w-full rounded-md border-none bg-transparent px-0 py-0 text-[0.95rem] font-semibold text-sage-dark outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/seating/page.tsx",
                                                                    lineNumber: 387,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-[0.75rem] text-sage-dark/70",
                                                                    children: [
                                                                        seatedHere.length,
                                                                        "/",
                                                                        table.capacity,
                                                                        " seats filled"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/seating/page.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/seating/page.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                if (window.confirm(`Remove ${table.name}? Guests will move back to the unassigned list.`)) {
                                                                    removeTable(table.id);
                                                                    setCurrentTableIndex((i)=>Math.max(0, Math.min(i, tables.length - 2)));
                                                                }
                                                            },
                                                            className: "text-[0.7rem] text-sage-dark/55 hover:text-[#b54b4b]",
                                                            children: "Remove"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/seating/page.tsx",
                                                            lineNumber: 398,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/seating/page.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "seating-table-circle-large mt-4",
                                                    children: Array.from({
                                                        length: table.capacity
                                                    }).map((_, i)=>{
                                                        const seatGuest = guests.find((g)=>g.tableId === table.id && g.seatIndex === i);
                                                        const isDropTarget = dropTarget && dropTarget.tableId === table.id && dropTarget.seatIndex === i;
                                                        const style = seatPosition(i, table.capacity);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: [
                                                                "seating-seat seating-seat-large",
                                                                seatGuest ? "occupied" : "empty",
                                                                isDropTarget ? "seating-seat-drop-target" : ""
                                                            ].filter(Boolean).join(" "),
                                                            style: style,
                                                            onClick: ()=>seatGuest && handleSeatClick(table.id, i),
                                                            onDragOver: (e)=>{
                                                                if (!draggingGuestId) return;
                                                                e.preventDefault();
                                                                e.dataTransfer.dropEffect = "move";
                                                                setDropTarget({
                                                                    tableId: table.id,
                                                                    seatIndex: i
                                                                });
                                                            },
                                                            onDragLeave: (e)=>{
                                                                e.preventDefault();
                                                                setDropTarget((current)=>current && current.tableId === table.id && current.seatIndex === i ? null : current);
                                                            },
                                                            onDrop: (e)=>handleSeatDrop(table.id, i, e),
                                                            children: seatGuest ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                title: seatGuest.name,
                                                                children: getInitials(seatGuest.name)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/seating/page.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 31
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[0.65rem]",
                                                                children: i + 1
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/seating/page.tsx",
                                                                lineNumber: 470,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, i, false, {
                                                            fileName: "[project]/src/app/seating/page.tsx",
                                                            lineNumber: 431,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/seating/page.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 21
                                                }, this),
                                                seatedHere.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 flex flex-wrap gap-1.5 justify-center",
                                                    children: seatedHere.sort((a, b)=>(a.seatIndex ?? 0) - (b.seatIndex ?? 0)).map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[0.7rem] text-sage-dark/75 bg-ivory/80 rounded-full px-2 py-0.5 border border-sage/20",
                                                            children: [
                                                                (g.seatIndex ?? 0) + 1,
                                                                ". ",
                                                                g.name
                                                            ]
                                                        }, g.id, true, {
                                                            fileName: "[project]/src/app/seating/page.tsx",
                                                            lineNumber: 485,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/seating/page.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/seating/page.tsx",
                                            lineNumber: 384,
                                            columnNumber: 19
                                        }, this);
                                    })()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/seating/page.tsx",
                                lineNumber: 346,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/seating/page.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/seating/page.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/seating/page.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
_s(SeatingPage, "CQ8JuQ6aMprhOX6WrtH3kixUIgo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wedding$2d$template$2f$WeddingTemplateProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWeddingTemplate"]
    ];
});
_c = SeatingPage;
var _c;
__turbopack_context__.k.register(_c, "SeatingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_seating_page_tsx_b2981ed2._.js.map