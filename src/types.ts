export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  dimension?: string;
  noveltyScore?: number;
}

export type ArchaicDimension = "default" | "botanical" | "alchemical" | "cyberculture" | "eschaton";

export interface DimensionMetadata {
  id: ArchaicDimension;
  name: string;
  tagline: string;
  description: string;
  color: string;
  borderColor: string;
  glowColor: string;
  icon: string;
}

export const ARCHAIC_DIMENSIONS: DimensionMetadata[] = [
  {
    id: "default",
    name: "General Logos",
    tagline: "The synthesis of mind, language, and nature.",
    description: "Maintains a balanced dialogue between historical novelty, ethnobotany, media theory, and alchemical symbolism. The classic McKenna posture.",
    color: "from-emerald-900 to-teal-950",
    borderColor: "border-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.3)",
    icon: "Flower2",
  },
  {
    id: "botanical",
    name: "Botanical Sovereignty",
    tagline: "Direct communication with the living planet.",
    description: "Prioritizes ethno-mycology, the intelligence of plant teachers, symbiotic relationships, and Gaia's autonomous voice.",
    color: "from-green-950 to-emerald-950",
    borderColor: "border-green-500",
    glowColor: "rgba(34, 197, 94, 0.3)",
    icon: "Sprout",
  },
  {
    id: "alchemical",
    name: "Hermetic Laboratory",
    tagline: "The metallurgy of active consciousness.",
    description: "Transforms standard conceptual paradigms into esoteric revelations. Focuses on metallurgical linguistics, visible language, and historical alchemy.",
    color: "from-amber-950 to-red-950",
    borderColor: "border-amber-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    icon: "Wine",
  },
  {
    id: "cyberculture",
    name: "Electro-Hive Net",
    tagline: "Virtual reality as the outer bounds of mind.",
    description: "Investigates cyberculture, AI, media arrays, simulation theory, and the potential of technology to externalize human linguistic capacity.",
    color: "from-cyan-950 to-blue-950",
    borderColor: "border-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.3)",
    icon: "Network",
  },
  {
    id: "eschaton",
    name: "Novelty Acceleration",
    tagline: "The attractor state at the boundary of history.",
    description: "Examines the acceleration toward the eschaton, the transcendental object at the conclusion of local time, and the self-limiting wave of historical velocity.",
    color: "from-purple-950 to-fuchsia-950",
    borderColor: "border-purple-500",
    glowColor: "rgba(168, 85, 247, 0.3)",
    icon: "Zap",
  },
];

export interface OracleTrigger {
  title: string;
  promptText: string;
  category: string;
}

export const ORACLE_TRIGGERS: OracleTrigger[] = [
  {
    title: "Nature's Communication",
    promptText: "How can we tune our perceptual mechanisms to decode the autonomous, intelligent broadcasts of nature?",
    category: "Gaia",
  },
  {
    title: "The Crisis of Culture",
    promptText: "To what extent is culture merely a primitive Operating System that disables our intuitive contact with mystery?",
    category: "Linguistics",
  },
  {
    title: "The Transcendental Object",
    promptText: "Explain the nature of the transcendental object at the end of time. How does it exert a gravitational pull on history?",
    category: "Metaphysics",
  },
  {
    title: "Visible Language & Glossolalia",
    promptText: "Tell me about the phenomenon of visible language—where sound becomes symbol and syntax is directly experienced through vision.",
    category: "Language",
  },
  {
    title: "The Botanical Teacher",
    promptText: "Speak on the symbiotic relationship between humanity and psilocybin. Why is this dialogue necessary for the archaic revival?",
    category: "Gaia",
  },
  {
    title: "Cybernetics & Shamanism",
    promptText: "How can virtual reality and computing networks become genuine instruments of planetary shamanism and linguistic freedom?",
    category: "Cyberculture",
  },
];

export interface IChingHexagram {
  number: number;
  name: string;
  chineseName: string;
  translation: string;
  lines: number[]; // e.g. [1,1,1,1,1,1] bottom-to-top (1 = yang / solid, 0 = yin / broken)
  judgment: string;
  mckennaNotes: string;
}

export interface Aphorism {
  id: string;
  text: string;
  category: "Psychedelics" | "Culture" | "Language" | "The Esoteric" | "Felt Experience";
  source?: string;
}

export const APHORISM_DECK: Aphorism[] = [
  {
    id: "aph-1",
    text: "The world is made of language. But we must become aware of this in order to claim it.",
    category: "Language",
    source: "Visible Language Workshop, 1989"
  },
  {
    id: "aph-2",
    text: "Culture is not your friend. It is a primitive Operating System that disables our intuitive contact with mystery.",
    category: "Culture",
    source: "The In & Out of This World, 1994"
  },
  {
    id: "aph-3",
    text: "Nature is not mute; it is man who is deaf. The planet is screaming with life-force and communicative intelligence.",
    category: "Felt Experience",
    source: "Non-Human Liaisons, 1991"
  },
  {
    id: "aph-4",
    text: "The cost of sanity in this society is a certain level of alienation. You represent the sanity of the tribe.",
    category: "Culture",
    source: "Approaching the Eschaton, 1998"
  },
  {
    id: "aph-5",
    text: "If the words 'life, liberty, and the pursuit of happiness' don't include the right to experiment with your own consciousness, then the Declaration of Independence isn't worth the hemp it was written on.",
    category: "Psychedelics",
    source: "Federalist Rants, 1992"
  },
  {
    id: "aph-6",
    text: "The problem is not to find the answer, but to face the answer. It is staring us directly in the eyes.",
    category: "The Esoteric",
    source: "Hermetic Laboratory Lecture, 1990"
  },
  {
    id: "aph-7",
    text: "We are playing with half a deck as long as we tolerate that the state owns our minds and controls our consciousness.",
    category: "Culture",
    source: "Selected Speeches, 1995"
  },
  {
    id: "aph-8",
    text: "The apocalypse is not something which is coming. The apocalypse has arrived in major portions of the planet and it's only we who are waiting for our fall.",
    category: "The Esoteric",
    source: "Final Illuminations, 1999"
  },
  {
    id: "aph-9",
    text: "You are a divine being. You matter, you count. You come from fields of infinite creative energy. Do not let the dominators tell you otherwise.",
    category: "Felt Experience",
    source: "Opening the Portal, 1996"
  },
  {
    id: "aph-10",
    text: "We have been to the moon, we have charted the depths of the ocean, but we remain terrified of the interior geography of our own souls.",
    category: "The Esoteric",
    source: "The Psychedelic Society Lecture, 1984"
  }
];

export const ICHING_HEXAGRAMS: IChingHexagram[] = [
  {
    number: 1,
    name: "Ch'ien",
    chineseName: "乾",
    translation: "The Creative / Heavens",
    lines: [1, 1, 1, 1, 1, 1],
    judgment: "Supreme success, perseverance brings reward. Great strength and infinite potential energy.",
    mckennaNotes: "This is the pure yang drive, the primordial thrust toward raw manifestation, creation, and linguistic externalization. It represents maximum potential at the base of the Timewave."
  },
  {
    number: 2,
    name: "K'un",
    chineseName: "坤",
    translation: "The Receptive / Earth",
    lines: [0, 0, 0, 0, 0, 0],
    judgment: "Sublime success. Persisting like a mare brings reward. Yielding and nurturing rather than dominating.",
    mckennaNotes: "The ultimate cosmic container, the vegetative planetary womb, Gaia in her passive, receiving state. Contrast this with the hyper-masculine dominator hierarchies of the 20th century."
  },
  {
    number: 29,
    name: "K'an",
    chineseName: "坎",
    translation: "The Abysmal / Water",
    lines: [0, 1, 0, 0, 1, 0],
    judgment: "The Abysmal repeated. If you are sincere, you have success in your heart. Action brings honor.",
    mckennaNotes: "A series of rapids and deep gorges. Represents psychological plunges into high-intensity visionary trials. The abyss must be navigated with inner sincerity and courage."
  },
  {
    number: 30,
    name: "Li",
    chineseName: "離",
    translation: "The Clinging / Fire",
    lines: [1, 0, 1, 1, 0, 1],
    judgment: "Perseverance brings success. Care of the cow brings good fortune. Bright consciousness clinging to life.",
    mckennaNotes: "The heat of consciousness, chemical transformation, and bright visible language. Like fire, consciousness has no local shape of its own; it clings to its organic fuel, the somatic body."
  },
  {
    number: 49,
    name: "Ko",
    chineseName: "革",
    translation: "Revolution / Molting",
    lines: [1, 0, 1, 1, 1, 0],
    judgment: "On your own day you are believed. Supreme success, trial brings reward. Regret vanishes.",
    mckennaNotes: "The shedding of skins—cultural, psychological, and historical. It is the direct deconditioning from the prevailing operating system to reveal the native core of the archaic revival."
  },
  {
    number: 51,
    name: "Chen",
    chineseName: "震",
    translation: "The Arousing / Thunder",
    lines: [1, 0, 0, 1, 0, 0],
    judgment: "Shock brings success. Thunder comes with a terrifying boom, yet the practitioner does not drop the sacrificial ladle.",
    mckennaNotes: "The sudden rupturing of ordinary reality by the bizarre, high-novelty alien presence. It is the shock of the extraterrestrial/tryptamine contact that forces a cognitive leap."
  },
  {
    number: 63,
    name: "Chi Chi",
    chineseName: "既濟",
    translation: "After Completion",
    lines: [1, 0, 1, 0, 1, 0],
    judgment: "Success in small matters. Perseverance is rewarding. At the start, good fortune; in the end, disorder.",
    mckennaNotes: "A state of perfect equilibrium where all lines are in their proper stations. Yet, equilibrium is a temporary arrest in a dynamic, swirling cosmos. Decay and chaos are already breeding at the margins."
  },
  {
    number: 64,
    name: "Wei Chi",
    chineseName: "未濟",
    translation: "Before Completion",
    lines: [0, 1, 0, 1, 0, 1],
    judgment: "Success. But if the little fox gets its tail wet when nearly across, there is no advantage.",
    mckennaNotes: "The eternal threshold. We stand forever on the brink of absolute trans-temporal transition. History is an uncompleted crossing, a suspense maintained until the final descent at the eschaton."
  }
];

