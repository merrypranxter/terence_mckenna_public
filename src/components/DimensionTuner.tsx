import { motion } from "motion/react";
import { 
  Flower2, 
  Sprout, 
  FlaskConical, 
  Network, 
  Zap, 
  Maximize2, 
  Dna, 
  FlameKindling,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { 
  ArchaicDimension, 
  DimensionMetadata, 
  ARCHAIC_DIMENSIONS, 
  OracleTrigger, 
  ORACLE_TRIGGERS 
} from "../types";

interface DimensionTunerProps {
  activeDimension: ArchaicDimension;
  onDimensionChange: (dim: ArchaicDimension) => void;
  noveltyValue: number; // 0.0 - 1.0
  onNoveltyChange: (val: number) => void;
  onSelectPrompt: (promptText: string) => void;
}

export default function DimensionTuner({
  activeDimension,
  onDimensionChange,
  noveltyValue,
  onNoveltyChange,
  onSelectPrompt,
}: DimensionTunerProps) {

  // Dynamic label for the novelty state
  const getNoveltyLabel = (val: number) => {
    if (val < 0.25) return "Historical Conservatism (Low Temperature)";
    if (val < 0.5) return "Balanced Linguistic Ratios";
    if (val < 0.75) return "Accelerated Historical Pluralism";
    if (val < 0.95) return "Cosmic Symbiosis & High Imagination";
    return "Eschatological Climax (Max Chaos)";
  };

  // Maps icon names to actual Lucide component instances
  const renderDimensionIcon = (iconName: string, colorClass: string) => {
    const size = "h-4 w-4 " + colorClass;
    switch (iconName) {
      case "Flower2":
        return <Flower2 className={size} />;
      case "Sprout":
        return <Sprout className={size} />;
      case "Wine":
        return <FlaskConical className={size} />;
      case "Network":
        return <Network className={size} />;
      case "Zap":
        return <Zap className={size} />;
      default:
        return <Flower2 className={size} />;
    }
  };

  return (
    <div className="space-y-4" id="dimension-tuner-panel">
      {/* Wave State Calibration */}
      <div className="bg-[#0c0c0c] border-2 border-[#1a1a1a] p-3 rounded shadow-inner flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-[#00ff41]">
          <div className="flex items-center gap-1.5">
            <Dna className="h-3.5 w-3.5 animate-pulse text-[#00ff41] text-glow" />
            <span className="text-glow">TimeWave Novelty Coefficent</span>
          </div>
          <span className="text-[#00ff41] font-mono text-[10px] opacity-80">
            T_T1_RATIO: {noveltyValue.toFixed(2)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={noveltyValue}
          onChange={(e) => onNoveltyChange(parseFloat(e.target.value))}
          className="w-full accent-[#00ff41] bg-[#1a1a1a] rounded cursor-pointer h-1.5"
          id="novelty-wave-slider"
        />

        <div className="text-[10px] text-[#888] flex justify-between uppercase font-mono mt-1">
          <span>Stasis</span>
          <span className="text-[#00ff41]/90 font-mono text-[9px]">
            {getNoveltyLabel(noveltyValue)}
          </span>
          <span>Eschaton</span>
        </div>
      </div>

      {/* Archaic Lenses */}
      <div className="bg-[#0c0c0c] border-2 border-[#1a1a1a] p-3 rounded shadow-inner">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#00ff41] mb-2 font-mono text-glow">
          Select Archaic Dialogue Lens
        </label>
        
        <div className="space-y-2">
          {ARCHAIC_DIMENSIONS.map((dim) => {
            const isSelected = activeDimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => onDimensionChange(dim.id)}
                className={`w-full text-left p-2.5 rounded border transition-all flex gap-3 ${
                  isSelected
                    ? `border-[#00ff41] bg-[#1a1a1a]/40 shadow-lg text-white`
                    : "border-[#1a1a1a] bg-[#050505] hover:bg-[#0c0c0c] text-slate-400 hover:text-[#00ff41]"
                }`}
                id={`dimension-btn-${dim.id}`}
              >
                {/* Accent Icon indicator */}
                <div className={`p-1.5 rounded bg-[#080808] border self-start ${
                  isSelected ? `border-[#00ff41]` : "border-[#1a1a1a]"
                }`}>
                  {renderDimensionIcon(dim.icon, isSelected ? "text-[#00ff41]" : "text-slate-500")}
                </div>

                <div className="space-y-0.5 max-w-[85%]">
                  <div className="font-bold text-xs font-mono flex items-center gap-1.5 leading-none">
                    <span className={isSelected ? "text-glow text-[#00ff41]" : ""}>{dim.name}</span>
                    {isSelected && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00ff41] animate-ping" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#00ff41]/70 italic font-mono">
                    {dim.tagline}
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[10px] text-slate-400 leading-normal mt-1 border-t border-[#1a1a1a] pt-1"
                    >
                      {dim.description}
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alchemical Oracle prompts */}
      <div className="bg-[#0c0c0c] border-2 border-[#1a1a1a] p-3 rounded shadow-inner">
        <div className="flex items-center gap-1 border-b border-[#1a1a1a] pb-1.5 mb-2">
          <FlameKindling className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Speculative Oracles
          </h4>
        </div>
        
        <div className="grid grid-cols-1 gap-1.5 max-h-[170px] overflow-y-auto pr-1">
          {ORACLE_TRIGGERS.map((oracle, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(oracle.promptText)}
              className="text-left py-1.5 px-2 bg-[#050505] border border-[#1a1a1a] hover:border-[#00ff41] p-1.5 rounded hover:bg-[#0c0c0c] text-[10.5px] text-slate-400 hover:text-[#00ff41] transition-all font-mono leading-relaxed"
              id={`oracle-prompt-${idx}`}
            >
              <div className="text-[8px] uppercase tracking-wider text-[#00ff41]/50 font-mono block">
                [{oracle.category}]
              </div>
              <span className="block font-medium truncate">
                &gt; {oracle.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
