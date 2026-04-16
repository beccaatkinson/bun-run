import { useState, useRef, useEffect } from "react";

// ── Route Card ────────────────────────────────────────────────────────────────
function RouteCard({ result, miles, treat, onShare }) {
  const [waypointsOpen, setWaypointsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(null);
  const items = result.menuItems || [result.menuItem];

  function handleFeedback(type) {
    setFeedbackSent(type);
    setFeedbackOpen(false);
  }

  return (
    <div style={s.routeCard}>
      {/* Route strip */}
      <div style={s.routeStrip}>
        <div style={s.routeStat}>
          <span style={s.routeStatVal}>{miles?.label || miles}</span>
          <span style={s.routeStatLabel}>MI RANGE</span>
        </div>
        <div style={s.routeDivider}/>
        <div style={s.routeStatMain}>
          <span style={s.routeStatCity}>{result.bakeryNeighborhood}</span>
          <span style={s.routeStatDesc}>{result.routeDescription}</span>
        </div>
        <div style={{position: "relative", flexShrink: 0}}>
          {feedbackSent ? (
            <span style={s.feedbackThanks}>Thanks!</span>
          ) : (
            <button style={s.feedbackBtn} onClick={() => setFeedbackOpen(o => !o)} title="Report an issue">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </button>
          )}
          {feedbackOpen && (
            <div style={s.feedbackPopover}>
              <p style={s.feedbackPopoverTitle}>Report an issue</p>
              <button style={s.feedbackOption} onClick={() => handleFeedback("bad_route")}>
                Bad route
              </button>
              <button style={s.feedbackOption} onClick={() => handleFeedback("closed")}>
                Bakery is closed
              </button>
              <button style={s.feedbackCancel} onClick={() => setFeedbackOpen(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* OSM map iframe */}
      <div style={s.mapEmbed}>
        {result.lat && result.lng && (
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${result.lng - 0.012},${result.lat - 0.008},${result.lng + 0.012},${result.lat + 0.008}&layer=mapnik&marker=${result.lat},${result.lng}`}
            style={{width: "100%", height: "100%", border: "none", display: "block"}}
            title={`Map of ${result.bakeryName}`}
          />
        )}
        <a href={result.mapsUrl} target="_blank" rel="noopener noreferrer" style={s.mapOverlay}>
          <span style={s.mapOpenLabel}>🗺 Open full route</span>
        </a>
      </div>

      {/* Waypoints accordion */}
      {result.waypoints && result.waypoints.length > 0 && (
        <div style={s.waypointsCard}>
          <button style={s.waypointsToggle} onClick={() => setWaypointsOpen(o => !o)}>
            <span style={s.waypointsLabel}>ROUTE HIGHLIGHTS</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"
              style={{transform: waypointsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0}}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          <div style={{overflow: "hidden", maxHeight: waypointsOpen ? "600px" : "0px", transition: "max-height 0.3s ease"}}>
            <div style={{paddingTop: "14px"}}>
              {result.waypoints.map((wp, i) => (
                <div key={i} style={s.waypointRow}>
                  <div style={s.waypointDot}>
                    <div style={s.waypointLine}/>
                    <div style={s.waypointCircle}>{i + 1}</div>
                    <div style={s.waypointLineBottom}/>
                  </div>
                  <div style={s.waypointText}>
                    <span style={s.waypointName}>{wp.name}</span>
                    {wp.description && <span style={s.waypointDesc}>{wp.description}</span>}
                  </div>
                </div>
              ))}
              <div style={s.waypointRow}>
                <div style={s.waypointDot}>
                  <div style={s.waypointLine}/>
                  <div style={{...s.waypointCircle, background: "#B85C38", color: "white", borderColor: "#B85C38"}}>🥐</div>
                </div>
                <div style={s.waypointText}>
                  <span style={s.waypointName}>{result.bakeryName}</span>
                  <span style={s.waypointDesc}>Finish line</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bakery card */}
      <div style={s.bakeryCard}>
        <div style={s.bakeryHeader}>
          <div>
            <div style={s.bakeryLabel}>YOUR FINISH LINE</div>
            <div style={s.bakeryName}>{result.bakeryName}</div>
            <div style={s.bakeryLocation}>📍 {result.bakeryNeighborhood}</div>
          </div>
          <div style={s.bakeryBadge}>🥐</div>
        </div>

        {result.pressSnippet && (
          <p style={s.pressSnippet}>{result.pressSnippet}</p>
        )}

        <div style={s.orderBox}>
          <span style={s.orderLabel}>ORDER THIS</span>
          <p style={s.orderInline}>
            {items.map((item, i) => (
              <span key={i}>
                {i === 0 && treat.length > 0 && <span style={s.orderStar}>★ </span>}
                <span style={i === 0 ? s.orderItemPrimary : s.orderItem}>{item}</span>
                {i < items.length - 1 && <span style={s.orderComma}>,  </span>}
              </span>
            ))}
          </p>
        </div>

        <button style={s.shareBtn} onClick={onShare}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v13M7 7l5-5 5 5"/>
            <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/>
          </svg>
          SHARE WITH A FRIEND
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("intro");
  const [miles, setMiles] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [treat, setTreat] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const inputRef = useRef(null);
  const carouselRef = useRef(null);

  function handleCarouselScroll() {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setCurrentCard(index);
  }

  async function handleShare(result) {
    const items = result.menuItems || [result.menuItem];
    const text = `Running to ${result.bakeryName} in ${result.bakeryNeighborhood} — ${miles} miles.${treat.length > 0 ? ` Craving: ${treat.join(", ")}.` : ""} Order the ${items[0]}. Route: ${result.mapsUrl}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Bun Run Route", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  async function fetchRecommendation(existingResults = []) {
    setStep("loading");

    const treatLine = treat.length > 0
      ? `The runner specifically wants: ${treat.map(t => `"${t}"`).join(", ")}. You MUST recommend bakeries that serve at least one of these. The first menuItem for each MUST match one of these.`
      : `Recommend each bakery's standout signature item first.`;

    const alreadySeen = existingResults.map(r => r.bakeryName).join(", ");
    const avoidLine = alreadySeen ? `Do NOT suggest any of these bakeries already shown: ${alreadySeen}.` : "";

    const prompt = `You are Bun Run — a web app that helps runners end their run at a great local bakery.

Tone: Direct, warm, knowledgeable about food. No fluff, no emojis in text fields, no cheesy fitness clichés.

A runner wants to run ${miles.label} starting from: ${startLocation}
${treatLine}
${avoidLine}

Return 3 different bakery recommendations. For each:
1. ONE specific, well-regarded bakery where the total walking route — including any waypoints — adds up to ${miles.min}–${miles.max} miles. The bakery itself should be roughly ${(miles.min * 0.7).toFixed(1)}–${(miles.max * 0.85).toFixed(1)} miles from the start so waypoint detours don't push the total over. Prioritize independently owned spots written about by Eater, The Infatuation, NYT Dining, Bon Appétit, Serious Eats, or similar. Avoid national chains.
2. 3 menu items. If a treat was requested, it MUST be first.
3. One-sentence route description that mentions the approximate total distance.
4. Google Maps walking URL with 2 waypoints. Before returning it, mentally verify the full walking path (start → waypoint 1 → waypoint 2 → bakery) totals ${miles.min}–${miles.max} miles.
5. A 2-sentence press snippet about the bakery.
6. The bakery's latitude and longitude as numbers.

Return ONLY valid JSON:
{
  "recommendations": [
    {
      "bakeryName": "...",
      "bakeryNeighborhood": "...",
      "bakeryAddress": "...",
      "lat": 0.0,
      "lng": 0.0,
      "menuItems": ["...", "...", "..."],
      "mapsUrl": "https://www.google.com/maps/dir/?api=1&origin=...&waypoints=...&destination=...&travelmode=walking",
      "waypoints": [{"name": "...", "description": "..."}],
      "routeDescription": "...",
      "pressSnippet": "...",
      "pressSource": "..."
    }
  ]
}`;

    try {
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content.map(b => b.type === "text" ? b.text : "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON");
      const parsed = JSON.parse(jsonMatch[0]);
      const newBatch = parsed.recommendations.map(r => ({ ...r, startLocation }));
      setResults([...existingResults, ...newBatch]);
      setStep("result");
    } catch (err) {
      setError("Couldn't find a route right now. Try again.");
      setStep("result");
    }
  }

  function reset() {
    setStep("intro");
    setMiles(null);
    setStartLocation("");
    setTreat([]);
    setResults([]);
    setError(null);
  }

  const treats = [
    { label: "croissant" },
    { label: "cinnamon roll" },
    { label: "sticky bun" },
    { label: "muffin" },
    { label: "cookie" },
    { label: "donut" },
    { label: "bagel" },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.logoRow}>
            <span style={s.logoIcon}>🥐</span>
            <span style={s.logoText}>Bun Run</span>
          </div>
          <p style={s.tagline}>No More Crumby Runs</p>
        </div>

        {/* INTRO */}
        {step === "intro" && (
          <div style={s.section}>
            <p style={s.introText}>
              Be the orchestrator of your group runs. Make a route, discover a new bakery, send to friends. Flaky croissants, not plans.
            </p>
            <button style={s.btnPrimary} onClick={() => setStep("q1")}>
              BUILD MY ROUTE
            </button>
          </div>
        )}

        {/* Q1: Miles */}
        {step === "q1" && (
          <div style={s.section}>
            <div style={s.stepDots}>
              {[0,1,2].map(i => <div key={i} style={{...s.dot, ...(i === 0 ? s.dotActive : {})}}/>)}
            </div>
            <label style={s.question}>How far today?</label>
            <div style={s.rangePills}>
              {[
                { label: "0–2 mi", min: 0.5, max: 2 },
                { label: "2–4 mi", min: 2, max: 4 },
                { label: "3–5 mi", min: 3, max: 5 },
                { label: "4–6 mi", min: 4, max: 6 },
                { label: "6–8 mi", min: 6, max: 8 },
              ].map(r => (
                <button key={r.label}
                  style={{...s.rangePill, ...(miles?.label === r.label ? s.rangePillSelected : {})}}
                  onClick={() => { setMiles(r); setTimeout(() => setStep("q2"), 120); }}>
                  {r.label}
                </button>
              ))}
            </div>
            <button style={{...s.btnPrimary, opacity: miles ? 1 : 0.4}} onClick={() => { if (miles) setStep("q2"); }}>
              NEXT
            </button>
          </div>
        )}

        {/* Q2: Start location */}
        {step === "q2" && (
          <div style={s.section}>
            <div style={s.stepDots}>
              {[0,1,2].map(i => <div key={i} style={{...s.dot, ...(i <= 1 ? s.dotActive : {})}}/>)}
            </div>
            <button style={s.backBtn} onClick={() => setStep("q1")}>← Back</button>
            <label style={s.question}>Starting from where?</label>
            <p style={s.questionSub}>A neighborhood, intersection, or landmark.</p>
            <div style={s.inputCol}>
              <input
                ref={inputRef}
                type="text"
                value={startLocation}
                onChange={e => setStartLocation(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && startLocation.trim()) setStep("q3"); }}
                placeholder="e.g. Grand Army Plaza, Brooklyn"
                style={s.textInput}
              />
              <button
                style={{...s.btnPrimary, opacity: startLocation.trim() ? 1 : 0.4, marginTop: "10px"}}
                onClick={() => { if (startLocation.trim()) setStep("q3"); }}
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {/* Q3: Treat */}
        {step === "q3" && (
          <div style={s.section}>
            <div style={s.stepDots}>
              {[0,1,2].map(i => <div key={i} style={{...s.dot, ...s.dotActive}}/>)}
            </div>
            <button style={s.backBtn} onClick={() => setStep("q2")}>← Back</button>
            <label style={s.question}>Any cravings? 🍩</label>
            <p style={s.questionSub}>{"Pick up to 3 — or skip and we'll choose."}</p>
            <div style={s.treatPills}>
              {treats.map(({label}) => {
                const sel = treat.includes(label);
                const maxed = treat.length >= 3 && !sel;
                return (
                  <button key={label}
                    style={{...s.treatPill, ...(sel ? s.treatPillSelected : {}), ...(maxed ? s.treatPillDisabled : {})}}
                    onClick={() => { if (sel) setTreat(treat.filter(t => t !== label)); else if (!maxed) setTreat([...treat, label]); }}>
                    {label}{sel ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
            {treat.length > 0 && <p style={s.treatCount}>{treat.length}/3 selected</p>}
            <button style={s.btnPrimary} onClick={() => fetchRecommendation([])}>
              FIND MY BAKERY
            </button>
            <button style={s.skipBtn} onClick={() => { setTreat([]); fetchRecommendation([]); }}>
              Skip — surprise me
            </button>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div style={s.loadingWrap}>
            <div style={s.spinner}/>
            <p style={s.loadingTitle}>Plotting your route</p>
            <div style={s.loadingSummary}>
              <div style={s.loadingSummaryRow}><span style={s.loadingSummaryLabel}>From</span><span style={s.loadingSummaryVal}>{startLocation}</span></div>
              <div style={s.loadingSummaryRow}><span style={s.loadingSummaryLabel}>Distance</span><span style={s.loadingSummaryVal}>{miles?.label}</span></div>
              {treat.length > 0 && <div style={s.loadingSummaryRow}><span style={s.loadingSummaryLabel}>Craving</span><span style={s.loadingSummaryVal}>{treat.join(", ")}</span></div>}
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === "result" && error && (
          <div style={s.section}>
            <p style={{color: "#c0392b", marginBottom: 16, fontSize: 15}}>{error}</p>
            <button style={s.btnPrimary} onClick={reset}>TRY AGAIN</button>
          </div>
        )}

        {/* RESULTS */}
        {step === "result" && !error && results.length > 0 && (
          <div style={s.resultsWrap}>
            <div ref={carouselRef} className="carousel" style={s.carousel} onScroll={handleCarouselScroll}>
              {results.map((result, i) => (
                <div key={i} style={s.carouselSlide}>
                  <RouteCard
                    result={result}
                    miles={miles}
                    treat={treat}
                    onShare={() => handleShare(result)}
                  />
                </div>
              ))}
            </div>

            <div style={s.carouselDots}>
              {results.map((_, i) => (
                <div key={i} style={{...s.carouselDot, ...(i === currentCard ? s.carouselDotActive : {})}} />
              ))}
            </div>

            {copied && <p style={s.copiedMsg}>Copied to clipboard!</p>}

            <button style={s.tryAnotherBtn} onClick={() => { fetchRecommendation(results); setCurrentCard(0); }}>
              Try 3 more bakeries
            </button>

            <button style={s.resetBtn} onClick={reset}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              PLAN ANOTHER RUN
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        input::placeholder { color: #999; }
        input:focus { outline: none; border-color: #B85C38 !important; }
        a:hover { opacity: 0.88; }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.97); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .carousel::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#F5EFE6",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "24px 16px 48px",
  },
  card: {
    background: "#FDFAF5",
    borderRadius: "24px",
    border: "1px solid #E0D5C5",
    boxShadow: "0 8px 40px rgba(60,30,10,0.08)",
    padding: "40px 32px",
    width: "100%",
    maxWidth: "520px",
    animation: "fadeUp 0.4s ease both",
  },
  header: { textAlign: "center", marginBottom: "32px" },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "6px" },
  logoIcon: { fontSize: "32px" },
  logoText: { fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 900, color: "#B85C38", letterSpacing: "-0.5px" },
  tagline: { fontSize: "13px", color: "#8C7B6B", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 },

  section: { display: "flex", flexDirection: "column", gap: "16px", animation: "fadeUp 0.3s ease both" },
  introText: { fontSize: "16px", color: "#5C4A3A", lineHeight: 1.65, marginBottom: "8px" },

  stepDots: { display: "flex", gap: "6px", marginBottom: "4px" },
  dot: { width: "6px", height: "6px", borderRadius: "3px", background: "#E0D5C5" },
  dotActive: { background: "#B85C38" },

  backBtn: { background: "none", border: "none", color: "#8C7B6B", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", padding: "0", textAlign: "left", marginBottom: "-8px" },
  question: { display: "block", fontSize: "22px", fontWeight: 700, color: "#2C1A0E", letterSpacing: "-0.2px", fontFamily: "'Fraunces', serif" },
  questionSub: { fontSize: "13px", color: "#8C7B6B", marginTop: "-8px" },

  milesInputWrap: { display: "flex", alignItems: "baseline", gap: "10px", padding: "8px 0" },
  milesInput: { fontSize: "64px", fontWeight: 900, color: "#2C1A0E", background: "none", border: "none", borderBottom: "2px solid #E0D5C5", width: "130px", fontFamily: "'Inter', sans-serif", letterSpacing: "-3px", padding: "0", transition: "border-color 0.2s" },
  milesUnit: { fontSize: "24px", fontWeight: 700, color: "#C4B09A", letterSpacing: "-1px" },

  rangePills: { display: "flex", gap: "8px", flexWrap: "wrap" },
  rangePill: { background: "#EDE3D8", border: "1.5px solid #E0D5C5", borderRadius: "99px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, color: "#5C4A3A", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  rangePillSelected: { background: "#F5EAE3", border: "1.5px solid #B85C38", color: "#B85C38" },

  inputCol: { display: "flex", flexDirection: "column" },
  textInput: { width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1.5px solid #E0D5C5", fontSize: "15px", color: "#2C1A0E", fontFamily: "'Inter', sans-serif", background: "#FAF6F0", transition: "border-color 0.2s" },

  treatPills: { display: "flex", gap: "8px", flexWrap: "wrap" },
  treatPill: { display: "flex", alignItems: "center", gap: "5px", background: "#EDE3D8", border: "1.5px solid #E0D5C5", borderRadius: "99px", padding: "8px 14px", fontSize: "13px", fontWeight: 500, color: "#5C4A3A", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  treatPillSelected: { background: "#F5EAE3", border: "1.5px solid #B85C38", color: "#B85C38", fontWeight: 700 },
  treatPillDisabled: { opacity: 0.35, cursor: "not-allowed" },
  treatCount: { fontSize: "12px", color: "#B85C38", fontWeight: 600, textAlign: "center", marginTop: "-8px" },
  skipBtn: { background: "none", border: "none", color: "#8C7B6B", fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "4px", marginTop: "-8px" },

  btnPrimary: { background: "#B85C38", color: "white", border: "none", borderRadius: "10px", padding: "15px", fontSize: "14px", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer", width: "100%", fontFamily: "'Inter', sans-serif", transition: "opacity 0.15s, transform 0.1s" },

  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: "16px", animation: "fadeUp 0.3s ease both" },
  spinner: { width: "44px", height: "44px", border: "3px solid #E0D5C5", borderTop: "3px solid #B85C38", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingTitle: { fontSize: "18px", fontWeight: 700, color: "#2C1A0E", letterSpacing: "-0.2px", fontFamily: "'Fraunces', serif" },
  loadingBody: { fontSize: "14px", color: "#8C7B6B", textAlign: "center" },
  loadingSummary: { background: "#F0E9DF", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px", width: "100%" },
  loadingSummaryRow: { display: "flex", justifyContent: "space-between", gap: "16px" },
  loadingSummaryLabel: { fontSize: "12px", color: "#8C7B6B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  loadingSummaryVal: { fontSize: "13px", color: "#2C1A0E", fontWeight: 600, textAlign: "right" },

  resultsWrap: { display: "flex", flexDirection: "column", gap: "12px", animation: "fadeUp 0.35s ease both" },

  carousel: { display: "flex", overflowX: "scroll", scrollSnapType: "x mandatory", scrollBehavior: "smooth", msOverflowStyle: "none", scrollbarWidth: "none", gap: "12px" },
  carouselSlide: { flexShrink: 0, width: "100%", scrollSnapAlign: "start" },
  carouselDots: { display: "flex", justifyContent: "center", gap: "6px" },
  carouselDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#E0D5C5", transition: "background 0.2s" },
  carouselDotActive: { background: "#B85C38", width: "18px", borderRadius: "3px" },
  copiedMsg: { textAlign: "center", fontSize: "12px", color: "#3D5A47", fontWeight: 600 },

  routeCard: { display: "flex", flexDirection: "column", borderRadius: "16px", overflow: "hidden", border: "1.5px solid #E0D5C5" },

  routeStrip: { background: "#3D5A47", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" },
  routeStat: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "48px" },
  routeStatVal: { color: "white", fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 },
  routeStatLabel: { color: "rgba(255,255,255,0.65)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", marginTop: "2px" },
  routeDivider: { width: "1px", height: "40px", background: "rgba(255,255,255,0.25)" },
  routeStatMain: { display: "flex", flexDirection: "column", gap: "3px", flex: 1 },
  routeStatCity: { color: "white", fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" },
  routeStatDesc: { color: "rgba(255,255,255,0.75)", fontSize: "12px", lineHeight: 1.4 },

  mapLink: { display: "block", textDecoration: "none", position: "relative" },
  mapEmbed: { width: "100%", height: "180px", position: "relative", background: "#D8E8D8", overflow: "hidden" },
  mapOverlay: { position: "absolute", bottom: "10px", right: "10px", background: "#3D5A47", borderRadius: "8px", padding: "6px 12px", textDecoration: "none", zIndex: 10 },
  mapOpenLabel: { color: "white", fontSize: "12px", fontWeight: 700 },

  waypointsCard: { background: "#F5EFE6", padding: "16px 20px", borderTop: "1px solid #E0D5C5" },
  waypointsToggle: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", width: "100%", padding: 0, fontFamily: "'Inter', sans-serif" },
  waypointsLabel: { color: "#8C7B6B", fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em" },
  waypointRow: { display: "flex", gap: "12px", alignItems: "flex-start" },
  waypointDot: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "24px", alignSelf: "stretch" },
  waypointLine: { width: "1px", height: "10px", background: "#E0D5C5", flexShrink: 0 },
  waypointLineBottom: { width: "1px", flex: 1, minHeight: "12px", background: "#E0D5C5" },
  waypointCircle: { width: "24px", height: "24px", borderRadius: "50%", border: "1.5px solid #C4B09A", background: "#FDFAF5", color: "#5C4A3A", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  waypointText: { display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "12px", flex: 1 },
  waypointName: { color: "#2C1A0E", fontSize: "14px", fontWeight: 600 },
  waypointDesc: { color: "#8C7B6B", fontSize: "12px", lineHeight: 1.4 },

  bakeryCard: { background: "#FDFAF5", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #E0D5C5" },
  bakeryHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  bakeryLabel: { color: "#B85C38", fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "4px" },
  bakeryName: { color: "#2C1A0E", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.2px", lineHeight: 1.2, fontFamily: "'Fraunces', serif" },
  bakeryLocation: { color: "#8C7B6B", fontSize: "13px", marginTop: "3px", fontWeight: 500 },
  bakeryBadge: { fontSize: "28px", lineHeight: 1 },

  pressSnippet: { fontSize: "13px", color: "#5C4A3A", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },

  orderBox: { background: "#F0E9DF", borderRadius: "10px", padding: "12px 14px" },
  orderLabel: { display: "block", color: "#B85C38", fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "6px" },
  orderInline: { fontSize: "13px", lineHeight: 1.5 },
  orderItem: { color: "#5C4A3A", fontWeight: 500 },
  orderItemPrimary: { color: "#2C1A0E", fontWeight: 700 },
  orderStar: { color: "#B85C38", fontSize: "11px" },
  orderComma: { color: "#8C7B6B" },

  shareBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "transparent", border: "1.5px solid #B85C38", color: "#B85C38", borderRadius: "8px", padding: "13px", fontSize: "13px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "'Inter', sans-serif", width: "100%" },

  feedbackBtn: { background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.8 },
  feedbackThanks: { color: "rgba(255,255,255,0.75)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em" },
  feedbackPopover: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#FDFAF5", border: "1.5px solid #E0D5C5", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "170px", boxShadow: "0 8px 24px rgba(60,30,10,0.14)", zIndex: 20 },
  feedbackPopoverTitle: { fontSize: "11px", fontWeight: 800, color: "#8C7B6B", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" },
  feedbackOption: { background: "#F0E9DF", border: "1.5px solid #E0D5C5", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", fontWeight: 600, color: "#2C1A0E", cursor: "pointer", fontFamily: "'Inter', sans-serif", textAlign: "left" },
  feedbackCancel: { background: "none", border: "none", fontSize: "12px", color: "#8C7B6B", cursor: "pointer", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "2px" },

  tryAnotherBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#EDE3D8", border: "1px solid #E0D5C5", color: "#5C4A3A", borderRadius: "10px", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif", width: "100%" },
  resetBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "none", border: "1px solid #E0D5C5", color: "#8C7B6B", borderRadius: "10px", padding: "14px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "'Inter', sans-serif", width: "100%", marginTop: "4px" },

};
