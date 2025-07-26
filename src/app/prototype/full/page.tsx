'use client';
import { useState, useRef } from 'react';

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

export default function Prototype() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const messages = [
    {
      sentence: 'She has been reading a book since morning.',
      tense: 'Present Perfect Continuous',
      tags: [
        { word: 'She', tag: 'PRP', ipa: 'ʃiː' },
        { word: 'has', tag: 'VBZ', ipa: 'hæz' },
        { word: 'been', tag: 'VBN', ipa: 'bɪn' },
        { word: 'reading', tag: 'VBG', ipa: 'ˈriːdɪŋ' },
        { word: 'a', tag: 'DT', ipa: 'ə' },
        { word: 'book', tag: 'NN', ipa: 'bʊk' },
        { word: 'since', tag: 'IN', ipa: 'sɪns' },
        { word: 'morning', tag: 'NN', ipa: 'ˈmɔːrnɪŋ' },
      ],
    },
  ];

  const scrollToTag = (tag: string) => {
    const el = sectionRefs.current[tag];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSelectedTag(tag);
  };

  return (
    <main className="flex w-screen h-screen bg-gradient-to-tr from-gray-100 to-neutral-200">
      {/* Left POS Sidebar */}
      <aside className="w-[300px] bg-white border-r border-neutral-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-pink-600 mb-4">Part of Speech</h2>
        <div className="space-y-4">
          {Object.entries(POS_EXPLANATIONS).map(([tag, explanation]) => (
            <div
              key={tag}
              ref={(el) => (sectionRefs.current[tag] = el)}
              className={`border-l-4 pl-3 ${
                selectedTag === tag ? 'border-pink-600 bg-pink-50' : 'border-transparent'
              }`}
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
          <h1 className="bg-gradient-to-r from-black via-pink-500 to-violet-800 inline-block text-transparent bg-clip-text font-bold text-4xl leading-tight mb-6">
            {/* TenseFlow - Explore Your English Grammar */}
            TenseFlow - Break Down Grammar. Build Up Skill.
          </h1>

          <div className="flex flex-col gap-6 mb-6">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-4">
                {/* Tense Summary Block */}
                <div className="bg-gradient-to-br from-pink-100 to-white border-l-4 border-pink-400 p-4 rounded-xl shadow-lg text-pink-800 text-base font-semibold">
                  🕒 <span className="text-pink-900">Tense Detected:</span>{' '}
                  <span className="text-pink-600">{msg.tense}</span>
                </div>

                {/* Sentence Block */}
                <div className="bg-white border border-neutral-300 rounded-2xl p-6 shadow-lg">
                  <p className="text-lg font-semibold text-neutral-900 leading-relaxed tracking-wide">
                    {msg.sentence}
                  </p>
                </div>

                {/* POS tags */}
                <div className="flex flex-wrap gap-2">
                  {msg.tags.map(({ word, tag, ipa }, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToTag(tag)}
                      className="group relative cursor-pointer px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-pink-100 transition shadow-md"
                      title={`/${ipa}/`}
                    >
                      <div className="text-xs text-neutral-500 text-center -mb-1">
                        /{ipa}/
                      </div>
                      <span className="font-semibold text-neutral-800">{word}</span>
                      <div className="text-xs text-pink-600 group-hover:underline">{tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Textarea Input */}
          <div className="bg-white h-32 rounded-2xl shadow-md border border-neutral-300 relative hover:shadow-lg transition-all">
            <textarea
              className="w-full h-full p-4 text-sm text-neutral-700 rounded-2xl focus:outline-none resize-none"
              placeholder="Type a sentence like: She was watching TV when I called her."
              maxLength={4000}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs text-neutral-400">0/4000</span>
              <button className="bg-pink-600 hover:bg-pink-700 text-white w-8 h-8 flex items-center justify-center rounded-full">
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
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Tense Guide Sidebar */}
      <aside className="w-[300px] bg-white border-l border-neutral-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-violet-600 mb-4">Tense Guide</h2>
        {messages.map((msg, idx) => {
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
        })}
      </aside>
    </main>
  );
}
