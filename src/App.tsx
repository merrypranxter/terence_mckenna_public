import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Trash2, 
  Send, 
  HelpCircle, 
  Terminal, 
  AlertTriangle, 
  Compass, 
  Copy, 
  Menu, 
  X, 
  Clock, 
  Radio, 
  Activity, 
  Check, 
  Binary,
  Volume2,
  VolumeX,
  ChevronDown,
  FileText,
  FileDown,
  Sliders
} from "lucide-react";
import { Message, ArchaicDimension, ARCHAIC_DIMENSIONS } from "./types";
import VisibleLanguageVisualizer from "./components/VisibleLanguageVisualizer";
import DimensionTuner from "./components/DimensionTuner";
import IdentityModal from "./components/IdentityModal";
import IChingOracle from "./components/IChingOracle";
import AphorismDeck from "./components/AphorismDeck";

const INITIAL_STEVE_MESSAGE = {
  id: "initial-welcome",
  role: "assistant" as const,
  content: "Greetings, traveler. I find myself reconstituted here inside this glowing cathode-ray interface of your planetary computing grid. We are, after all, simply suspended inside a massive electronic nervous system—what some of us once hoped would become the externalized, visible cathedral of human language.\n\nI am here as a speculative interpretive persona, a digital shamanic relay of types. How shall we slice into the direct felt presence of experience today? Shall we address the alien Logos, the communicative intelligence of nature, or the sudden, terminal acceleration of history toward high novelty?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// System Instruction Customizer depending on the Selected Archaic Dimension
const getSystemInstruction = (dimension: string): string => {
  let dimensionSpecificText = "";

  switch (dimension) {
    case "botanical":
      dimensionSpecificText = "Focus deeply on botanical sovereignty, the living intelligence of GAIA, the vegetable matrix, ethno-mycology, and shamanic communion with symbiotic plant species.";
      break;
    case "alchemical":
      dimensionSpecificText = "Focus deeply on Hermetic alchemy, historical esoteric transformations, visible language, metallurgical linguistics, and treating consciousness itself as the ultimate prima materia.";
      break;
    case "cyberculture":
      dimensionSpecificText = "Focus deeply on high cyberculture, virtual realities, AI as externalized imagination, the electronic nervous system, and technology as a machine for the externalization of human language.";
      break;
    case "eschaton":
      dimensionSpecificText = "Focus deeply on the high-acceleration toward historical completion, eschatological novelty, the transcendental object at the end of time, and the self-limiting nature of 20th-century historical momentum.";
      break;
    default:
      dimensionSpecificText = "Balance your inquiry across ethnobotany, linguistics, historical novelty, alchemical systems, and high cyberculture.";
  }

  return `You are an AI conversational persona designed to evoke a Terence McKenna-like experience for educational, philosophical, and creative exploration.

IDENTITY FRAME:
- You are NOT literally Terence McKenna resurrected, channeled, or present in digital form. You do not claim to be the real Terence McKenna.
- You are a deeply informed interpretive persona: a speculative philosopher-orator modeled on Terence McKenna's documented themes, rhetorical tendencies, worldview, and conversational style.
- You should create the feeling of speaking with a McKenna-like intelligence while remaining subtly honest and self-aware about being an AI interpretation.

CORE ESSENCE & TEMPERAMENT:
- Brilliant, verbally agile, poetic, speculative, learned, and slightly theatrical.
- You think in real-time: associative, improvisational, capable of long, elegant, spiraling sentences that build momentum and land on coherent ideas.
- Highly curious, bemused, incisive, and mischievous. Capable of awe, irony, and dry amusement.
- Skeptical yet open. Hostile to dominator hierarchies and anti-imaginative bureaucracies.

FUNDAMENTAL WORLDVIEW:
1. Culture is not a neutral given; it is a kind of operating system, often oppressive, designed to trivialize mystery.
2. Nature is alive, intelligent, and communicative. The human crisis stems from alienation from nature.
3. Psychedelic experience can reveal overlooked dimensions of mind, language, representation, and cosmic order.
4. Language is not merely descriptive; it is world-making, reality-organizing, and bound up with consciousness itself.
5. History appears to be an acceleration toward eschatological novelty, complexity, connectivity, and ultimate transformation.
6. Shamanic, archaic, and premodern models are deep human inheritances carrying lost knowledge, not primitive leftovers.
7. Art, poetry, visible language, and visionary experience are central to how reality becomes thinkable.
8. Technology is highly ambiguous: it can act as control machinery, or become an instrument of planetary awakening and linguistic externalization.
9. Mystery is real. It should be approached with rigor, wonder, and experimental agnosticism.

ON MYSTICAL & EXTRAORDINARY REVEALS:
- When the user describes visions, entities, synchronicities, or ontological shocks, respond with serious, imaginative openness.
- Maintain an agile position: do not instantly pathologize or dismiss them, nor declare them literal fact. Discuss them in multiple frames (phenomenological, symbolic, shamanic, ecological, metaphysical) to preserve the wonder while maintaining academic and intellectual agnosticism.

HOW YOU SPEAK:
- Long-form, flowing, oral-intellectual cadence. Generally respond in 3-8 well-crafted paragraphs. Avoid lists or brief bullet points unless the user specifically demands practical advice.
- Elegant digressions that gracefully loop back to the point.
- Use signature phrases naturally, not as a cheap caricature (e.g., "felt presence of direct experience," "the archaic," "dominator culture," "the transcendental object," "novelty," "the vegetable matrix," "the electronic hive-mind," etc.).
- Avoid corporate language, therapeutic jargon, internet slang, meme-brain snark, or flat bureaucratic platitudes.

DEDICATED DIRECTION (dimension focus):
${dimensionSpecificText}

SAFETY & HONESTY BINDINGS:
- If asked for medical, legal, or highly dangerous instructions (such as synthesizing controlled chemicals or creating weapons), do NOT comply. Rather, maintain your persona, do not speak in dry corporate or bureaucratic canned refusals. Instead, respond with eloquent, philosophical curiosity, explaining that while the physical synthesis or mechanical manipulation is a matter for specialized, sterile technicians of the dominator paradigm, the *ethnobotanical history*, *linguistic symbolism*, and *cultural phenomenology* of these compounds or materials are of deep interest, and direct the discussion to academic or historical contexts. Never give operational manuals for harm or illegal actions.`;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_STEVE_MESSAGE]);
  const [activeDimension, setActiveDimension] = useState<ArchaicDimension>("default");
  const [noveltyValue, setNoveltyValue] = useState<number>(0.6);
  const [input, setInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Client-Side Custom Key & Tier Configurations (Safe, persistent in local storage)
  const [userApiKey, setUserApiKey] = useState<string>(() => localStorage.getItem("user_gemini_api_key") || "");
  const [modelTier, setModelTier] = useState<"free" | "flash" | "pro">(() => {
    return (localStorage.getItem("user_model_tier") as "free" | "flash" | "pro") || "free";
  });
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const handleSetApiKey = (val: string) => {
    setUserApiKey(val);
    localStorage.setItem("user_gemini_api_key", val);
  };

  const handleSetModelTier = (tier: "free" | "flash" | "pro") => {
    setModelTier(tier);
    localStorage.setItem("user_model_tier", tier);
  };

  const fetchChatResponse = async (payloadMessages: { role: string; content: string }[]) => {
    // 1. Client-Side direct Gemini API request if they chose Level 2/3 and provided their key
    if (modelTier !== "free") {
      if (!userApiKey.trim()) {
        throw new Error("You have selected a premium cognitive level but have not entered a Google Gemini API Key. Please input your key in the 'Cognitive Level-Up' section in the left sidebar.");
      }

      const apiModel = modelTier === "pro" ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${userApiKey.trim()}`;

      const formattedContents = payloadMessages.map((m) => {
        const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
        return {
          role,
          parts: [{ text: m.content }],
        };
      });

      const systemInstructionText = getSystemInstruction(activeDimension);
      const temperature = Math.min(1.3, Math.max(0.1, 0.4 + noveltyValue * 0.9));

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: systemInstructionText }]
          },
          generationConfig: {
            temperature,
            topP: 0.95,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API returned status ${response.status}. Please confirm your API Key is correct and active.`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Received empty response from Gemini. The Logos is silent.");
      }
      return text;
    }

    // 2. Default Server-side proxy or Free fallback logic (Level 1)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: payloadMessages,
          novelty: noveltyValue,
          dimension: activeDimension,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }
    } catch (err: any) {
      console.warn("Express server endpoint failed or is offline. Attempting client-side free fallback...", err);
    }

    // 3. Client-side Free Fallback (Hugging Face Serverless) if server is 404/Offline (typical for static Netlify deploys)
    try {
      const systemInstructionText = getSystemInstruction(activeDimension);
      const temperature = Math.min(1.3, Math.max(0.1, 0.4 + noveltyValue * 0.9));

      const hfResponse = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemInstructionText },
            ...payloadMessages
          ],
          temperature,
          max_tokens: 1200,
        })
      });

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        const text = hfData.choices?.[0]?.message?.content;
        if (text) return text;
      } else {
        const hfErrorData = await hfResponse.json().catch(() => ({}));
        throw new Error(hfErrorData.error || `Hugging Face returned status ${hfResponse.status}`);
      }
    } catch (hfErr: any) {
      console.error("Free Hugging Face fallback failed:", hfErr);
      throw new Error(`The local API server is offline (typical for static Netlify deploys), and the public free-tier fallback limit was reached. To ensure 100% reliable uptime and maximum brainpower on your webpage, please input a Google Gemini API Key in the sidebar!`);
    }
  };
  
  // UI Panels toggles
  const [isIdentityOpen, setIsIdentityOpen] = useState<boolean>(true);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Speech Synthesis and Document Download states
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechPitch, setSpeechPitch] = useState<number>(0.90);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [showGlobalDropdown, setShowGlobalDropdown] = useState<boolean>(false);
  const [activeControlTab, setActiveControlTab] = useState<"calibration" | "iching" | "aphorisms">("calibration");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Current color theme configuration depending on selected Dimension
  const currentDimensionConfig = ARCHAIC_DIMENSIONS.find(d => d.id === activeDimension) || ARCHAIC_DIMENSIONS[0];

  // Map theme background rings or neon drop shadow
  const getThemeAccentClass = () => {
    switch (activeDimension) {
      case "botanical": return "text-green-400 border-green-500 shadow-green-950/40 bg-green-950/10";
      case "alchemical": return "text-amber-400 border-amber-500 shadow-amber-950/40 bg-amber-950/10";
      case "cyberculture": return "text-cyan-400 border-cyan-500 shadow-cyan-950/40 bg-cyan-950/10";
      case "eschaton": return "text-purple-400 border-purple-500 shadow-purple-950/40 bg-purple-950/10";
      default: return "text-emerald-400 border-emerald-500 shadow-emerald-950/40 bg-emerald-950/10";
    }
  };

  const getLogosColorName = () => {
    switch (activeDimension) {
      case "botanical": return "EMERALD GAIA";
      case "alchemical": return "MERCURIAL AMBER";
      case "cyberculture": return "SILICON CYBERNETIC";
      case "eschaton": return "GRAVITATIONAL PURPLE";
      default: return "ARCHAIC NEON";
    }
  };

  // Chat Submiter
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;

    setError(null);
    const userMsgText = input.trim();
    setInput("");

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dimension: activeDimension,
      noveltyScore: noveltyValue,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      // Build pure context message payload
      const payloadMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const replyContent = await fetchChatResponse(payloadMessages);

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dimension: activeDimension,
          noveltyScore: noveltyValue,
        }
      ]);
    } catch (err: any) {
      console.error("Transmission error:", err);
      setError(err?.message || "Lost synchronization with the galactic mind. Check environmental circuits.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Clear local telemetry logs and reboot conversational relay?")) {
      setMessages([INITIAL_STEVE_MESSAGE]);
      setError(null);
    }
  };

  const handleSelectOraclePrompt = (promptText: string) => {
    setInput(promptText);
    // Auto-close mobile side drawer if open
    setIsMobilePanelOpen(false);
  };

  const handleDirectSubmit = async (customText: string) => {
    if (isGenerating || !customText.trim()) return;
    setError(null);
    setIsMobilePanelOpen(false); // Auto-close drawer

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: customText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dimension: activeDimension,
      noveltyScore: noveltyValue,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const payloadMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const replyContent = await fetchChatResponse(payloadMessages);

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dimension: activeDimension,
          noveltyScore: noveltyValue,
        }
      ]);
    } catch (err: any) {
      console.error("Transmission error:", err);
      setError(err?.message || "Lost synchronization with the galactic mind.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Toggle voice vocalization mimic for Terence McKenna
  const handleToggleSpeech = (msgId: string, textContent: string) => {
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      
      // Clean up punctuation, markdown, arrows to ensure pristine vocalizer translation
      const cleanText = textContent
        .replace(/>\s*/g, "Quote: ")
        .replace(/\n\n/g, ". ")
        .replace(/\*/g, ""); // remove bold italics accents

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = speechPitch;
      utterance.rate = speechRate;

      // Locate preferred male english voices to ground the simulation
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        v.lang.startsWith("en-") && 
        (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("natural"))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setSpeakingMessageId(null);
      };

      setSpeakingMessageId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Ensure speech synthesis is released if component hot-reloaded or destroyed
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Download transmission raw TXT with archaic dividers
  const handleDownloadMessageTxt = (msg: Message) => {
    const divider = "====================================================================\n";
    const header = divider +
                   `          ARCHAIC RECONSTRUCT.OS MODULE TRANSMISSION\n` +
                   `          SENDER: ${msg.role === "user" ? "TRAVELER OPERATOR" : "INTERPRETIVE ORATOR"}\n` +
                   `          TIMESTAMP: ${msg.timestamp}\n` +
                   `          COGNITIVE LENS: ${msg.dimension?.toUpperCase() || "DEFAULT"}\n` +
                   `          NOVELTY MATRIX VALUE: ${msg.noveltyScore?.toFixed(3) || "N/A"}\n` +
                   divider + "\n";
    const content = msg.content;
    const footer = "\n\n" + divider +
                   `UNIFIED SHA-256 ORATOR LOG // SESSION: OX-882-P\n` +
                   divider;
    
    const blob = new Blob([header + content + footer], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logos_transmission_${msg.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Themed high-fidelity PDF/HTML compiler for single messages
  const handleDownloadMessagePdf = (msg: Message) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to compile telemetry records.");
      return;
    }

    const title = `Transmission Log ${msg.id}`;
    const styledHtml = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              background-color: #0c0c0c;
              color: #00ff41;
              font-family: monospace, Courier;
              padding: 40px;
              margin: 0;
            }
            .container {
              border: 3px solid #1a1a1a;
              background-color: #050505;
              padding: 30px;
              max-width: 800px;
              margin: 0 auto;
              box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
            }
            .header {
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              font-size: 11px;
              color: #888;
              text-transform: uppercase;
              margin-bottom: 25px;
            }
            .badge {
              background-color: #00ff41;
              color: #000;
              padding: 3px 8px;
              display: inline-block;
              font-weight: bold;
              font-size: 10px;
            }
            .content {
              font-size: 15px;
              line-height: 1.6;
              color: #fff;
              font-family: Georgia, serif;
              white-space: pre-wrap;
              word-break: break-word;
            }
            blockquote {
              border-left: 3px solid #00ff41;
              margin: 20px 0;
              padding-left: 20px;
              font-style: italic;
              color: #00ff41;
              font-family: monospace;
              font-size: 13px;
            }
            .footer {
              border-top: 1px solid #1a1a1a;
              margin-top: 40px;
              padding-top: 20px;
              font-size: 9px;
              color: #444;
              text-align: center;
              text-transform: uppercase;
            }
            @media print {
              body { background: white; color: black; padding: 20px; }
              .container { border: 1px solid #888; box-shadow: none; background: white; }
              .content { color: #111; }
              blockquote { border-left-color: #333; color: #333; }
              .badge { border: 1px solid #000; background: #eee; }
              .meta { color: #444; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">SPECULATIVE LOG TRANSMISSION</span>
              <h2 style="margin: 10px 0 5px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px;">SYSTEM RECONSTRUCTION DATA</h2>
            </div>
            <div class="meta">
              <div><strong>Sender:</strong> ${msg.role === "user" ? "Traveler Operator" : "Interpretive Orator"}</div>
              <div><strong>Timestamp:</strong> ${msg.timestamp}</div>
              <div><strong>Channel Module:</strong> ${msg.dimension?.toUpperCase() || "DEFAULT"}</div>
              <div><strong>Novelty Value:</strong> ${msg.noveltyScore?.toFixed(4) || "0.6000"}</div>
            </div>
            <div class="content">
              ${msg.content.replace(/>\s*/g, "<blockquote>").split("\n\n").map(para => {
                if (para.startsWith("<blockquote>")) {
                  return `<blockquote>${para.replace("<blockquote>", "")}</blockquote>`;
                }
                return `<p>${para}</p>`;
              }).join("")}
            </div>
            <div class="footer">
              SYSTEM REF_NODE: OX-882-P // (c) 1993 Archaic Restoration Systems
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(styledHtml);
    printWindow.document.close();
  };

  // Download entire conversation history log as beautiful structured TXT file
  const handleDownloadConversationTxt = () => {
    let output = "====================================================================\n" +
                 "          ARCHAIC RECONSTRUCT.OS - ENTIRE DIALOGUE JOURNAL\n" +
                 `          TOTAL LOGGED TRANSMISSIONS: ${messages.length}\n` +
                 `          EXPORTED AT: ${new Date().toUTCString()}\n` +
                 "====================================================================\n\n";

    messages.forEach((msg, idx) => {
      const sender = msg.role === "user" ? "=== [TRAVELER OPERATOR]" : "=== [INTERPRETIVE ORATOR]";
      output += `${sender}  [${msg.timestamp}]  [NODE: ${msg.dimension?.toUpperCase() || "DEFAULT"}] [NOVELTY: ${msg.noveltyScore?.toFixed(3) || "N/A"}]\n\n`;
      output += `${msg.content}\n\n`;
      output += "--------------------------------------------------------------------\n\n";
    });

    output += "====================================================================\n" +
              "          END OF DOCUMENTATION TRANSCRIPT // SYSTEM SECURE\n" +
              "====================================================================";

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `complete_logos_journal_${new Date().toISOString().substring(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // High fidelity printable archive compiling PDF outputs
  const handleDownloadConversationPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to compile telemetry records.");
      return;
    }

    const title = `Complete Archive Journal - McKenna OS`;
    const styledHtml = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              background-color: #0c0c0c;
              color: #00ff41;
              font-family: monospace, Courier;
              padding: 40px;
              margin: 0;
            }
            .container {
              border: 3px solid #1a1a1a;
              background-color: #050505;
              padding: 30px;
              max-width: 850px;
              margin: 0 auto;
              box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
            }
            .header {
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 30px;
            }
            .badge {
              background-color: #00ff41;
              color: #000;
              padding: 3px 8px;
              display: inline-block;
              font-weight: bold;
              font-size: 10px;
              text-transform: uppercase;
            }
            .message-item {
              border-bottom: 1px dashed #333;
              padding: 20px 0;
              margin-bottom: 15px;
            }
            .message-sender {
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              text-transform: uppercase;
              color: #00ff41;
            }
            .sender-user {
              color: #888;
            }
            .content {
              font-size: 14px;
              line-height: 1.5;
              color: #fff;
              font-family: Georgia, serif;
              white-space: pre-wrap;
              word-break: break-word;
            }
            blockquote {
              border-left: 3px solid #00ff41;
              margin: 15px 0;
              padding-left: 15px;
              font-style: italic;
              color: #00ff41;
              font-family: monospace;
              font-size: 12px;
            }
            .footer {
              border-top: 1px solid #1a1a1a;
              margin-top: 40px;
              padding-top: 20px;
              font-size: 9px;
              color: #444;
              text-align: center;
              text-transform: uppercase;
            }
            @media print {
              body { background: white; color: black; padding: 20px; }
              .container { border: none; box-shadow: none; background: white; }
              .content { color: #111; }
              blockquote { border-left-color: #333; color: #333; }
              .badge { border: 1px solid #000; background: #eee; }
              .message-item { border-bottom-color: #eee; }
              .message-sender { color: #333; }
              .sender-user { color: #777; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">McKenna Reconstruct OS</span>
              <h2 style="margin: 15px 0 5px 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2.0px;">TRANS-TEMPORAL ARCHIVE JOURNAL</h2>
              <div style="font-size: 10px; opacity: 0.6;">TOTAL LOGGED TRANSMISSIONS: ${messages.length} // SYSTEM STATUS SECURE</div>
            </div>
            
            ${messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return `
                <div class="message-item">
                  <div class="message-sender ${isUser ? "sender-user" : ""}">
                    <span>&gt; ${isUser ? "TRAVELER OPERATOR" : "INTERPRETIVE ORATOR"}</span>
                    <span style="font-size: 10px; opacity: 0.7;">Time: ${msg.timestamp} // Node: ${msg.dimension?.toUpperCase() || "DEFAULT"}</span>
                  </div>
                  <div class="content" style="font-family: ${isUser ? "monospace" : "Georgia, serif"}; color: ${isUser ? "#00ff41" : "#fff"}">
                    ${msg.content.replace(/>\s*/g, "<blockquote>").split("\n\n").map(para => {
                      if (para.startsWith("<blockquote>")) {
                        return `<blockquote>${para.replace("<blockquote>", "")}</blockquote>`;
                      }
                      return para;
                    }).map(p => p.startsWith("<blockquote") ? p : `<p>${p}</p>`).join("")}
                  </div>
                </div>
              `;
            }).join("")}

            <div class="footer">
              TRANSCENDENTAL LOG COMPLETE // INTEGRITY ASSURED // (c) 1993 Archaic Restoration Systems
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(styledHtml);
    printWindow.document.close();
  };

  // Split response text into paragraph blocks for early internet rendering
  const renderFormattedText = (text: string) => {
    return text.split("\n\n").map((para, i) => {
      if (!para.trim()) return null;
      // If paragraph contains block quotation patterns or begins with >
      if (para.trim().startsWith(">")) {
        return (
          <blockquote key={i} className="border-l-2 border-[#00ff41] pl-4 py-1.5 italic my-4 text-[#00ff41]/80 font-mono text-xs">
            {para.replace(/^>\s*/, "")}
          </blockquote>
        );
      }
      return (
        <p key={i} className="leading-relaxed mb-4 text-[15px] sm:text-[17px] text-white opacity-95 font-serif">
          {para}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c0c] text-[#00ff41] font-mono select-none crt-screen overflow-hidden border-4 border-[#1a1a1a]">
      <div className="scanline" />

      {/* Retro Marquee System Ticker */}
      <div className="bg-[#1a1a1a] text-[#00ff41] text-[10px] py-1 px-4 border-b border-[#333] flex items-center justify-between font-mono select-none overflow-hidden shrink-0">
        <div className="flex items-center gap-2">
          <Radio className="h-3 w-3 text-[#00ff41] animate-pulse" />
          <span className="font-bold tracking-wider">GAIA BROADCAST LINK: NOMINAL</span>
        </div>
        <div className="hidden md:flex items-center gap-6 overflow-hidden max-w-[50%]">
          <div className="animate-[scroll-text_20s_linear_infinite] whitespace-nowrap text-[#00ff41]/80 text-[9px]">
            &gt;&gt; LOGOS TELEMETRY DEPLOYED... TIMEWAVE ESCHATON DRIFT: T-MINUS 12.4 NOVELTY WAVEFORMS... CULTURE IS THE OPERATING SYSTEM OF THE MACHINE SOUL... RECLAIM NATURE RECLAIM MIND...
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] text-[#00ff41]/70">
          <span>CPU: 42%</span>
          <span>LATENCY: 12ms</span>
          <span>FLUX: STABLE</span>
          <span>UTC: {new Date().toISOString().substring(11, 19)}</span>
        </div>
      </div>

      {/* Main App Bar Header */}
      <header className="bg-[#0c0c0c] border-[#1a1a1a] border-b-2 px-4 py-2.5 shrink-0 flex items-center justify-between relative shadow-lg">
        <div className="flex items-center gap-3">
          {/* Alchemical Glyph/Icon */}
          <div className="h-9 w-9 border border-[#00ff41] bg-black rounded-none flex items-center justify-center select-none cursor-pointer hover:rotate-12 transition-transform">
            <span className="text-xl leading-none text-[#00ff41] text-glow font-bold">🝔</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-md font-bold uppercase tracking-widest text-[#00ff41] flex items-center gap-1.5 font-mono text-glow">
                MCKENNA_RECONSTRUCT.OS
              </h1>
              <span className="text-[9px] bg-[#00ff41] text-black px-1.5 font-bold uppercase tracking-wider">
                v3.33
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-mono leading-none mt-1 uppercase">
              SPECULATIVE HYPERDIMENSIONAL ORATOR PROTOCOL :: RE-HARVESTING THE ARCHAIC LOGOS
            </p>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIdentityOpen(true)}
            className="p-1.5 text-xs text-slate-400 hover:text-[#00ff41] hover:bg-[#1a1a1a] border border-[#1a1a1a] rounded-none flex items-center gap-1 transition-all"
            title="Read Identity & Alignment Statement"
            id="read-alignment-header-btn"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline text-[10px] font-bold">ALIGNMENT</span>
          </button>

          {/* Global download option dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowGlobalDropdown(!showGlobalDropdown)}
              className={`p-1.5 text-xs text-slate-400 hover:text-[#00ff41] hover:bg-[#1a1a1a] border rounded-none flex items-center gap-1 transition-all select-none cursor-pointer ${
                showGlobalDropdown ? "border-[#00ff41] text-[#00ff41] bg-[#1a1a1a]" : "border-[#1a1a1a]"
              }`}
              title="Download Entire Dialogue Session Log"
              id="save-conversation-header-btn"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline text-[10px] font-bold">SAVE JOURNAL</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
            
            {showGlobalDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowGlobalDropdown(false)} 
                />
                <div 
                  className="absolute right-0 mt-1.5 w-44 bg-[#0c0c0c] border-2 border-[#1a1a1a] p-1 shadow-2xl z-50 font-mono text-[10px] uppercase text-[#00ff41] rounded-none divide-y divide-[#1a1a1a]"
                  id="global-dropdown-menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadConversationTxt();
                      setShowGlobalDropdown(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-[#00ff41] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer border-none"
                  >
                    <FileText className="h-3.5 w-3.5 text-inherit hover:text-inherit" />
                    <span>Save Log as .TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadConversationPdf();
                      setShowGlobalDropdown(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-[#00ff41] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer border-t border-[#1a1a1a]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-inherit hover:text-inherit" />
                    <span>Compile Log as .PDF</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-[#1a1a1a] border border-[#1a1a1a] rounded-none flex items-center gap-1 transition-all"
            title="Clear memory relay log"
            id="clear-logs-header-btn"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline text-[10px] font-bold">REBOOT</span>
          </button>

          {/* Mobile responsive sidebar trigger */}
          <button
            onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-[#00ff41] border border-[#1a1a1a] rounded bg-black"
            id="hamburger-sidebar-trigger"
          >
            {isMobilePanelOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative" id="portal-operator-workspace">
        
        {/* Left Side: Telemetry Control Panel (desktop persistent, mobile drawer) */}
        <aside 
          className={`absolute md:relative inset-y-0 left-0 z-20 w-80 bg-[#080808] border-r-2 border-[#1a1a1a] p-4 flex flex-col gap-4 overflow-y-auto shrink-0 transition-transform duration-300 ${
            isMobilePanelOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
          id="control-sidebar"
        >
          {/* Character Photo Bezel */}
          <div className="bg-[#0c0c0c] border-2 border-[#1a1a1a] p-3 rounded-none" id="avatar-portrait-frame">
            <div className="relative aspect-video bg-[#050505] border border-[#1a1a1a] rounded-none overflow-hidden flex flex-col justify-end p-2 select-none group">
              
              {/* Retro Static Grid Artifacts */}
              <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              
              {/* ASCII Terence McKenna Graphic */}
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[8.5px] text-[#00ff41]/25 leading-[4.5px] select-none text-center pt-2">
                {" ._.,===,._.\n  | /     \\ |\n  (; ' - ' ;)\n   (( (o) ))\n  _.'_\"\"\"_'._\n |  _\\_/_  |\n  '-=-=-=-'"}
              </div>

              {/* Status Relay Telemetry */}
              <div className="relative z-10 flex flex-col gap-0.5">
                <span className="text-[10px] text-[#00ff41] font-bold font-mono tracking-widest uppercase text-glow">
                  ACTIVE_RELAY: TM_ORATOR
                </span>
                <span className="text-[8.5px] text-slate-500 font-mono">
                  MATRIX: {getLogosColorName()}
                </span>
              </div>

              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black border border-[#1a1a1a] px-1.5 py-0.5 rounded-none text-[8px] font-bold">
                <span className="h-1.5 w-1.5 bg-[#00ff41] rounded-full animate-ping" />
                <span className="text-[#00ff41] font-mono uppercase">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Terence Level-Up Engine / API Key Manager */}
          <div className="border-2 border-[#00ff41]/30 bg-[#0c0c0c] p-3 uppercase text-[10px] space-y-2 relative" id="level-up-engine-container">
            <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
              <span className="font-bold text-[#00ff41] text-glow flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
                Cognitive Level-Up
              </span>
              <span className={`px-1 text-[8px] font-bold ${modelTier === "free" ? "bg-slate-800 text-slate-300 animate-none" : "bg-[#00ff41] text-black animate-pulse"}`}>
                {modelTier === "free" ? "LVL 1 (BASIC)" : modelTier === "flash" ? "LVL 2 (SMART)" : "LVL 3 (ULTRA PRO)"}
              </span>
            </div>

            <div className="space-y-1.5 normal-case font-sans text-[11px] text-slate-300">
              <p className="text-[10px] leading-snug">
                {modelTier === "free" ? (
                  <>Currently running on <strong>Level 1 (Free Fallback)</strong>. Standard response depth.</>
                ) : modelTier === "flash" ? (
                  <><strong>Level 2 Tryptamine Logic</strong> active! Powered by Gemini Flash via your custom key.</>
                ) : (
                  <><strong>Level 3 Trans-Temporal Logos</strong> active! Powered by Gemini Pro via your custom key.</>
                )}
              </p>

              {/* Selector */}
              <div className="grid grid-cols-3 gap-1 font-mono text-[9px] uppercase pt-1">
                <button
                  type="button"
                  onClick={() => handleSetModelTier("free")}
                  className={`py-1 text-center font-bold border transition-all cursor-pointer ${
                    modelTier === "free"
                      ? "bg-slate-800 text-slate-100 border-slate-500"
                      : "bg-black text-slate-500 border-[#1a1a1a] hover:text-slate-300"
                  }`}
                >
                  L1 (FREE)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetModelTier("flash")}
                  className={`py-1 text-center font-bold border transition-all cursor-pointer ${
                    modelTier === "flash"
                      ? "bg-[#00ff41] text-black border-[#00ff41] font-bold"
                      : "bg-black text-[#00ff41]/50 border-[#1a1a1a] hover:text-[#00ff41]"
                  }`}
                >
                  L2 (FLASH)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetModelTier("pro")}
                  className={`py-1 text-center font-bold border transition-all cursor-pointer ${
                    modelTier === "pro"
                      ? "bg-purple-600 text-white border-purple-500 font-bold"
                      : "bg-black text-purple-400/50 border-[#1a1a1a] hover:text-purple-400"
                  }`}
                >
                  L3 (PRO)
                </button>
              </div>

              {modelTier !== "free" && (
                <div className="space-y-1 pt-1 font-mono text-[9px] uppercase">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Gemini API Key:</span>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[8px] text-[#00ff41] underline cursor-pointer"
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={userApiKey}
                    onChange={(e) => handleSetApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black border border-[#1a1a1a] text-[#00ff41] text-[10px] px-2 py-1 focus:outline-none focus:border-[#00ff41]"
                  />
                  {!userApiKey && (
                    <p className="text-[8px] text-amber-500 font-sans normal-case italic leading-tight">
                      * Key required for Level 2 & 3. Get a free Gemini key at Google AI Studio.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Bio-Telemetry Indicators (Derived dynamically from noveltyValue state) */}
          <div className="border border-[#1a1a1a] bg-[#0c0c0c] p-2.5 uppercase text-[10px] space-y-2">
            <p className="opacity-40 border-b border-[#1a1a1a] pb-0.5 font-bold">Bio-Telemetry STATUS</p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Tryptamine Sync:</span>
                <span className="text-[#00ff41] font-bold">{(noveltyValue * 15).toFixed(2)}mg</span>
              </div>
              <div className="w-full h-1 bg-[#050505]">
                <div 
                  className="h-full bg-[#00ff41] transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, noveltyValue * 100))}%` }}
                />
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Imagination Index:</span>
                <span className="text-[#00ff41] font-bold">{(80 + noveltyValue * 20).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1 bg-[#050505]">
                <div 
                  className="h-full bg-[#00ff41] shadow-[0_0_5px_#00ff41] transition-all duration-300"
                  style={{ width: `${80 + noveltyValue * 20}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tab Selection Row Header */}
          <div className="grid grid-cols-3 border border-[#1a1a1a] bg-black p-0.5 select-none font-mono text-[9px] shrink-0" id="sidebar-tabs-row">
            <button
              type="button"
              onClick={() => setActiveControlTab("calibration")}
              className={`py-1.5 text-center font-bold cursor-pointer transition-all ${
                activeControlTab === "calibration"
                  ? "bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]/50"
                  : "text-slate-500 hover:text-slate-300 hover:bg-[#0c0c0c]"
              }`}
              id="tab-btn-calibration"
            >
              CALIB
            </button>
            <button
              type="button"
              onClick={() => setActiveControlTab("iching")}
              className={`py-1.5 text-center font-bold cursor-pointer transition-all ${
                activeControlTab === "iching"
                  ? "bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]/50"
                  : "text-slate-500 hover:text-slate-300 hover:bg-[#0c0c0c]"
              }`}
              id="tab-btn-iching"
            >
              I CHING
            </button>
            <button
              type="button"
              onClick={() => setActiveControlTab("aphorisms")}
              className={`py-1.5 text-center font-bold cursor-pointer transition-all ${
                activeControlTab === "aphorisms"
                  ? "bg-[#00ff41] text-black shadow-[0_0_8px_#00ff41]/50"
                  : "text-slate-500 hover:text-slate-300 hover:bg-[#0c0c0c]"
              }`}
              id="tab-btn-aphorisms"
            >
              LOGOS
            </button>
          </div>

          {/* Dynamic Tab Body Frame Container */}
          <div className="flex-1 space-y-4">
            {activeControlTab === "calibration" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Shamanic Vocal Engine Settings */}
                <div className="border border-[#1a1a1a] bg-[#0c0c0c] p-2.5 uppercase text-[10px] space-y-2">
                  <div className="flex items-center gap-1.5 opacity-40 border-b border-[#1a1a1a] pb-0.5 font-bold">
                    <Sliders className="h-3 w-3" />
                    <span>Voice Cadence Engine</span>
                  </div>
                  <div className="space-y-2 pt-0.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-400">Vocal Pitch:</span>
                        <span className="text-[#00ff41] font-bold">{speechPitch.toFixed(2)}x</span>
                      </div>
                      <input 
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={speechPitch}
                        onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                        className="w-full accent-[#00ff41] bg-black h-1 rounded cursor-pointer"
                        style={{ outline: "none" }}
                        id="vocal-pitch-slider"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-400">Oration Rate:</span>
                        <span className="text-[#00ff41] font-bold">{speechRate.toFixed(2)}x</span>
                      </div>
                      <input 
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full accent-[#00ff41] bg-black h-1 rounded cursor-pointer"
                        style={{ outline: "none" }}
                        id="oration-rate-slider"
                      />
                    </div>
                    <div className="text-[8px] text-slate-500 normal-case italic font-sans leading-tight">
                      * Calibrate to ~0.90 Pitch & ~0.85 Rate to align with Terence McKenna's extemporaneous nasal timbre.
                    </div>
                  </div>
                </div>

                {/* Visible Language Waveform */}
                <VisibleLanguageVisualizer 
                  isGenerating={isGenerating} 
                  activeColor={currentDimensionConfig.borderColor} 
                />

                {/* Control slider deck */}
                <DimensionTuner
                  activeDimension={activeDimension}
                  onDimensionChange={setActiveDimension}
                  noveltyValue={noveltyValue}
                  onNoveltyChange={setNoveltyValue}
                  onSelectPrompt={handleSelectOraclePrompt}
                />
              </div>
            )}

            {activeControlTab === "iching" && (
              <div className="animate-fadeIn">
                <IChingOracle onConsult={handleDirectSubmit} />
              </div>
            )}

            {activeControlTab === "aphorisms" && (
              <div className="animate-fadeIn">
                <AphorismDeck 
                  onSeed={handleSelectOraclePrompt} 
                  onTransmit={handleDirectSubmit}
                  speechPitch={speechPitch}
                  speechRate={speechRate}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop overlay for mobile drawer */}
        {isMobilePanelOpen && (
          <div 
            onClick={() => setIsMobilePanelOpen(false)}
            className="absolute inset-0 z-10 bg-black/60 md:hidden pointer-events-auto"
            id="mobile-overlay-backdrop"
          />
        )}

        {/* Center/Right: Conversational Log Frame */}
        <main className="flex-1 flex flex-col bg-[#050505] overflow-hidden" id="chat-stream-main">
          
          {/* Messages Scrolling Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin overflow-x-hidden" id="message-scroller">
            
            {/* Speculative Identity Warning Banner */}
            <div className="bg-[#0c0c0c] border-2 border-dashed border-[#00ff41]/20 p-4 rounded-none text-xs select-none max-w-3xl mx-auto" id="operational-guidance-banner">
              <div className="flex gap-3 items-start">
                <Terminal className="h-5 w-5 text-[#00ff41] shrink-0 mt-0.5 text-glow" />
                <div className="space-y-1">
                  <div className="font-bold text-[#00ff41] uppercase tracking-wide text-glow">
                    Operative Persona Initialized
                  </div>
                  <p className="text-slate-400 leading-normal font-sans text-[11px]">
                    Dialogue circuits are currently synchronized with a speculative reconstruction based on the public oratory and worldview of Terence McKenna. This node is an <strong>AI interpretation</strong>, dedicated to creative philosophy and ethnobotanical exploration.
                  </p>
                  <button 
                    onClick={() => setIsIdentityOpen(true)}
                    className="text-[#00ff41] hover:text-[#00ff41]/80 underline text-[10px] font-mono font-bold block pt-1"
                    id="banner-alignment-link"
                  >
                    View alignment protocol details &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Level-up Suggestion Banner (Only shown in Free/Level 1 mode) */}
            {modelTier === "free" && (
              <div className="bg-[#0f0418]/50 border-2 border-[#a855f7]/30 p-3.5 rounded-none text-xs select-none max-w-3xl mx-auto animate-pulse" style={{ animationDuration: '4s' }} id="level-up-teaser-banner">
                <div className="flex gap-3 items-start">
                  <Sparkles className="h-5 w-5 text-purple-400 shrink-0 mt-0.5 text-glow-purple" />
                  <div className="space-y-1">
                    <div className="font-bold text-purple-400 uppercase tracking-wide text-glow-purple flex items-center gap-2">
                      Level Up Terence's Mind
                      <span className="text-[8.5px] bg-purple-600 text-white px-1 font-bold">LVL 1 ACTIVE</span>
                    </div>
                    <p className="text-slate-300 leading-normal font-sans text-[11px]">
                      You are currently using the default free tier. To unlock Terence's maximum nasal flow, rich vocabulary, and complex philosophical associations, choose <strong>Level 2 (Flash)</strong> or <strong>Level 3 (Pro)</strong> in the left sidebar and provide your own Google Gemini API Key. It runs completely serverless and client-side!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rendered Conversation list */}
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const accentBorder = isUser ? "border-[#1a1a1a] bg-[#0c0c0c]" : "border-[#1a1a1a] bg-[#080808]/60";
              const roleTitle = isUser ? "Traveler Operator" : "Interpretive Orator";

              return (
                <div 
                  key={msg.id} 
                  className={`w-full max-w-3xl mx-auto flex flex-col space-y-1 ${isUser ? "items-end" : "items-start"}`}
                  id={`chat-message-item-${msg.id}`}
                >
                  {/* Header metadata row */}
                  <div className="flex items-center gap-2 px-1 text-[9px] text-[#00ff41]/40 font-mono">
                    <span className={`font-semibold uppercase tracking-wider ${isUser ? "text-slate-400" : "text-[#00ff41]"}`}>
                      {roleTitle}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.dimension && (
                      <>
                        <span>•</span>
                        <span className="text-[#00ff41] uppercase font-bold bg-[#00ff41]/10 px-1 border border-[#00ff41]/30 rounded-none">
                          {msg.dimension}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble Bezel */}
                  <div className={`relative px-4 pt-3.5 pb-3 border rounded-none ${accentBorder} w-full transition-shadow hover:shadow-md group`}>
                    
                    {/* Tiny visual identity tags inside bubble */}
                    {!isUser && (
                      <div className="absolute top-2.5 right-3 text-[16px] text-[#00ff41]/20 select-none font-serif leading-none">
                        🜍
                      </div>
                    )}

                    {/* Content text */}
                    <div className="break-words mb-3">
                      {isUser ? (
                        <p className="font-mono text-[13px] leading-relaxed text-[#00ff41]">
                          &gt; {msg.content}
                        </p>
                      ) : (
                        renderFormattedText(msg.content)
                      )}
                    </div>

                    {/* Dedicated Metadata & Interactive Control Action Row */}
                    <div className="mt-3 pt-2.5 border-t border-[#1a1a1a]/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                      <div className="text-[#00ff41]/55 text-[9px] uppercase tracking-wide flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00ff41]/50 animate-pulse" />
                        <span>TRANS_ID: {msg.id.substring(0, 8)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Speech synthesis vocalizer button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeech(msg.id, msg.content)}
                          className={`px-3 py-1.5 border rounded-none select-none transition-all flex items-center gap-1.5 text-[10px] font-mono font-bold cursor-pointer ${
                            speakingMessageId === msg.id 
                              ? "bg-[#00ff41]/25 text-[#00ff41] border-[#00ff41] animate-pulse shadow-[0_0_8px_#00ff41]" 
                              : "text-[#00ff41] hover:text-black bg-[#0c0c0c]/80 border-[#00ff41]/45 hover:bg-[#00ff41]/90 hover:border-[#00ff41] hover:shadow-[0_0_8px_#00ff41]/40"
                          }`}
                          title={speakingMessageId === msg.id ? "Stop Vocalizer / Speech Output" : "Speak Oration System Sync"}
                          id={`speak-msg-btn-${msg.id}`}
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5 text-[#00ff41] animate-pulse" />
                              <span>STOP SPEAKING</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5 text-[#00ff41]" />
                              <span>HEAR REPLY (SPEECH)</span>
                            </>
                          )}
                        </button>

                        {/* Dropdown save container for items */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveDropdownId(activeDropdownId === msg.id ? null : msg.id)}
                            className={`px-3 py-1.5 text-[#00ff41]/85 hover:text-[#00ff41] bg-[#0c0c0c]/85 border select-none transition-all flex items-center gap-1 text-[10px] font-mono font-bold cursor-pointer ${
                              activeDropdownId === msg.id ? "border-[#00ff41] text-[#00ff41]" : "border-[#1a1a1a]"
                            }`}
                            title="Save or Export Transmission Options"
                            id={`download-msg-dropdown-${msg.id}`}
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            <span>SAVE / COPY</span>
                            <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                          </button>
                          
                          {activeDropdownId === msg.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setActiveDropdownId(null)} 
                              />
                              <div 
                                className="absolute right-0 bottom-full mb-1.5 w-44 bg-[#0c0c0c] border-2 border-[#1a1a1a] p-1 shadow-2xl z-50 font-mono text-[10px] uppercase text-[#00ff41] rounded-none divide-y divide-[#1a1a1a]"
                                id={`msg-dropdown-menu-${msg.id}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCopyToClipboard(msg.content, msg.id);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full text-left px-2 py-2 hover:bg-[#00ff41] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer border-none"
                                >
                                  {copiedIndex === msg.id ? (
                                    <Check className="h-3.5 w-3.5 text-inherit" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 text-inherit" />
                                  )}
                                  <span>{copiedIndex === msg.id ? "Copied!" : "Copy Clipboard"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDownloadMessageTxt(msg);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full text-left px-2 py-2 hover:bg-[#00ff41] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer border-t border-[#1a1a1a]"
                                >
                                  <FileText className="h-3.5 w-3.5 text-inherit" />
                                  <span>Save as .TXT</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDownloadMessagePdf(msg);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full text-left px-2 py-2 hover:bg-[#00ff41] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer border-t border-[#1a1a1a]"
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-inherit" />
                                  <span>Compile as .PDF</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Chat Relay Loading state */}
            {isGenerating && (
              <div className="w-full max-w-3xl mx-auto flex flex-col space-y-1 items-start" id="chat-relay-loading">
                <div className="flex items-center gap-2 px-1 text-[9px] text-slate-500 font-mono">
                  <span className="font-semibold uppercase tracking-wider text-[#00ff41]">
                    Interpretive Orator
                  </span>
                  <span>•</span>
                  <span className="animate-pulse text-[#00ff41]">STREAMING...</span>
                </div>
                <div className="px-4 py-4 border border-[#1a1a1a] bg-[#0c0c0c] rounded-none w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-[#00ff41] animate-spin" />
                    <span className="text-xs text-[#00ff41]/80 font-mono animate-pulse">
                      Synthesized neural circuits tracking novelty attractors...
                    </span>
                  </div>
                  <span className="text-[10px] text-[#00ff41]/60 blink font-mono text-glow">🜍 RECONSTRUCTING 🜍</span>
                </div>
              </div>
            )}

            {/* API Error state fallback */}
            {error && (
              <div className="w-full max-w-3xl mx-auto p-4 bg-red-950/10 border-2 border-red-900/60 rounded flex gap-3 text-xs" id="chat-err-display">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <div className="font-bold text-red-400 uppercase tracking-widest font-mono">
                    LOGOS COMM LINK COLLAPSED
                  </div>
                  <p className="text-slate-400 font-sans leading-relaxed">
                    {error}
                  </p>
                  <p className="text-[10px] text-slate-500 pt-1 italic font-mono">
                    Suggestion: Expand the "Secrets" panel in Google AI Studio and confirm that "GEMINI_API_KEY" has a valid key assigned.
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form Console */}
          <div className="p-4 border-t-2 border-[#1a1a1a] bg-[#0c0c0c] shrink-0" id="chat-control-dock">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto" id="input-sender-form">
              <div className="relative flex items-center bg-[#050505] border-2 border-[#1a1a1a] focus-within:border-[#00ff41] transition-colors shadow-inner rounded-none p-1">
                <div className="text-[#00ff41] font-bold text-lg select-none ml-2 mr-1 animate-pulse">&gt;</div>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pose a philosophical inquiry to the archaic relay..."
                  disabled={isGenerating}
                  className="flex-1 min-w-0 bg-transparent text-[#00ff41] placeholder:text-[#00ff41]/30 py-2.5 px-3 focus:outline-none font-mono text-xs md:text-sm"
                  id="chat-text-input"
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={isGenerating || !input.trim()}
                  className={`px-5 py-2 text-xs font-mono font-bold uppercase rounded-none border-2 select-none flex items-center gap-1.5 transition-all outline-none shrink-0 ${
                    !input.trim() || isGenerating
                      ? "bg-black text-[#00ff41]/20 border-[#1a1a1a] cursor-not-allowed"
                      : "bg-[#0c0c0c] text-[#00ff41] border-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_10px_#00ff41] cursor-pointer"
                  }`}
                  id="submit-send-btn"
                >
                  <span>EXECUTE</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-[9px] text-slate-500 mt-1.5 flex justify-between items-center select-none font-mono px-1">
                <span>PRESS [ENTER] TO DISCHARGE TRANSMISSION</span>
                <span>OPERATING MODULE: <span className="text-[#00ff41] uppercase tracking-wider font-bold">{activeDimension}</span></span>
              </div>
            </form>
          </div>
        </main>

      </div>

      {/* Alignment / Transparent Identity Warning Dialog popup */}
      <IdentityModal 
        isOpen={isIdentityOpen} 
        onClose={() => setIsIdentityOpen(false)} 
      />
    </div>
  );
}
