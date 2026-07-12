import React, { useState } from "react";
import { Sparkles, Play, PlayCircle, Send, Plus, Volume2, VolumeX } from "lucide-react";
import { Aphorism, APHORISM_DECK } from "../types";

interface AphorismDeckProps {
  onSeed: (text: string) => void;
  onTransmit: (text: string) => void;
  speechPitch: number;
  speechRate: number;
}

export default function AphorismDeck({ 
  onSeed, 
  onTransmit,
  speechPitch,
  speechRate
}: AphorismDeckProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const categories = ["ALL", "PSYCHEDELICS", "CULTURE", "LANGUAGE", "THE ESOTERIC", "FELT EXPERIENCE"];

  const filteredQuotes = selectedCategory === "ALL" 
    ? APHORISM_DECK 
    : APHORISM_DECK.filter(q => q.category.toUpperCase() === selectedCategory);

  // Bounds safety checks
  const safeIndex = currentIndex >= filteredQuotes.length ? 0 : currentIndex;
  const currentQuote = filteredQuotes[safeIndex];

  const handleNext = () => {
    window.speechSynthesis.cancel();
    setSpeakingText(null);
    setCurrentIndex(prev => (prev + 1) % filteredQuotes.length);
  };

  const handlePrev = () => {
    window.speechSynthesis.cancel();
    setSpeakingText(null);
    setCurrentIndex(prev => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
  };

  const handleCategoryChange = (cat: string) => {
    window.speechSynthesis.cancel();
    setSpeakingText(null);
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  const handleToggleSpeech = (text: string) => {
    if (speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = speechPitch;
      utterance.rate = speechRate;
      
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        v.lang.startsWith("en-") && 
        (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("natural"))
      );
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => {
        setSpeakingText(null);
      };
      
      setSpeakingText(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTransmit = () => {
    if (!currentQuote) return;
    onTransmit(`Expand speculatively upon your legendary statement: "${currentQuote.text}"`);
  };

  return (
    <div className="border border-[#1a1a1a] bg-[#0c0c0c] p-3 rounded-none uppercase text-[10px] space-y-3" id="aphorism-deck-widget">
      <div className="flex items-center gap-1.5 opacity-40 border-b border-[#1a1a1a] pb-1 font-bold">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        <span>Alchemical Aphorisms Seed Deck</span>
      </div>

      {/* Category Selection Carousel */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none select-none max-w-full" id="aphorisms-category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`px-1.5 py-0.5 text-[8.5px] font-mono whitespace-nowrap border rounded-none transition-all cursor-pointer ${
              selectedCategory === cat 
                ? "border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10 font-bold" 
                : "border-[#1a1a1a] text-slate-500 hover:text-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredQuotes.length > 0 && currentQuote ? (
        <div className="space-y-3" id="aphorism-card-shell">
          {/* Main Card */}
          <div className="bg-[#050505] border-2 border-[#1a1a1a] p-3 relative flex flex-col justify-between min-h-[110px]">
            {/* Corner Decorative Glyphs */}
            <span className="absolute top-1.5 right-2 text-slate-700 text-[10px] font-serif leading-none">🝓</span>
            
            <div className="space-y-2">
              <span className="text-[8px] bg-amber-950/45 text-amber-500 border border-amber-950 px-1 font-bold">
                {currentQuote.category}
              </span>
              <p className="normal-case font-serif text-[12.5px] leading-relaxed text-white opacity-95 line-clamp-4">
                "{currentQuote.text}"
              </p>
            </div>

            <div className="text-[8.5px] text-slate-500 mt-2 font-mono flex items-center justify-between lowercase italic">
              <span>source: {currentQuote.source || "archaic tapes"}</span>
              <span className="text-[9px] text-[#00ff41]/60 font-mono font-bold uppercase not-italic">
                [{safeIndex + 1}/{filteredQuotes.length}]
              </span>
            </div>
          </div>

          {/* Interactive Action Controls Row */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleToggleSpeech(currentQuote.text)}
              className={`py-1.5 border select-none transition-all flex items-center justify-center gap-1 text-[9px] font-bold cursor-pointer ${
                speakingText === currentQuote.text 
                  ? "bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41] animate-pulse" 
                  : "text-slate-400 border-[#1a1a1a] bg-[#050505] hover:border-[#00ff41]/50 hover:text-[#00ff41]"
              }`}
              title="Hear this quote spoken by the Cadence system"
            >
              {speakingText === currentQuote.text ? (
                <>
                  <VolumeX className="h-3 w-3 text-[#00ff41]" />
                  <span>MUTE VOICE</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3 w-3 text-[#00ff41]/80" />
                  <span>VOCALIZE QUOTE</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSeed(currentQuote.text)}
              className="py-1.5 border border-[#1a1a1a] bg-[#050505] text-slate-400 hover:border-[#00ff41]/50 hover:text-[#00ff41] transition-all flex items-center justify-center gap-1 text-[9px] font-bold cursor-pointer"
              title="Load this quote as a user query template"
            >
              <Plus className="h-3 w-3 text-[#00ff41]" />
              <span>LOAD AS PROMPT</span>
            </button>

            <button
              type="button"
              onClick={handlePrev}
              className="py-1 bg-black border border-[#1a1a1a] hover:border-[#00ff41] text-slate-500 hover:text-[#00ff41] text-[9.5px] font-bold transition-all cursor-pointer"
            >
              &lt; PREV LOGOS
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="py-1 bg-black border border-[#1a1a1a] hover:border-[#00ff41] text-slate-500 hover:text-[#00ff41] text-[9.5px] font-bold transition-all cursor-pointer"
            >
              NEXT LOGOS &gt;
            </button>
          </div>

          <button
            type="button"
            onClick={handleTransmit}
            className="w-full py-1.5 bg-[#050505] hover:bg-[#00ff41] hover:text-black text-[#00ff41] border border-[#00ff41]/50 font-bold tracking-wider hover:shadow-[0_0_8px_#00ff41]/35 cursor-pointer flex items-center justify-center gap-1.5 text-[9.5px]"
            title="Send quote immediately as an interpretive inquiry"
          >
            <Send className="h-3 w-3 text-inherit" />
            DISCHARGE SEED TO ORATOR
          </button>
        </div>
      ) : (
        <p className="text-center text-slate-600 py-3 italic lowercase">No alchemical seeds match criteria</p>
      )}
    </div>
  );
}
