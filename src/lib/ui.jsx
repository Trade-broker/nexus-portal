// Shared UI for the portal — same design language as the main app.

export const T = {
  bg:"#07080f", surface:"#0c0e18", card:"#0f1120", border:"#181d2e", border2:"#222840",
  amber:"#f59e0b", gold:"#f4c03c", green:"#10b981", blue:"#3b82f6", purple:"#8b5cf6",
  red:"#ef4444", orange:"#f97316", cyan:"#06b6d4", pink:"#ec4899",
  text:"#e2e8f0", muted:"#64748b", dim:"#334155",
};

export const IC = {
  search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  plus:"M12 5v14M5 12h14", x:"M18 6L6 18M6 6l12 12", check:"M20 6L9 17l-5-5",
  mail:"M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6",
  msg:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  box:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  factory:"M2 20h20M4 20V10l5 3V10l5 3V10l5 3v7M9 20v-4h2v4",
  globe:"M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z",
  arrow:"M5 12h14M12 5l7 7-7 7", building:"M3 21h18M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16",
  user:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  tag:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  send:"M22 2L11 13M22 2L15 22l-4-9-9-4z",
};

export const SVG = ({ d, size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const Btn = ({ children, onClick, color = T.gold, sm, full, disabled, type = "button" }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-40 ${sm ? "text-xs px-3 py-2" : "text-sm px-5 py-3"} ${full ? "w-full" : ""}`}
    style={{ background: color + "20", color, border: `1px solid ${color}45` }}>{children}</button>
);

export const Input = ({ value, onChange, placeholder, type = "text", multiline, rows = 3 }) =>
  multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none placeholder-slate-600"
        style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text }} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
        className="w-full text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600"
        style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text }} />;

export const Field = ({ label, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.muted }}>{label}</label>
    {hint && <p className="text-xs -mt-0.5" style={{ color: T.dim }}>{hint}</p>}
    {children}
  </div>
);

export const Pill = ({ label, color }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: color + "22", color, border: `1px solid ${color}33` }}>{label}</span>
);

export const Logo = ({ size = 9 }) => (
  <div className={`w-${size} h-${size} rounded-xl flex items-center justify-center flex-shrink-0`}
    style={{ background: "linear-gradient(135deg,#f4c03c,#8b5cf6)" }}>
    <SVG d={IC.globe} size={18} style={{ color: "#0a0a08" }} />
  </div>
);
