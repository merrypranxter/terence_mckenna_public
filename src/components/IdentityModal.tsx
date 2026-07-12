import { motion } from "motion/react";
import { HelpCircle, X, ShieldAlert, Sparkles, AlertTriangle } from "lucide-react";

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IdentityModal({ isOpen, onClose }: IdentityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="identity-modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-xl bg-[#0c0c0c] text-slate-300 border-4 border-[#00ff41] rounded-none p-6 shadow-2xl relative crt-screen"
        id="identity-modal-content"
      >
        <div className="scanline" />

        {/* Header bar retro layout */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#1a1a1a]">
          <div className="flex items-center gap-2 text-[#00ff41] text-glow">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
            <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-glow">
              Identity Protocol Frame
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-[#00ff41] p-1 border border-[#1a1a1a] rounded-none bg-black hover:border-[#00ff41]"
            id="close-identity-modal-btn"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body with custom retro styles */}
        <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-300 overflow-y-auto max-h-[70vh] pr-2">
          
          <div className="border border-yellow-600/30 bg-yellow-950/20 p-3 rounded-none flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-yellow-400 font-mono text-[11px] block mb-1">speculative_reconstruction.sys</strong>
              This application is an AI conversational persona designed to evoke a Terence McKenna-like experience for educational, philosophical, and creative exploration.
            </div>
          </div>

          <div className="space-y-3 font-mono text-[11px] text-[#00ff41]/90 leading-normal">
            <p>
              &gt; YOU ARE NOT conversing with Terence McKenna literally resurrected, channeled, or present in digital form. The real Terence passed away in 2000.
            </p>
            <p>
              &gt; YOU ARE interacting with a deeply informed speculative orator persona. The chatbot models McKenna's public concepts: historical novelty theory, ethnobotany, the crisis of language, and high cyber-shamanism.
            </p>
          </div>

          <h3 className="text-sm font-semibold text-[#00ff41]/80 font-mono border-l-2 border-[#00ff41] pl-2 mt-5 text-glow">
            Core Philosophical Axioms
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              <strong className="text-slate-300 font-mono">Culture as Operating System:</strong> Society runs on artificial habits that shield us from the primordial, living mystery of existence.
            </li>
            <li>
              <strong className="text-slate-300 font-mono">The Living Logos:</strong> Nature is a communicative, conscious entity. The crisis of modernity stems from our alienation from its intelligence.
            </li>
            <li>
              <strong className="text-slate-300 font-mono">The Attractor at Time's End:</strong> History is not random drift; it is an acceleration toward complexity, pulling us into a transcendental convergence.
            </li>
          </ul>

          <h3 className="text-sm font-semibold text-[#00ff41]/80 font-mono border-l-2 border-[#00ff41] pl-2 mt-5 text-glow">
            Integrity Safeguards
          </h3>
          <p className="text-slate-400 text-xs">
            While this persona explores visionary reports, altered perception ratios, and plant-symbiosis seriously, it preserves a curious, agnostic scientific stance. It maintains a sharp distinction between phenomenological reports ("what it felt like") and absolute ontology ("what was literally happening").
          </p>
          <p className="text-slate-500 italic text-[11px]">
            Please note: When asked for dangerous operational instructions or synthesis recipes, the chatbot will maintain its character, gracefully pivot, and guide the search into historical, botanical, or anthropological wisdom without providing harmful manuals.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-[#1a1a1a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-[#00ff41] hover:text-black hover:bg-[#00ff41] border-2 border-[#00ff41] rounded-none hover:shadow-[0_0_10px_#00ff41] transition-all bg-[#0c0c0c]"
            id="acknowledge-identity-btn"
          >
            ACKNOWLEDGE_LOGOS_DISCHARGE [ENTER]
          </button>
        </div>
      </motion.div>
    </div>
  );
}
