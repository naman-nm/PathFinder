import { useState, useCallback, useRef, type ChangeEvent } from "react";
import { PATHFINDER_PILLARS } from "../data/resources";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ResourceHeroProps {
  onSearch: (query: string) => void;
}

// ─── Debounce helper ──────────────────────────────────────────────────────────
function useDebounce(fn: (val: string) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  return useCallback(
    (val: string) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(val), delay);
    },
    [fn, delay]
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ResourceHero({ onSearch }: ResourceHeroProps) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebounce(onSearch, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const stats = [
    { value: "8", label: "Core Resources" },
    { value: "3", label: "Content Templates" },
    { value: "0→1", label: "Founder Focus" },
  ];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #D6DEF0 0%, #C2CCDE 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* ── Volt green accent blob top-right ───────────────────────────────── */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "#C8F135" }}
      />

      {/* ── Teal accent blob bottom-left ───────────────────────────────────── */}
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{ background: "#1FC8C8" }}
      />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="relative  px-6 py-20 md:py-28">
        <div className=" relative"
         style={{ background: "#C6F357", padding: "40px", borderRadius: "30px", width: "1420px", display: "flex", alignItems: "center", justifyItems: "center", gap: "20px" ,flexDirection: "column" }}>

          {/* Left column */}
          <div className="flex-1" style={{width: "60%"}}>

            {/* Heading */}
            <div style={{ position: "relative", backgroundColor: "#ffffff88", padding: "20px", borderRadius: "40px", width: "100%",
                border: "1px solid #2D2D2D", display: "flex", alignItems: "center", justifyItems: "center", gap: "20px" ,flexDirection: "column" }}>

              <img
                src="/programme_logo.svg"
                alt="PathFinder Logo"
                style={{ width: "160px", height: "160px" }}
              />

              <h1
              className=" font-semibold leading-none tracking-tight"
              style={{ color: "#1E1E1ECC", fontFamily: "League Gothic, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              THE{" "}
              <span
                className="relative inline-block"
                style={{ color: "#1E1E1ECC" }}
              >
                LIBRARY
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="leading-relaxed"
              style={{ color: "#4A4A6A",fontFamily: "Poppins, sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 1.7rem)", margin: "0px", textAlign: "center" }}
            >
              Knowledge that powers your ascent. Curated tools, frameworks, and
              insights for early-stage founders navigating the{" "}
              <span className="font-semibold" style={{ color: "#2C2C3E" }}>
                0→1 climb.
              </span>
            </p>
            </div>

            

            {/* Stats row */}
            <div  style={{  display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginTop: "30px", padding: "20px",}}>

              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span
                    className="text-3xl font-black"
                   style={{ color: "#4A4A6A",fontFamily: "Poppins, sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 1.7rem)", margin: "0px", textAlign: "center" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-sm" style={{ color: "#4A4A6A" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PILLARS */}
        
              {/* <section className="resource-pillars">
        
                {PATHFINDER_PILLARS.map((pillar) => (
        
                  <div key={pillar.title}>
        
                    <h3>
                      {pillar.title}
                    </h3>
        
                    <p>
                      {pillar.description}
                    </p>
        
                  </div>
        
                ))}
        
              </section> */}
          
        </div>
        
      </div>

      {/* ── Bottom edge accent ─────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 h-[3px] w-full"
        style={{
          background: "linear-gradient(90deg, #1FC8C8 0%, #C8F135 50%, #1FC8C8 100%)",
        }}
      />
    </section>
  );
}
