import { useState, useEffect } from "react";
import { supabase, BROKER_ID } from "./lib/supabase";
import { T, SVG, IC, Btn, Input, Field, Pill, Logo } from "./lib/ui.jsx";

export default function App() {
  const [tab, setTab] = useState("browse");          // browse | post | request
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");        // all | offer | request
  const [search, setSearch] = useState("");
  const [enquireFor, setEnquireFor] = useState(null); // listing being enquired about
  const [toast, setToast] = useState(null);

  const notify = (msg, type="success") => { setToast({ msg, type }); setTimeout(()=>setToast(null), 3500); };

  // Load APPROVED listings (public can see these)
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("listings")
      .select("*").eq("status", "approved").order("created_at", { ascending: false });
    setListings(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const shown = listings.filter(l => {
    if (filter !== "all" && l.kind !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return [l.title, l.product, l.category, l.country, l.description].join(" ").toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: T.bg, fontFamily: "'Inter', system-ui, sans-serif", color: T.text }}>
      {toast && (
        <div className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl max-w-xs"
          style={{ background:(toast.type==="error"?T.red:T.green)+"22", color:toast.type==="error"?T.red:T.green, border:`1px solid ${(toast.type==="error"?T.red:T.green)}40`, backdropFilter:"blur(12px)" }}>{toast.msg}</div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b" style={{ background:"#06070d", borderColor:T.border }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center gap-3 flex-wrap">
          <Logo />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-white leading-none">BLACK GOLD NEXUS</div>
            <div className="text-xs font-black leading-none mt-0.5" style={{ color:T.gold }}>TRADE PORTAL</div>
          </div>
          <div className="flex gap-2">
            <Btn onClick={()=>setTab("browse")} sm color={tab==="browse"?T.gold:T.muted}><SVG d={IC.search} size={12} />Browse</Btn>
            <Btn onClick={()=>setTab("post")} sm color={tab==="post"?T.green:T.muted}><SVG d={IC.box} size={12} />Post Offer</Btn>
            <Btn onClick={()=>setTab("request")} sm color={tab==="request"?T.blue:T.muted}><SVG d={IC.tag} size={12} />Request</Btn>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">
        {/* BROWSE */}
        {tab==="browse" && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4" style={{ background:`linear-gradient(135deg, ${T.gold}12, ${T.purple}12)`, border:`1px solid ${T.border2}` }}>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-white">Global Trade Marketplace</h1>
                <p className="text-sm mt-1" style={{ color:T.muted }}>Browse what buyers and suppliers are offering and seeking. Found a match? Send an enquiry — every deal is handled by Black Gold Nexus.</p>
              </div>
            </div>

            {/* search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 rounded-xl px-3" style={{ background:T.surface, border:`1px solid ${T.border}` }}>
                <SVG d={IC.search} size={15} style={{ color:T.muted }} />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, categories, countries…"
                  className="flex-1 text-sm py-2.5 outline-none bg-transparent placeholder-slate-600" style={{ color:T.text }} />
              </div>
              <div className="flex gap-2">
                {[["all","All"],["offer","Offers"],["request","Requests"]].map(([k,lab]) => (
                  <button key={k} onClick={()=>setFilter(k)} className="text-xs font-semibold px-3 py-2 rounded-xl"
                    style={filter===k ? { background:T.gold+"20", color:T.gold, border:`1px solid ${T.gold}40` } : { background:T.surface, color:T.muted, border:`1px solid ${T.border}` }}>{lab}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background:T.gold, animationDelay:`${i*150}ms` }} />)}</div></div>
            ) : shown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background:T.card, border:`1px solid ${T.border}` }}><SVG d={IC.box} size={24} style={{ color:T.muted }} /></div>
                <div className="text-base font-semibold text-white">No listings yet</div>
                <div className="text-sm max-w-xs" style={{ color:T.muted }}>Be the first — post an offer or a sourcing request.</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shown.map(l => (
                  <div key={l.id} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background:T.card, border:`1px solid ${l.kind==="offer"?T.green:T.blue}33` }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill label={l.kind==="offer"?"OFFER":"SOURCING REQUEST"} color={l.kind==="offer"?T.green:T.blue} />
                      {l.category && <Pill label={l.category} color={T.purple} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{l.title || l.product}</div>
                      <div className="text-xs mt-1" style={{ color:T.muted }}>
                        {l.product}{l.country?` · ${l.country}`:""}{l.quantity?` · Qty: ${l.quantity}`:""}
                      </div>
                    </div>
                    {l.price && <div className="text-sm font-bold" style={{ color:T.gold }}>{l.price}</div>}
                    {l.description && <p className="text-xs leading-relaxed line-clamp-3" style={{ color:T.muted }}>{l.description}</p>}
                    <Btn onClick={()=>setEnquireFor(l)} color={T.gold} sm full><SVG d={IC.send} size={12} />Enquire via Broker</Btn>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-center leading-relaxed pt-2" style={{ color:T.dim }}>
              Every enquiry is reviewed and handled by Black Gold Nexus before reaching the other party.
              Listings shown are submitted by users and verified by the broker.
            </p>
          </div>
        )}

        {/* POST OFFER (seller) */}
        {tab==="post" && <PostForm kind="offer" notify={notify} onDone={()=>{ setTab("browse"); }} />}

        {/* POST REQUEST (buyer sourcing) */}
        {tab==="request" && <PostForm kind="request" notify={notify} onDone={()=>{ setTab("browse"); }} />}
      </div>

      {/* ENQUIRY MODAL */}
      {enquireFor && <EnquiryModal listing={enquireFor} notify={notify} onClose={()=>setEnquireFor(null)} />}
    </div>
  );
}

// ---- POST FORM (offer or request) ----
function PostForm({ kind, notify, onDone }) {
  const [f, setF] = useState({ title:"", product:"", category:"", country:"", quantity:"", price:"", description:"", poster_name:"", poster_email:"", poster_phone:"", poster_company:"" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.product || !f.poster_name || !f.poster_email) { notify("Please fill product, your name, and email.", "error"); return; }
    setBusy(true);
    try {
      // 1) create the listing (pending — broker must approve before it shows)
      const { error: e1 } = await supabase.from("listings").insert({
        broker_id: BROKER_ID, kind, status: "pending",
        title: f.title || f.product, product: f.product, category: f.category, country: f.country,
        quantity: f.quantity, price: f.price, description: f.description,
        poster_name: f.poster_name, poster_email: f.poster_email, poster_phone: f.poster_phone, poster_company: f.poster_company,
      });
      if (e1) throw e1;

      // 2) create a LEAD in the broker's app (shows in Lead Approvals)
      await supabase.from("leads").insert({
        user_id: BROKER_ID, source: "portal",
        kind: kind === "offer" ? "supplier" : "buyer",
        name: f.poster_company || f.poster_name, country: f.country,
        sector: f.category, product: f.product,
        email: f.poster_email, phone: f.poster_phone,
        why_fit: `Portal ${kind}: ${f.title || f.product}`, status: "proposed",
      });

      // 3) log it in the broker's activity feed
      await supabase.from("feed").insert({
        user_id: BROKER_ID, color: kind === "offer" ? T.green : T.blue,
        text: `🌐 Portal: ${f.poster_name} posted a ${kind} — "${f.title || f.product}" (awaiting your approval)`,
      });

      notify("Submitted! Black Gold Nexus will review and publish it shortly.");
      onDone();
    } catch (err) {
      notify("Could not submit: " + (err.message || "error"), "error");
    } finally { setBusy(false); }
  };

  const accent = kind === "offer" ? T.green : T.blue;
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="rounded-2xl p-5 flex items-start gap-3" style={{ background:T.card, border:`1px solid ${accent}33` }}>
        <SVG d={kind==="offer"?IC.box:IC.tag} size={18} style={{ color:accent, flexShrink:0, marginTop:2 }} />
        <div>
          <h1 className="text-xl font-black text-white">{kind==="offer" ? "Post an Offer (Selling)" : "Post a Sourcing Request (Buying)"}</h1>
          <p className="text-xs mt-1 leading-relaxed" style={{ color:T.muted }}>
            {kind==="offer"
              ? "List goods you have available. Black Gold Nexus reviews it, publishes it, and handles all buyer enquiries on your behalf."
              : "Tell us what you're looking to buy. Black Gold Nexus sources it and connects you — every step handled by the broker."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background:T.card, border:`1px solid ${T.border}` }}>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color:accent }}>What you're {kind==="offer"?"offering":"seeking"}</div>
        <Field label="Product *"><Input value={f.product} onChange={set("product")} placeholder="e.g. Diesel 50ppm, Solar panels, Used vehicles" /></Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Category"><Input value={f.category} onChange={set("category")} placeholder="Fuel / Electronics / Agriculture…" /></Field>
          <Field label="Country / Origin"><Input value={f.country} onChange={set("country")} placeholder="South Africa, UAE…" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Quantity"><Input value={f.quantity} onChange={set("quantity")} placeholder="e.g. 2 containers, 10,000L" /></Field>
          <Field label={kind==="offer"?"Asking Price":"Target Price"}><Input value={f.price} onChange={set("price")} placeholder="Optional" /></Field>
        </div>
        <Field label="Details"><Input value={f.description} onChange={set("description")} placeholder="Specs, terms, timeframe, Incoterms…" multiline rows={3} /></Field>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background:T.card, border:`1px solid ${T.border}` }}>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color:T.gold }}>Your contact details</div>
        <p className="text-xs -mt-1" style={{ color:T.dim }}>Only the broker sees these. Buyers/sellers contact you through Black Gold Nexus, never directly.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Your Name *"><Input value={f.poster_name} onChange={set("poster_name")} placeholder="Full name" /></Field>
          <Field label="Company"><Input value={f.poster_company} onChange={set("poster_company")} placeholder="Optional" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Email *"><Input value={f.poster_email} onChange={set("poster_email")} type="email" placeholder="you@email.com" /></Field>
          <Field label="Phone"><Input value={f.poster_phone} onChange={set("poster_phone")} placeholder="+27…" /></Field>
        </div>
        <Btn onClick={submit} disabled={busy} color={accent} full>{busy ? "Submitting…" : <><SVG d={IC.check} size={14} />Submit for Review</>}</Btn>
      </div>
    </div>
  );
}

// ---- ENQUIRY MODAL ----
function EnquiryModal({ listing, notify, onClose }) {
  const [f, setF] = useState({ from_name:"", from_email:"", from_phone:"", from_company:"", message:"" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.from_name || !f.from_email || !f.message) { notify("Please fill your name, email, and message.", "error"); return; }
    setBusy(true);
    try {
      // 1) record the enquiry (pending — broker gates it)
      await supabase.from("enquiries").insert({
        broker_id: listing.broker_id, listing_id: listing.id, status: "pending",
        from_name: f.from_name, from_email: f.from_email, from_phone: f.from_phone, from_company: f.from_company, message: f.message,
      });
      // 2) drop it into the broker's MESSAGE APPROVALS queue
      await supabase.from("queue").insert({
        user_id: listing.broker_id, source: "portal", listing_id: listing.id,
        agent: "Portal Enquiry", channel: "email",
        recipient_type: "buyer", recipient_name: f.from_company || f.from_name,
        to_addr: f.from_email,
        subject: `Enquiry: ${listing.title || listing.product}`,
        body: `From: ${f.from_name}${f.from_company?` (${f.from_company})`:""}\nEmail: ${f.from_email}\nPhone: ${f.from_phone||"—"}\n\nRe: ${listing.title||listing.product}\n\n${f.message}`,
        rationale: `Portal enquiry on listing "${listing.title||listing.product}"`, status: "pending",
      });
      // 3) feed
      await supabase.from("feed").insert({
        user_id: listing.broker_id, color: T.orange,
        text: `📨 Portal enquiry from ${f.from_name} on "${listing.title||listing.product}" — in your Message Approvals`,
      });
      notify("Enquiry sent to Black Gold Nexus. They'll be in touch.");
      onClose();
    } catch (err) {
      notify("Could not send: " + (err.message || "error"), "error");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"#00000099" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="w-full max-w-md rounded-2xl flex flex-col max-h-[90vh]" style={{ background:T.card, border:`1px solid ${T.border2}` }}>
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor:T.border }}>
          <h3 className="font-bold text-white text-sm">Enquire — handled by Broker</h3>
          <button onClick={onClose} style={{ color:T.muted }}><SVG d={IC.x} size={16} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <div className="rounded-xl p-3" style={{ background:T.surface, border:`1px solid ${T.border}` }}>
            <div className="text-xs" style={{ color:T.muted }}>Enquiring about:</div>
            <div className="text-sm font-bold text-white">{listing.title || listing.product}</div>
            <div className="text-xs" style={{ color:T.dim }}>{listing.product}{listing.country?` · ${listing.country}`:""}</div>
          </div>
          <Field label="Your Name *"><Input value={f.from_name} onChange={set("from_name")} placeholder="Full name" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *"><Input value={f.from_email} onChange={set("from_email")} type="email" placeholder="you@email.com" /></Field>
            <Field label="Phone"><Input value={f.from_phone} onChange={set("from_phone")} placeholder="+27…" /></Field>
          </div>
          <Field label="Company"><Input value={f.from_company} onChange={set("from_company")} placeholder="Optional" /></Field>
          <Field label="Message *"><Input value={f.message} onChange={set("message")} placeholder="Quantities, timeframe, questions…" multiline rows={4} /></Field>
          <div className="text-xs leading-relaxed p-3 rounded-xl" style={{ background:T.gold+"0d", color:T.muted, border:`1px solid ${T.gold}22` }}>
            <span className="font-semibold" style={{ color:T.gold }}>Note: </span>Your enquiry goes to Black Gold Nexus first. The broker reviews it and manages all communication — your details are never shared directly with the other party.
          </div>
          <Btn onClick={submit} disabled={busy} color={T.gold} full>{busy ? "Sending…" : <><SVG d={IC.send} size={14} />Send Enquiry</>}</Btn>
        </div>
      </div>
    </div>
  );
}
