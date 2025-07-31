'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Tag = { word: string; tag: string; phonetic: string };
type Message = {
  sentence: string;
  tense: string;
  tags: Tag[];
};

const POS_EXPLANATIONS: Record<string, string> = {
  PRP: 'Pronoun: replaces a noun (e.g., she, he, they).',
  VBZ: 'Verb, 3rd person singular present (e.g., has, does).',
  VBN: 'Verb, past participle (e.g., been, eaten).',
  VBG: 'Present participle or gerund verb (e.g., reading, going).',
  DT: 'Determiner: introduces a noun (e.g., a, the, some).',
  NN: 'Noun: person, place, thing (e.g., book, idea, apple).',
  IN: 'Preposition: shows relationship (e.g., since, on, at).',
};

const TENSE_EXPLANATIONS: Record<
  string,
  { formula: string; usage: string; example: string }
> = {
  'Present Perfect Continuous': {
    formula: 'Subject + has/have + been + verb-ing',
    usage: 'Used to describe actions that began in the past and are still continuing now.',
    example: 'She has been studying since morning.',
  },
};

const DEFAULT_MESSAGES: Message[] = [
  {
    sentence: 'She has been reading a book since morning.',
    tense: 'Present Perfect Continuous',
    tags: [
      { word: 'She', tag: 'PRP', phonetic: 'ʃiː' },
      { word: 'has', tag: 'VBZ', phonetic: 'hæz' },
      { word: 'been', tag: 'VBN', phonetic: 'bɪn' },
      { word: 'reading', tag: 'VBG', phonetic: 'ˈriːdɪŋ' },
      { word: 'a', tag: 'DT', phonetic: 'ə' },
      { word: 'book', tag: 'NN', phonetic: 'bʊk' },
      { word: 'since', tag: 'IN', phonetic: 'sɪns' },
      { word: 'morning', tag: 'NN', phonetic: 'ˈmɔːrnɪŋ' },
    ],
  },
];

const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <div className={`bg-neutral-200 animate-pulse rounded ${className}`} />
);

// Framer Motion variants for headline words
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      ease: 'easeOut',
    },
  }),
};

function AnimatedHeadline() {
  const headline = 'TenseFlow - Break Down Grammar. Build Up Skill.';
  const words = headline.split(' ');
  return (
    <motion.h1 className="mb-6">
      <div className="inline-block bg-gradient-to-r from-black via-pink-500 to-violet-800 text-transparent bg-clip-text font-bold text-4xl leading-tight">
        <div className="flex flex-wrap gap-1">
          {words.map((w, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="inline-block"
            >
              {w}
              {i !== words.length - 1 && '\u00A0'}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.h1>
  );
}

export default function Prototype() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [input, setInput] = useState<string>('She has been reading a book since morning.');
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 2000);
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
    requestAnimationFrame(() => {
      firstRender.current = false;
    });
    return () => clearTimeout(t);
  }, []);

  const effectiveLoading = initialLoading || fetching;

  const scrollToTag = (tag: string) => {
    const el = sectionRefs.current[tag];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSelectedTag(tag);
  };

  const maybeAos = (attrs: { [k: string]: any }) => {
    if (firstRender.current) return attrs;
    return {};
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setFetching(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8081/api/analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: input.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Normalize incoming shape to Message[]
      let newMessages: Message[] = DEFAULT_MESSAGES;

      if (Array.isArray(data)) {
        newMessages = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray((data as any).messages)) {
          newMessages = (data as any).messages;
        } else if (
          typeof (data as any).sentence === 'string' &&
          typeof (data as any).tense === 'string' &&
          Array.isArray((data as any).tags)
        ) {
          newMessages = [data as Message];
        }
      }

      setMessages(newMessages);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch');
      setMessages(DEFAULT_MESSAGES);
    } finally {
      setFetching(false);
    }
  };

  return (
    <main className="flex w-screen h-screen bg-gradient-to-tr from-gray-100 to-neutral-200">
      {/* Left POS Sidebar */}
      <aside
        className="w-[300px] bg-white border-r border-neutral-300 p-4 overflow-y-auto"
        {...maybeAos({ 'data-aos': 'fade-right' })}
      >
        <h2 className="text-xl font-semibold text-pink-600 mb-4">Part of Speech</h2>
        <div className="space-y-4">
          {effectiveLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBox key={i} className="h-12 w-full" />
              ))
            : Object.entries(POS_EXPLANATIONS).map(([tag, explanation]) => (
                <div
                  key={tag}
                  ref={(el) => (sectionRefs.current[tag] = el)}
                  className={`border-l-4 pl-3 ${
                    selectedTag === tag ? 'border-pink-600 bg-pink-50' : 'border-transparent'
                  }`}
                  {...(firstRender.current
                    ? { 'data-aos': 'fade-up', 'data-aos-delay': '50' }
                    : {})}
                >
                  <h3 className="font-bold text-sm text-neutral-700">{tag}</h3>
                  <p className="text-sm text-neutral-600">{explanation}</p>
                </div>
              ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center py-8 overflow-y-auto px-4">
        <div className="w-full max-w-2xl">
          {/* Animated Headline */}
          <div {...maybeAos({ 'data-aos': 'fade-down' })}>
            <AnimatedHeadline />
          </div>

          {/* Result / Skeleton */}
          <div className="flex flex-col gap-6 mb-6">
            {effectiveLoading ? (
              <div className="space-y-4" {...maybeAos({ 'data-aos': 'fade-up' })}>
                <SkeletonBox className="h-10 w-1/2" />
                <SkeletonBox className="h-16 w-full" />
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-12 w-20" />
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-100 to-white border-l-4 border-pink-400 p-4 rounded-xl shadow-lg text-pink-800 text-base font-semibold">
                    🕒 <span className="text-pink-900">Tense Detected:</span>{' '}
                    <span className="text-pink-600">{msg.tense}</span>
                  </div>

                  <div className="bg-white border border-neutral-300 rounded-2xl p-6 shadow-lg">
                    <p className="text-lg font-semibold text-neutral-900 leading-relaxed tracking-wide">
                      {msg.sentence}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {msg.tags.map(({ word, tag, phonetic }, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToTag(tag)}
                        className="group relative cursor-pointer px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-pink-100 transition shadow-md"
                        title={`/${phonetic}/`}
                      >
                        <div className="text-xs text-neutral-500 text-center -mb-1">
                          /{phonetic}/
                        </div>
                        <span className="font-semibold text-neutral-800">{word}</span>
                        <div className="text-xs text-pink-600 group-hover:underline">{tag}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          
          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-white w-full h-32 p-4 text-sm text-neutral-700 rounded-2xl border border-neutral-300 focus:outline-none resize-none shadow-sm"
                placeholder="Type a sentence like: She was watching TV when I called her."
                maxLength={4000}
                aria-label="Sentence input"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-neutral-400">{input.length}/4000</span>
                <button
                  type="submit"
                  disabled={fetching}
                  className="bg-pink-600 disabled:opacity-50 hover:bg-pink-700 text-white w-8 h-8 flex items-center justify-center rounded-full"
                  aria-label="Analyze"
                >
                  {fetching ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 h-4"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="48"
                        d="M112 244l144-144l144 144M256 120v292"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-red-600">Error: {error}</div>}
          </form>
        </div>
      </div>

      {/* Right Tense Guide Sidebar */}
      <aside
        className="w-[300px] bg-white border-l border-neutral-300 p-4 overflow-y-auto"
        {...maybeAos({ 'data-aos': 'fade-left' })}
      >
        <h2 className="text-xl font-semibold text-violet-600 mb-4">Tense Guide</h2>
        {effectiveLoading ? (
          Array.from({ length: 1 }).map((_, i) => (
            <SkeletonBox key={i} className="h-32 w-full mb-4" />
          ))
        ) : (
          messages.map((msg, idx) => {
            const info = TENSE_EXPLANATIONS[msg.tense];
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-violet-50 to-white rounded-xl shadow p-4 mb-4 border border-violet-200"
              >
                <h3 className="text-lg font-bold text-violet-700 mb-2">{msg.tense}</h3>

                <p className="text-sm mb-2">
                  <span className="font-semibold text-violet-900">🧪 Formula:</span>{' '}
                  <span className="text-neutral-700">{info?.formula}</span>
                </p>

                <p className="text-sm mb-2">
                  <span className="font-semibold text-violet-900">📘 Usage:</span>{' '}
                  <span className="text-neutral-700">{info?.usage}</span>
                </p>

                <p className="text-sm italic text-neutral-600">
                  <span className="font-semibold text-violet-900">💬 Example:</span>{' '}
                  "{info?.example}"
                </p>
              </div>
            );
          })
        )}
      </aside>
    </main>
  );
}
