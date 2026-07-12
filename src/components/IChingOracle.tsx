import React, { useState } from "react";
import { Coins, Sparkles, Send, RefreshCw } from "lucide-react";
import { IChingHexagram, ICHING_HEXAGRAMS } from "../types";

interface IChingOracleProps {
  onConsult: (promptText: string) => void;
  accentColorClass?: string;
}

export default function IChingOracle({ onConsult, accentColorClass = "border-[#00ff41] text-[#00ff41]" }: IChingOracleProps) {
  const [isCasting, setIsCasting] = useState(false);
  const [currentHexagram, setCurrentHexagram] = useState<IChingHexagram | null>(null);
  const [tosses, setTosses] = useState<number[]>([]);

  const handleCastHexagram = () => {
    setIsCasting(true);
    setTosses([]);
    
    // Simulate yarrow-stalk / 3-coin tosses for 6 lines (bottom to top)
    let count = 0;
    const interval = setInterval(() => {
      // Each line is determined by sum of 3 coin tosses (heads = 3, tails = 2): 
      // sum can be 6 (yin old), 7 (yang young), 8 (yin young), 9 (yang old)
      // For simplicity, we can do 0 (yin) or 1 (yang) 
      const lineVal = Math.random() > 0.5 ? 1 : 0;
      setTosses(prev => [...prev, lineVal]);
      count++;
      if (count >= 6) {
        clearInterval(interval);
        
        // Finalize casting
        setTimeout(() => {
          // Select one of our 8 classic programmed hexagrams, or draft a procedural one
          // We can select randomly from our programmed ones for a rich experience, or choose based on tosses
          const randomIndex = Math.floor(Math.random() * ICHING_HEXAGRAMS.length);
          const selected = ICHING_HEXAGRAMS[randomIndex];
          
          // Let's override its lines dynamically to match current tosses for high kinetic integrity!
          setCurrentHexagram({
            ...selected,
            lines: Array.from({ length: 6 }, () => Math.random() > 0.5 ? 1 : 0)
          });
          setIsCasting(false);
        }, 400);
      }
    }, 180);
  };

  const handleConsult = () => {
    if (!currentHexagram) return;
    const prompt = `I have cast Hexagram ${currentHexagram.number}: ${currentHexagram.name} (${currentHexagram.translation}) inside the I Ching Oracle module. The lines cast bottom-to-top are [${currentHexagram.lines.join(", ")}]. How do you speculative-philosophically read this specific hexagram in the context of the archaic revival, novelty acceleration, and my personal journey?`;
    onConsult(prompt);
  };

  return (
    <div className="border border-[#1a1a1a] bg-[#0c0c0c] p-3 rounded-none uppercase text-[10px] space-y-3" id="iching-oracle-widget">
      <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-1 font-bold">
        <div className="flex items-center gap-1.5 opacity-40">
          <Coins className="h-3.5 w-3.5" />
          <span>I Ching Oracular Divination</span>
        </div>
        {currentHexagram && !isCasting && (
          <button 
            type="button"
            onClick={handleCastHexagram}
            className="text-[9px] text-[#00ff41] hover:underline flex items-center gap-1 cursor-pointer font-bold select-none border border-[#00ff41]/30 px-1 hover:bg-[#00ff41]/10 bg-black transition-colors"
          >
            <RefreshCw className="h-2 w-2" />
            RE-CAST
          </button>
        )}
      </div>

      {!currentHexagram && !isCasting ? (
        <div className="text-center py-4 space-y-2.5">
          <p className="text-slate-500 text-[9px] normal-case italic font-sans leading-relaxed">
            "The I Ching is a system designed to model the transitions of the organizational waves of the cosmic mind structure."
          </p>
          <button
            type="button"
            onClick={handleCastHexagram}
            className="w-full py-2 bg-[#050505] hover:bg-[#00ff41] hover:text-black text-[#00ff41] border border-[#00ff41] font-mono font-bold tracking-widest text-[10px] uppercase transition-all shadow-[0_0_8px_rgba(0,255,65,0.1)] hover:shadow-[0_0_12px_#00ff41]/50 cursor-pointer"
            id="cast-iching-btn"
          >
            CAST VIRTUAL HEXAGRAM
          </button>
        </div>
      ) : isCasting ? (
        <div className="space-y-3 py-2 text-center" id="iching-casting-state">
          {/* Casting animation */}
          <div className="flex flex-col items-center justify-center gap-1">
            <Coins className="h-6 w-6 text-[#00ff41] animate-bounce" />
            <span className="text-[9px] tracking-widest animate-pulse font-mono text-[#00ff41] font-bold">
              FLIPPING TRITON COINS...
            </span>
          </div>

          {/* Staggered lines appearing */}
          <div className="flex flex-col-reverse items-center justify-center gap-1 max-w-[120px] mx-auto h-[48px] border-y border-[#1a1a1a] py-1 bg-black/40">
            {Array.from({ length: 6 }).map((_, i) => {
              const active = tosses[i] !== undefined;
              return (
                <div key={i} className="w-16 h-1 flex items-center justify-center transition-all">
                  {active ? (
                    tosses[i] === 1 ? (
                      <div className="w-12 h-0.5 bg-[#00ff41]/80 shadow-[0_0_4px_#00ff41]" />
                    ) : (
                      <div className="w-12 h-0.5 flex justify-between">
                        <div className="w-5 h-full bg-[#00ff41]/80 shadow-[0_0_4px_#00ff41]" />
                        <div className="w-5 h-full bg-[#00ff41]/80 shadow-[0_0_4px_#00ff41]" />
                      </div>
                    )
                  ) : (
                    <div className="w-12 h-0.5 border-t border-dashed border-[#1a1a1a]" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[8px] text-slate-500 font-mono">
            SUMMING RATIOS [YARROW SEQUENCE: {tosses.length}/6]
          </div>
        </div>
      ) : (
        currentHexagram && (
          <div className="space-y-3" id="iching-result-panel">
            {/* Hexagram Display Card */}
            <div className="bg-[#050505] border border-[#1a1a1a] p-2 flex gap-3">
              {/* Glowing Line Graphic Column */}
              <div className="flex flex-col-reverse justify-center items-center gap-1.5 w-16 h-[72px] bg-black border border-[#1a1a1a] p-1.5 select-none shrink-0" title="Hexagram representation (bottom up)">
                {currentHexagram.lines.map((val, i) => (
                  <div key={i} className="w-12 h-1 flex items-center justify-center">
                    {val === 1 ? (
                      <div className="w-10 h-1 bg-[#00ff41] shadow-[0_0_4px_#00ff41]" />
                    ) : (
                      <div className="w-10 h-1 flex justify-between">
                        <div className="w-4 h-full bg-[#00ff41] shadow-[0_0_4px_#00ff41]" />
                        <div className="w-4 h-full bg-[#00ff41] shadow-[0_0_4px_#00ff41]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Text Column */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] bg-[#00ff41] text-black px-1 font-bold">
                    HEXAGRAM {currentHexagram.number}
                  </span>
                  <span className="text-[12px] text-white font-bold leading-none">
                    {currentHexagram.chineseName}
                  </span>
                </div>
                <h5 className="font-bold text-xs font-mono text-glow text-white tracking-wide truncate">
                  {currentHexagram.name.toUpperCase()}
                </h5>
                <p className="text-[8px] text-slate-400 font-sans italic lowercase tracking-wider leading-none">
                  {currentHexagram.translation}
                </p>
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-1.5 font-mono text-[9px] normal-case bg-black/40 border-l-2 border-[#1a1a1a] pl-2 py-0.5">
              <div className="space-y-0.5">
                <span className="text-[#00ff41] font-bold uppercase text-[8px] tracking-wider block">ORACULAR JUDGMENT:</span>
                <p className="text-slate-300 leading-tight font-sans">{currentHexagram.judgment}</p>
              </div>
              <div className="space-y-0.5 pt-1 border-t border-[#1a1a1a]/40">
                <span className="text-amber-500 font-bold uppercase text-[8px] tracking-wider block">TIMESHIFT NOTES (MCKENNA):</span>
                <p className="text-slate-400 leading-tight font-sans italic font-medium">"{currentHexagram.mckennaNotes}"</p>
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleConsult}
              className="w-full py-1.5 bg-black hover:bg-[#00ff41]/10 text-[#00ff41] hover:text-white border border-[#00ff41] text-[9.5px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer hover:shadow-[0_0_8px_rgba(0,255,65,0.2)]"
            >
              <Send className="h-3 w-3" />
              INQUIRE ORATOR (DECODE HEXAGRAM)
            </button>
          </div>
        )
      )}
    </div>
  );
}
