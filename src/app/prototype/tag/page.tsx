'use client';
import { useState } from 'react';

const POS_EXPLANATIONS: Record<string, string> = {
  PRP: 'Personal Pronoun: used instead of a noun (e.g., he, she, it).',
  AUX: 'Auxiliary Verb: helps the main verb express tense or mood (e.g., has, have, been).',
  VBG: 'Verb, Gerund or Present Participle (e.g., reading, running).',
  DT: 'Determiner: introduces a noun (e.g., a, an, the).',
  NN: 'Noun: a person, place, thing, or idea (e.g., book, car, happiness).',
  IN: 'Preposition: shows relationships between words (e.g., in, since, on).',
  MD: 'Modal: expresses necessity or possibility (e.g., can, will, must).',
  TO: 'To: used as a preposition or infinitive marker.',
};

export default function Prototype() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const messages = [
    {
      sentence: 'She has been reading a book since morning.',
      tags: [
        { word: 'She', tag: 'PRP' },
        { word: 'has', tag: 'AUX' },
        { word: 'been', tag: 'AUX' },
        { word: 'reading', tag: 'VBG' },
        { word: 'a', tag: 'DT' },
        { word: 'book', tag: 'NN' },
        { word: 'since', tag: 'IN' },
        { word: 'morning.', tag: 'NN' },
      ],
    },
  ];

  return (
    <main className="w-screen h-screen bg-gradient-to-tr from-gray-100 to-neutral-200 flex flex-col justify-between py-8 px-4">
      <div className="w-full max-w-5xl mx-auto flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="bg-gradient-to-r from-black via-pink-500 to-violet-800 inline-block text-transparent bg-clip-text font-normal text-4xl leading-tight mb-4">
            TenseFlow - Explore Your English Grammar
          </h1>

          <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-3">
                <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow">
                  <p className="text-neutral-800 text-base font-medium">{msg.sentence}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {msg.tags.map(({ word, tag }, i) => (
                    <div
                      key={i}
                      className="group relative cursor-pointer px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 shadow-sm hover:bg-neutral-100 transition"
                      onClick={() => setSelectedTag(tag)}
                    >
                      <span className="font-medium text-neutral-800">{word}</span>
                      <div className="text-xs text-pink-600 group-hover:underline">
                        {tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Textarea Input */}
          <div className="mt-6">
            <div className="bg-white h-28 rounded-2xl shadow-md border border-neutral-200 relative">
              <div className="flex">
                <textarea
                  className="grow m-4 resize-none outline-none min-h-16"
                  placeholder="Type a sentence like: She was watching TV when I called her."
                  maxLength={4000}
                  aria-label="User input"
                />
              </div>

              <div className="flex gap-2 items-center absolute right-2 bottom-2">
                <div className="text-xs text-neutral-500">0/4000</div>
                <button
                  className="bg-neutral-700 hover:bg-neutral-800 rounded-full text-white w-8 h-8 flex items-center justify-center"
                  aria-label="Send prompt"
                >
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

        {/* Sidebar */}
        {selectedTag && (
          <div className="w-[300px] bg-white border border-neutral-300 rounded-xl shadow-md p-4 h-fit sticky top-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-pink-600">{selectedTag}</h2>
              <button
                className="text-neutral-500 hover:text-black text-sm"
                onClick={() => setSelectedTag(null)}
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-neutral-700 leading-snug">
              {POS_EXPLANATIONS[selectedTag] ?? 'No description available.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
