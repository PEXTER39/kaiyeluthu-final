import { useEffect, useState } from "react";
import { Pencil, iconUrl, wordmarkUrl } from "./Brand";

const KEY = "kc_intro_seen";

/** Inline head script: hides the intro before paint when already seen this visit. */
export const introHeadScript = `try{if(sessionStorage.getItem("${KEY}"))document.documentElement.dataset["intro"]="seen"}catch(e){}`;

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset["intro"] === "seen") { setDone(true); return; }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(finish, reduce ? 1400 : 3250);
    return () => clearTimeout(t);
  }, []);

  function finish() {
    document.documentElement.dataset["intro"] = "seen";
    setDone(true);
  }

  if (done) return null;
  const lines = [25.2, 41.3, 57.3, 72.8];
  return (
    <div className="intro-overlay" onClick={finish} role="presentation">
      <button type="button" className="intro-skip rounded-full border border-ink/30 bg-paper px-3 py-1 text-xs font-medium text-ink" onClick={finish}>
        Skip
      </button>
      <div className="intro-card shadow-card">
        {lines.map((top, i) => (
          <span key={top} className={`intro-line ${i % 3 === 0 ? "bg-lineblue" : "bg-redpen/40"}`} style={{ top: `${top}%`, animationDelay: `${i * 0.06}s` }} />
        ))}
        <span className="intro-margin" style={{ left: "9.2%" }} />
        <span className="intro-margin" style={{ left: "10.3%", animationDelay: "0.05s" }} />
        <img src={wordmarkUrl} alt="" className="intro-word" />
        <Pencil className="intro-pencil" />
      </div>
      <p className="intro-sub text-sm sm:text-base">KAIYELUTHU</p>
      <img src={iconUrl} alt="" className="intro-ka" />
    </div>
  );
}
