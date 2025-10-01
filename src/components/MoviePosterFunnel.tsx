import React, { useMemo, useRef, useState } from "react";

type VibeKey = "homeAlone" | "elf" | "vacation";
type FinishTier = "digital" | "print" | "framed";

type Prices = Record<FinishTier, number>;
const BASE_PRICES: Prices = {
  digital: 79,
  print: 189,
  framed: 399,
};

const TITLE_BY_VIBE: Record<VibeKey, string> = {
  homeAlone: "Home Alone",
  elf: "Elf",
  vacation: "Christmas Vacation",
};

const TAGLINE_BY_VIBE: Record<VibeKey, string> = {
  homeAlone: "Funny family chaos energy.",
  elf: "Wholesome, bright, kid-friendly.",
  vacation: "Iconic dad-energy, total mayhem.",
};

// Replace with your own static image URLs or CMS assets.
// Use images that suggest the vibe without infringing IP (parody/original art).
const VIBE_THUMBS: Record<VibeKey, string> = {
  homeAlone: "/assets/holiday-vibes/home-alone-parody-thumb.jpg",
  elf: "/assets/holiday-vibes/elf-parody-thumb.jpg",
  vacation: "/assets/holiday-vibes/vacation-parody-thumb.jpg",
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const MAX_MB = 25;

const styles = `
.mpf-wrap{--bg:#0b0b0d;--card:#141419;--muted:#9aa0a6;--text:#e9eef2;--brand:#00d0b6;--accent:#f6b807;--err:#ff6b6b}
.mpf-wrap{color:var(--text);font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;background:var(--bg);border:1px solid #222;border-radius:16px;padding:20px}
.mpf-grid{display:grid;gap:16px}
@media(min-width:960px){.mpf-grid{grid-template-columns:1.1fr .9fr}}
.mpf-card{background:var(--card);border:1px solid #222;border-radius:14px;padding:16px}
.mpf-h1{font-size:26px;line-height:1.2;margin:0 0 6px;font-weight:800;letter-spacing:.2px}
.mpf-sub{color:var(--muted);font-size:14px;margin:0 0 14px}
.mpf-vibes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.mpf-vibe{border:1px solid #2a2a31;border-radius:12px;overflow:hidden;cursor:pointer;background:#0f0f13;transition:.2s}
.mpf-vibe input{display:none}
.mpf-vibe img{width:100%;height:160px;object-fit:cover;display:block}
.mpf-vibe .mpf-v-title{padding:10px 12px 12px}
.mpf-vibe .mpf-v-title h4{margin:0;font-size:14px;font-weight:700}
.mpf-vibe .mpf-v-title p{margin:4px 0 0;color:var(--muted);font-size:12px}
.mpf-vibe.active{outline:2px solid var(--brand);transform:translateY(-1px)}
.mpf-upload{border:1px dashed #3a3a44;border-radius:12px;padding:16px;text-align:center;background:#0f0f13}
.mpf-upload.drag{outline:2px dashed var(--brand)}
.mpf-upload input{display:none}
.mpf-upload .mpf-up-title{font-weight:700;margin:0 0 4px}
.mpf-upload .mpf-up-sub{color:var(--muted);font-size:12px;margin:0 0 8px}
.mpf-up-btn{display:inline-flex;align-items:center;gap:8px;border:1px solid #2a2a31;background:#15151b;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
.mpf-preview{display:flex;gap:12px;align-items:center;margin-top:12px}
.mpf-preview img{width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #2a2a31}
.mpf-x{background:transparent;border:0;color:#aaa;cursor:pointer;font-size:18px}
.mpf-tiers{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.mpf-tier{border:1px solid #2a2a31;border-radius:12px;background:#0f0f13;padding:12px;cursor:pointer}
.mpf-tier h4{margin:0 0 6px;font-size:14px}
.mpf-tier p{margin:0;color:var(--muted);font-size:12px}
.mpf-tier .mpf-price{margin-top:8px;font-weight:800}
.mpf-tier.active{outline:2px solid var(--accent);transform:translateY(-1px)}
.mpf-row{display:grid;gap:10px}
@media(min-width:560px){.mpf-row{grid-template-columns:1fr 1fr}}
.mpf-input{display:flex;flex-direction:column;gap:6px}
.mpf-input label{font-size:12px;color:var(--muted)}
.mpf-input input,.mpf-input textarea{background:#0f0f13;border:1px solid #2a2a31;border-radius:10px;color:var(--text);padding:10px 12px;font-size:14px}
.mpf-note{font-size:12px;color:var(--muted)}
.mpf-total{display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding:12px;border:1px solid #2a2a31;border-radius:12px;background:#0f0f13}
.mpf-btn{margin-top:12px;background:linear-gradient(90deg,var(--brand),#17e4c8);color:#041215;font-weight:900;border:0;border-radius:12px;padding:12px 16px;cursor:pointer}
.mpf-btn[disabled]{opacity:.6;cursor:not-allowed}
.mpf-err{color:var(--err);font-size:12px;margin-top:6px}
.mpf-success{border:1px solid #224d3f;background:#0e1f1a;color:#b9f3dd;padding:12px;border-radius:10px;font-size:13px}
`;

// Helper to format currency
const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function MoviePosterFunnel() {
  const [vibe, setVibe] = useState<VibeKey | null>(null);
  const [tier, setTier] = useState<FinishTier>("digital");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dropRef = useRef<HTMLLabelElement | null>(null);

  const unitPrice = useMemo(() => BASE_PRICES[tier], [tier]);
  const total = useMemo(() => unitPrice * Math.max(1, quantity), [unitPrice, quantity]);

  function pickFile(f: File) {
    setErr(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setErr("Please upload a JPG/PNG/WebP/HEIC image.");
      return;
    }
    const mb = f.size / (1024 * 1024);
    if (mb > MAX_MB) {
      setErr(`Max file size is ${MAX_MB}MB.`);
      return;
    }
    setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer?.files?.[0];
    if (f) pickFile(f);
    dropRef.current?.classList.remove("drag");
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.add("drag");
  }

  function onDragLeave() {
    dropRef.current?.classList.remove("drag");
  }

  async function submitOrder() {
    setErr(null);
    setSuccess(null);

    if (!vibe) return setErr("Pick your movie vibe.");
    if (!file) return setErr("Please upload a family photo.");
    if (!email || !name) return setErr("Name and email are required.");

    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("phone", phone);
    body.append("address", address);
    body.append("vibe", vibe);
    body.append("tier", tier);
    body.append("notes", notes);
    body.append("quantity", String(Math.max(1, quantity)));
    body.append("total", String(total));
    body.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/holiday-movie-poster/order", {
        method: "POST",
        body,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Order failed");
      }

      // If Stripe is enabled, backend returns { checkoutUrl }
      const json = await res.json();
      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
        return;
      }

      setSuccess("Order received! We’ll email you your proof within 48 hours.");
      // reset minimal fields, keep file if you want
      // setFile(null);
    } catch (e: any) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mpf-wrap">
      <style>{styles}</style>

      <div className="mpf-grid">
        {/* LEFT: selection */}
        <section className="mpf-card">
          <h1 className="mpf-h1">Your Family, Starring in a Holiday Classic</h1>
          <p className="mpf-sub">
            3 choices. Upload one photo. We do the rest. Limited run this season.
          </p>

          {/* Vibes */}
          <div className="mpf-vibes" role="group" aria-label="Choose your vibe">
            {(["homeAlone", "elf", "vacation"] as VibeKey[]).map((k) => (
              <label
                key={k}
                className={`mpf-vibe ${vibe === k ? "active" : ""}`}
                onClick={() => setVibe(k)}
                aria-pressed={vibe === k}
              >
                <input type="radio" name="vibe" value={k} />
                <img src={VIBE_THUMBS[k]} alt={`${TITLE_BY_VIBE[k]} vibe`} />
                <div className="mpf-v-title">
                  <h4>{TITLE_BY_VIBE[k]}</h4>
                  <p>{TAGLINE_BY_VIBE[k]}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Upload */}
          <div
            className="mpf-upload"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <p className="mpf-up-title">Upload Your Main Family Photo</p>
            <p className="mpf-up-sub">
              JPG/PNG/WEBP/HEIC, up to {MAX_MB}MB. One photo is enough. You can email extras.
            </p>
            <label ref={dropRef} className="mpf-up-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 16V7m0 0l-4 4m4-4l4 4M4 17a4 4 0 01-4-4 4 4 0 014-4h2.5a1 1 0 00.95-.684A6 6 0 1118 13h2a4 4 0 110 8H6a4 4 0 01-2-7.5"/></svg>
              <span>Drag & drop or click to select</span>
              <input
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) pickFile(f);
                }}
              />
            </label>

            {file && (
              <div className="mpf-preview">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded preview"
                />
                <div style={{flex:1}}>
                  <div style={{fontSize:12, color:"#9aa0a6"}}>{file.name}</div>
                  <div className="mpf-note">Looks good. We’ll pose & style it to match your vibe.</div>
                </div>
                <button className="mpf-x" onClick={() => setFile(null)} aria-label="Remove photo">×</button>
              </div>
            )}
          </div>

          {/* Tier */}
          <div className="mpf-tiers" role="group" aria-label="Choose finish">
            {([
              { key: "digital", title: "Digital Only", desc: "High-res file for cards & socials." },
              { key: "print", title: "Fine-Art Print", desc: "Archival inkjet on museum paper." },
              { key: "framed", title: "Framed Edition", desc: "Premium frame, ready to hang." },
            ] as { key: FinishTier; title: string; desc: string }[]).map((t) => (
              <label
                key={t.key}
                className={`mpf-tier ${tier === t.key ? "active" : ""}`}
                onClick={() => setTier(t.key)}
              >
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
                <div className="mpf-price">{fmtUSD(BASE_PRICES[t.key])}</div>
              </label>
            ))}
          </div>

          {/* Quantity + Notes */}
          <div className="mpf-row" style={{ marginTop: 10 }}>
            <div className="mpf-input">
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value || "1")))
                }
              />
            </div>
            <div className="mpf-input">
              <label htmlFor="notes">Notes (optional)</label>
              <input
                id="notes"
                placeholder="Pets to include? Wardrobe details? Deadlines?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* RIGHT: customer + checkout */}
        <section className="mpf-card">
          <h2 className="mpf-h1" style={{ fontSize: 20 }}>Checkout Details</h2>
          <p className="mpf-sub">We’ll send a proof before printing.</p>

          <div className="mpf-row">
            <div className="mpf-input">
              <label htmlFor="name">Full Name</label>
              <input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="mpf-input">
              <label htmlFor="email">Email</label>
              <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>

          <div className="mpf-row">
            <div className="mpf-input">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(###) ###-####" />
            </div>
            <div className="mpf-input">
              <label htmlFor="address">Ship To (print/framed)</label>
              <input id="address" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Street, City, State, ZIP" />
            </div>
          </div>

          <div className="mpf-total">
            <div>
              <div style={{ fontWeight: 900 }}>Order Total</div>
              <div className="mpf-note">
                {TITLE_BY_VIBE[vibe || "homeAlone"] || "Pick a vibe"} • {tier} • x{quantity}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{fmtUSD(total)}</div>
          </div>

          {err && <div className="mpf-err" role="alert">{err}</div>}
          {success && <div className="mpf-success">{success}</div>}

          <button className="mpf-btn" onClick={submitOrder} disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>

          <p className="mpf-note" style={{marginTop:8}}>
            By ordering, you agree to our proof/approval process and seasonal turnaround windows.
          </p>
        </section>
      </div>
    </div>
  );
}
