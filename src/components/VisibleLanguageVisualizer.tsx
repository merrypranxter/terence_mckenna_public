import { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Pause, RefreshCw } from "lucide-react";

interface VisualizerProps {
  isGenerating: boolean;
  activeColor: string;
}

const ALCHEMICAL_GLYPHS = [
  "🜍", "🝔", "🜔", "🝕", "🜂", "🜃", "🜁", "🜄", "🜋", "🜚", "🜏", "🜶",
  "Ψ", "Ω", "Φ", "θ", "λ", "ξ", "🍄", "◈", "⚙", "❈", "♾", "☿", "☉", "☽"
];

const MCKENNA_PHRASES = [
  "NOVELTY", "GAIA", "LOGOS", "ARCHAIC", "REVIVAL", "FELT PRESENCE", "ESCHATON",
  "HYPERSPACE", "TRANSCENDENTAL", "SHAMANIC", "VEGETABLE MATRIX", "TIMEWAVE"
];

export default function VisibleLanguageVisualizer({ isGenerating, activeColor }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [complexity, setComplexity] = useState<"low" | "mid" | "hyper">("mid");
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = 140);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 140;
      }
    };
    window.addEventListener("resize", handleResize);

    // Particles/Glyphs system
    interface Glyphs {
      x: number;
      y: number;
      char: string;
      speed: number;
      opacity: number;
      scale: number;
      color: string;
      isWord: boolean;
    }

    let items: Glyphs[] = [];

    const createItem = (spawnY = 0): Glyphs => {
      const isWord = Math.random() > 0.8;
      const char = isWord 
        ? MCKENNA_PHRASES[Math.floor(Math.random() * MCKENNA_PHRASES.length)]
        : ALCHEMICAL_GLYPHS[Math.floor(Math.random() * ALCHEMICAL_GLYPHS.length)];
      
      const speedMult = complexity === "hyper" ? 2.5 : complexity === "low" ? 0.6 : 1.2;
      const baseSpeed = Math.random() * 1.5 + 0.5;

      // Color variation based on active color theme
      let col = "#00ff41"; // default terminal green
      if (activeColor.includes("green")) col = "#00ff41";
      if (activeColor.includes("amber")) col = "#f59e0b";
      if (activeColor.includes("cyan")) col = "#06b6d4";
      if (activeColor.includes("purple")) col = "#a855f7";

      return {
        x: Math.random() * width,
        y: spawnY === 0 ? Math.random() * height : spawnY,
        char,
        speed: baseSpeed * speedMult * (isGenerating ? 2.0 : 1.0),
        opacity: Math.random() * 0.7 + 0.3,
        scale: Math.random() * 0.4 + 0.7,
        color: col,
        isWord,
      };
    };

    // Populate initial items
    const maxItems = complexity === "hyper" ? 40 : complexity === "low" ? 12 : 24;
    for (let i = 0; i < maxItems; i++) {
      items.push(createItem());
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(12, 12, 12, 0.25)"; // Trails effect matching terminal-darkBg
      ctx.fillRect(0, 0, width, height);

      // Grid/Scanner aesthetic matching terminal design
      ctx.strokeStyle = "rgba(0, 255, 65, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw active items
      items.forEach((item, index) => {
        ctx.save();
        ctx.globalAlpha = item.opacity;
        
        if (item.isWord) {
          ctx.font = `bold ${Math.round(11 * item.scale)}px "Share Tech Mono"`;
          ctx.fillStyle = item.color;
          // Glow effect for words when generating
          if (isGenerating) {
            ctx.shadowColor = item.color;
            ctx.shadowBlur = 8;
          }
        } else {
          ctx.font = `${Math.round(18 * item.scale)}px serif`;
          ctx.fillStyle = isGenerating ? "#ffffff" : item.color;
        }

        ctx.fillText(item.char, item.x, item.y);
        ctx.restore();

        // Move item
        item.y += item.speed;

        // Pulse opacity slightly
        item.opacity += (Math.random() - 0.5) * 0.1;
        item.opacity = Math.max(0.1, Math.min(1, item.opacity));

        // Recycle if out of bounds or expired
        if (item.y > height + 20) {
          items[index] = createItem(-15);
        }
      });

      // Special active links for "visible wave" when generative state is running
      if (isGenerating && Math.random() > 0.5 && items.length > 2) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 65, 0.15)";
        ctx.lineWidth = 0.5;
        const i1 = Math.floor(Math.random() * items.length);
        const i2 = Math.floor(Math.random() * items.length);
        ctx.moveTo(items[i1].x, items[i1].y);
        ctx.lineTo(items[i2].x, items[i2].y);
        ctx.stroke();
      }

      // Maintain item count based on density selection
      const targetCount = complexity === "hyper" ? 45 : complexity === "low" ? 15 : 28;
      if (items.length < targetCount) {
        items.push(createItem(-10));
      } else if (items.length > targetCount) {
        items.pop();
      }

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, complexity, isGenerating, activeColor]);

  const handleTriggerAlchemicalBurst = () => {
    // Flash visualizer by rapidly toggling settings
    setComplexity("hyper");
    setTimeout(() => {
      setComplexity("mid");
    }, 1500);
  };

  return (
    <div className="relative bg-[#0c0c0c] border-2 border-[#1a1a1a] p-2 font-mono text-xs rounded shadow-inner" id="linguistic-telemetry-panel">
      {/* Visual Title Grid */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-1.5 text-[#00ff41] font-bold uppercase tracking-wider text-glow">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#00ff41]" />
          <span>Linguistic Telemetry</span>
          {isGenerating && (
            <span className="text-[10px] bg-red-950 text-red-400 px-1 border border-red-850 rounded animate-pulse">
              TRANSPRESSING LOGOS
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Controls */}
          <button
            onClick={() => setIsActive(!isActive)}
            title={isActive ? "Pause Telemetry" : "Run Telemetry"}
            className="hover:text-[#00ff41] text-slate-500 p-0.5"
            id="pause-telemetry-btn"
          >
            {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
          <button
            onClick={handleTriggerAlchemicalBurst}
            title="Inject Novelty Burst"
            className="hover:text-[#00ff41] text-slate-500 p-0.5 animate-spin-slow"
            id="burst-telemetry-btn"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Screen Canvas representation */}
      <div className="relative overflow-hidden bg-[#050505] rounded border border-[#1a1a1a]">
        <canvas ref={canvasRef} className="block w-full" style={{ imageRendering: "pixelated" }} />
        {/* Retro Grid Accent */}
        <div className="absolute inset-0 pointer-events-none border border-[#00ff41]/5" />
        <div className="absolute top-1 left-2 pointer-events-none text-[8px] text-[#00ff41]/40 font-mono">
          REF_WAVE: ACTIVE_OS_X4.1
        </div>
      </div>

      {/* Selector Options */}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#1a1a1a] text-slate-500 text-[10px]">
        <span>GLYPH RESOLUTION:</span>
        <div className="flex gap-2">
          {(["low", "mid", "hyper"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setComplexity(lvl)}
              className={`uppercase font-bold hover:text-[#00ff41] ${
                complexity === lvl ? "text-[#00ff41] underline decoration-2 cursor-default" : ""
              }`}
              id={`telemetry-density-${lvl}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
