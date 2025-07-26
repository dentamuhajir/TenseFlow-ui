export default function Prototype() {
  const dummySentence = [
    { word: "She", tag: "PRP", ipa: "ʃiː" },
    { word: "has", tag: "VBZ", ipa: "hæz" },
    { word: "been", tag: "VBN", ipa: "bɪn" },
    { word: "reading", tag: "VBG", ipa: "ˈriːdɪŋ" },
    { word: "a", tag: "DT", ipa: "ə" },
    { word: "book", tag: "NN", ipa: "bʊk" },
    { word: "since", tag: "IN", ipa: "sɪns" },
    { word: "morning", tag: "NN", ipa: "ˈmɔːrnɪŋ" },
  ];

  const tagDescriptions: Record<string, string> = {
    PRP: "Personal Pronoun: refers to a specific person or thing (e.g., I, she, they).",
    VBZ: "Verb, 3rd person singular present.",
    VBN: "Verb, past participle.",
    VBG: "Verb, gerund/present participle.",
    DT: "Determiner.",
    NN: "Noun, singular.",
    IN: "Preposition or subordinating conjunction.",
  };

  return (
    <main className="flex h-screen w-screen">
      {/* Left Sidebar */}
      <aside className="w-[260px] bg-white border-r border-neutral-300 p-4 overflow-y-auto hidden md:block">
        <h2 className="font-bold text-lg mb-4">Part of Speech</h2>
        <ul className="space-y-3 text-sm">
          {Object.entries(tagDescriptions).map(([tag, desc]) => (
            <li key={tag}>
              <span className="font-medium text-violet-600">{tag}:</span>{" "}
              {desc}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Chat Section */}
      <section className="flex-1 flex flex-col justify-between bg-gradient-to-tr from-gray-100 to-neutral-200 p-6">
        <div className="space-y-4 overflow-y-auto max-h-[80vh]">
          <div className="bg-white rounded-xl p-4 shadow w-fit max-w-[90%]">
            <p className="text-sm text-neutral-800">
              She has been reading a book since morning.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {dummySentence.map((item, index) => (
              <div
                key={index}
                className="group relative bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-1 text-sm cursor-pointer hover:bg-neutral-200 transition"
              >
                <div className="text-xs text-neutral-500 text-center -mb-1">
                  /{item.ipa}/
                </div>
                <div className="text-base font-medium">{item.word}</div>
                <div className="text-xs text-violet-600 font-semibold">
                  {item.tag}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white border border-neutral-300 shadow p-4 rounded-xl max-w-md">
            <h3 className="text-sm text-neutral-500 mb-2">Grammar Summary:</h3>
            <p className="text-base font-semibold text-neutral-700">
              Present Perfect Continuous
            </p>
            <p className="text-sm text-neutral-500">
              Structure: Subject + has/have + been + Verb-ing <br />
              Used for actions that started in the past and are still continuing or just recently stopped.
            </p>
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-6 bg-white h-28 rounded-2xl shadow-md border border-neutral-200 relative">
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
      </section>

      {/* Right Sidebar */}
      <aside className="w-[260px] bg-white border-l border-neutral-300 p-4 overflow-y-auto hidden md:block">
        <h2 className="font-bold text-lg mb-4">Tense Explanation</h2>
        <p className="text-sm text-neutral-700 mb-2 font-medium">
          Present Perfect Continuous
        </p>
        <p className="text-sm text-neutral-500">
          <strong>Formula:</strong> Subject + has/have + been + verb-ing<br />
          <strong>Usage:</strong> Actions that began in the past and are still
          continuing or have recently stopped.
        </p>
        <ul className="mt-4 list-disc pl-4 text-sm text-neutral-600 space-y-1">
          <li>Describes duration from the past until now.</li>
          <li>Often used with time expressions like "since", "for", etc.</li>
        </ul>
      </aside>
    </main>
  );
}
