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
  person?: 'first' | 'second' | 'third';
  number?: 'singular' | 'plural';
  polarity?: 'positive' | 'negative';
  questionType?: 'WH' | 'interrogative' | 'none';
  // aspect?: 'simple' | 'continuous' | 'perfect' | 'perfect continuous';
  // voice?: 'active' | 'passive';
  // timeReference?: 'now-relative' | 'past-relative' | 'future-relative' | 'ongoing';
};

const PRONOUNS = [
  { word: 'I', person: 'first', number: 'singular' },
  { word: 'You', person: 'second', number: 'singular' },
  { word: 'He', person: 'third', number: 'singular' },
  { word: 'She', person: 'third', number: 'singular' },
  { word: 'They', person: 'third', number: 'plural' },
  { word: 'We', person: 'first', number: 'plural' },
];

const VERBS_BASE = ['read', 'write', 'draw', 'play', 'study', 'cook', 'watch'];
const NOUNS = ['book', 'movie', 'song', 'game', 'recipe', 'story', 'article'];
const TIMES = ['morning', 'afternoon', 'evening', 'night', 'weekend', 'today', 'yesterday', 'tomorrow'];

const POS_EXPLANATIONS: Record<string, string> = {
  PRP: 'Pronoun: replaces a noun (e.g., she, he, they).',
  VBZ: 'Verb, 3rd person singular present (e.g., has, does).',
  VBP: 'Verb, non-3rd person singular present (e.g., have, do).',
  VBN: 'Verb, past participle (e.g., been, eaten).',
  VBG: 'Present participle or gerund verb (e.g., reading, going).',
  VBD: 'Verb, past tense (e.g., did, went).',
  MD: 'Modal auxiliary (e.g., will, would).',
  DT: 'Determiner: introduces a noun (e.g., a, the, some).',
  NN: 'Noun: person, place, thing (e.g., book, idea, apple).',
  IN: 'Preposition: shows relationship (e.g., since, on, at).',
  WP: 'WH-pronoun (e.g., what, when, why).',
  AUX: 'Auxiliary verb.',
};

const TENSE_EXPLANATIONS: Record<
  string,
  { formula: string; usage: string; example: string }
> = {
  'Present Simple': {
    formula: 'Subject + base verb (s/es for 3rd person)',
    usage: 'Routine or general truth.',
    example: 'She reads every morning.',
  },
  'Present Continuous': {
    formula: 'Subject + am/is/are + verb-ing',
    usage: 'Action happening now.',
    example: 'She is reading a book.',
  },
  'Present Perfect': {
    formula: 'Subject + has/have + past participle',
    usage: 'Action completed at unspecified time.',
    example: 'She has read the book.',
  },
  'Present Perfect Continuous': {
    formula: 'Subject + has/have + been + verb-ing',
    usage: 'Action started in past and continues.',
    example: 'She has been reading since morning.',
  },
  'Past Simple': {
    formula: 'Subject + past verb',
    usage: 'Completed action in past.',
    example: 'She read the book yesterday.',
  },
  'Past Continuous': {
    formula: 'Subject + was/were + verb-ing',
    usage: 'Action in progress in past.',
    example: 'She was reading when I called.',
  },
  'Past Perfect': {
    formula: 'Subject + had + past participle',
    usage: 'Action completed before another past action.',
    example: 'She had read it before class.',
  },
  'Future Simple': {
    formula: 'Subject + will + base verb',
    usage: 'Prediction or plan.',
    example: 'She will read tomorrow.',
  },
  'Future Continuous': {
    formula: 'Subject + will be + verb-ing',
    usage: 'Action that will be in progress.',
    example: 'She will be reading at noon.',
  },
  'Future Perfect': {
    formula: 'Subject + will have + past participle',
    usage: 'Action completed before a future time.',
    example: 'She will have read it by tomorrow.',
  },
};

const DEFAULT_MESSAGES: Message[] = [
  {
    sentence: 'She has been reading a book since morning.',
    tense: 'Present Perfect Continuous',
    tags: [
      { word: 'She', tag: 'PRP', phonetic: 'ʃiː' },
      { word: 'has', tag: 'VBZ', phonemic: 'hæz' } as any, // fallback if needed
      { word: 'been', tag: 'VBN', phonetic: 'bɪn' },
      { word: 'reading', tag: 'VBG', phonetic: 'ˈriːdɪŋ' },
      { word: 'a', tag: 'DT', phonetic: 'ə' },
      { word: 'book', tag: 'NN', phonetic: 'bʊk' },
      { word: 'since', tag: 'IN', phonetic: 'sɪns' },
      { word: 'morning', tag: 'NN', phonetic: 'ˈmɔːrnɪŋ' },
    ] as Tag[],
    person: 'third',
    number: 'singular',
    polarity: 'positive',
    questionType: 'none',
    // aspect: 'perfect continuous',
    // voice: 'active',
    // timeReference: 'ongoing',
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
      delay: i * 0.1 + 0.2,
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

function randomChoice<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// naive phonetic map
function getPhonetic(word: string): string {
  const map: Record<string, string> = {
    she: 'ʃiː',
    he: 'hiː',
    they: 'ðeɪ',
    we: 'wiː',
    you: 'juː',
    i: 'aɪ',
    read: 'riːd',
    writes: 'raɪts',
    write: 'raɪt',
    draw: 'drɔː',
    playing: 'ˈpleɪɪŋ',
    studying: 'ˈstʌdiɪŋ',
    cooking: 'ˈkʊkɪŋ',
    watching: 'ˈwɒtʃɪŋ',
    book: 'bʊk',
    movie: 'ˈmuːvi',
    song: 'sɔŋ',
    game: 'geɪm',
    recipe: 'ˈrɛsəpi',
    story: 'ˈstɔːri',
    article: 'ˈɑːrtɪkəl',
    morning: 'ˈmɔːrnɪŋ',
    afternoon: 'ˌæftərˈnuːn',
    evening: 'ˈiːvnɪŋ',
    night: 'naɪt',
    weekend: 'ˈwiːkˌɛnd',
    today: 'təˈdeɪ',
    yesterday: 'ˈjɛstərdeɪ',
    tomorrow: 'təˈmɒrəʊ',
    since: 'sɪns',
    a: 'ə',
    will: 'wɪl',
    have: 'hæv',
    has: 'hæz',
    had: 'hæd',
    been: 'bɪn',
    is: 'ɪz',
    are: 'ɑːr',
    was: 'wɒz',
    were: 'wɜːr',
  };
  return map[word.toLowerCase()] || word;
}

// Build one random message from varied templates
function generateDiverseMessage(): Message {
  const pron = randomChoice(PRONOUNS);
  const noun = randomChoice(NOUNS);
  const time = randomChoice(TIMES);
  const baseVerb = randomChoice(VERBS_BASE);

  // Decide template type
  const templatePool: (() => Message)[] = [
    // Present Simple positive
    () => {
      const verb = pron.word.toLowerCase() === 'he' || pron.word.toLowerCase() === 'she' ? `${baseVerb}s` : baseVerb;
      const sentence = `${pron.word} ${verb} the ${noun} every ${time}.`;
      const tags: Tag[] = [
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: verb, tag: verb.endsWith('s') ? 'VBZ' : 'VBP', phonetic: getPhonetic(baseVerb) },
        { word: 'the', tag: 'DT', phonetic: 'ðə' },
        { word: noun, tag: 'NN', phonetic: getPhonetic(noun) },
        { word: 'every', tag: 'DT', phonetic: 'ˈɛvri' },
        { word: time, tag: 'NN', phonetic: getPhonetic(time) },
      ];
      return {
        sentence,
        tense: 'Present Simple',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'positive',
        questionType: 'none',
        // aspect: 'simple',
        // voice: 'active',
        // timeReference: 'ongoing',
      };
    },
    // Present Simple negative
    () => {
      const aux = pron.word.toLowerCase() === 'he' || pron.word.toLowerCase() === 'she' ? 'does not' : 'do not';
      const sentence = `${pron.word} ${aux} ${baseVerb} the ${noun}.`;
      const tags: Tag[] = [
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: aux.split(' ')[0], tag: 'AUX', phonetic: getPhonetic(aux.split(' ')[0]) },
        { word: aux.split(' ')[1], tag: 'PART', phonetic: '' },
        { word: baseVerb, tag: 'VB', phonetic: getPhonetic(baseVerb) },
        { word: 'the', tag: 'DT', phonetic: 'ðə' },
        { word: noun, tag: 'NN', phonetic: getPhonetic(noun) },
      ];
      return {
        sentence,
        tense: 'Present Simple',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'negative',
        questionType: 'none',
        // aspect: 'simple',
        // voice: 'active',
        // timeReference: 'ongoing',
      };
    },
    // WH question Present Continuous
    () => {
      const wh = randomChoice(['What', 'Why', 'How']);
      const aux = pron.word.toLowerCase() === 'he' || pron.word.toLowerCase() === 'she' ? 'is' : 'are';
      const verbIng = `${baseVerb}ing`;
      const sentence = `${wh} ${aux} ${pron.word.toLowerCase()} ${verbIng}?`;
      const tags: Tag[] = [
        { word: wh, tag: 'WP', phonetic: wh.toLowerCase() },
        { word: aux, tag: 'AUX', phonetic: getPhonetic(aux) },
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: verbIng, tag: 'VBG', phonetic: getPhonetic(verbIng) },
      ];
      return {
        sentence,
        tense: 'Present Continuous',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'positive',
        questionType: 'WH',
        aspect: 'continuous',
        voice: 'active',
        timeReference: 'ongoing',
      };
    },
    // Interrogative Past Simple
    () => {
      const aux = 'Did';
      const sentence = `${aux} ${pron.word} ${baseVerb} the ${noun} yesterday?`;
      const tags: Tag[] = [
        { word: aux, tag: 'AUX', phonetic: 'dɪd' },
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: baseVerb, tag: 'VB', phonetic: getPhonetic(baseVerb) },
        { word: 'the', tag: 'DT', phonetic: 'ðə' },
        { word: noun, tag: 'NN', phonetic: getPhonetic(noun) },
        { word: 'yesterday', tag: 'NN', phonetic: getPhonetic('yesterday') },
      ];
      return {
        sentence,
        tense: 'Past Simple',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'positive',
        questionType: 'interrogative',
        aspect: 'simple',
        voice: 'active',
        timeReference: 'past-relative',
      };
    },
    // Present Perfect Continuous positive
    () => {
      const aux = pron.word.toLowerCase() === 'he' || pron.word.toLowerCase() === 'she' ? 'has' : 'have';
      const verbIng = `${baseVerb}ing`;
      const sentence = `${pron.word} ${aux} been ${verbIng} since ${time}.`;
      const tags: Tag[] = [
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: aux, tag: aux === 'has' ? 'VBZ' : 'VBP', phonetic: getPhonetic(aux) },
        { word: 'been', tag: 'VBN', phonetic: getPhonetic('been') },
        { word: verbIng, tag: 'VBG', phonetic: getPhonetic(verbIng) },
        { word: 'since', tag: 'IN', phonetic: getPhonetic('since') },
        { word: time, tag: 'NN', phonetic: getPhonetic(time) },
      ];
      return {
        sentence,
        tense: 'Present Perfect Continuous',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'positive',
        questionType: 'none',
        aspect: 'perfect continuous',
        voice: 'active',
        timeReference: 'ongoing',
      };
    },
    // Future Simple negative
    () => {
      const sentence = `${pron.word} will not ${baseVerb} the ${noun} tomorrow.`;
      const tags: Tag[] = [
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: 'will', tag: 'MD', phonetic: getPhonetic('will') },
        { word: 'not', tag: 'PART', phonetic: 'nɒt' },
        { word: baseVerb, tag: 'VB', phonetic: getPhonetic(baseVerb) },
        { word: 'the', tag: 'DT', phonetic: 'ðə' },
        { word: noun, tag: 'NN', phonetic: getPhonetic(noun) },
        { word: 'tomorrow', tag: 'NN', phonetic: getPhonetic('tomorrow') },
      ];
      return {
        sentence,
        tense: 'Future Simple',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'negative',
        questionType: 'none',
        aspect: 'simple',
        voice: 'active',
        timeReference: 'future-relative',
      };
    },
    // Past Continuous positive
    () => {
      const aux = pron.word.toLowerCase() === 'they' || pron.word.toLowerCase() === 'we' ? 'were' : 'was';
      const verbIng = `${baseVerb}ing`;
      const sentence = `${pron.word} ${aux} ${verbIng} when I called.`;
      const tags: Tag[] = [
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: aux, tag: 'VBD', phonetic: getPhonetic(aux) },
        { word: verbIng, tag: 'VBG', phonetic: getPhonetic(verbIng) },
        { word: 'when', tag: 'IN', phonetic: 'wɛn' },
        { word: 'I', tag: 'PRP', phonetic: getPhonetic('I') },
        { word: 'called', tag: 'VBD', phonetic: 'kɔːld' },
      ];
      return {
        sentence,
        tense: 'Past Continuous',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'positive',
        questionType: 'none',
        aspect: 'continuous',
        voice: 'active',
        timeReference: 'past-relative',
      };
    },
    // WH question Future Simple
    () => {
      const wh = randomChoice(['When', 'Where']);
      const sentence = `${wh} will ${pron.word.toLowerCase()} ${baseVerb}?`;
      const tags: Tag[] = [
        { word: wh, tag: 'WP', phonetic: wh.toLowerCase() },
        { word: 'will', tag: 'MD', phonetic: getPhonetic('will') },
        { word: pron.word, tag: 'PRP', phonetic: getPhonetic(pron.word) },
        { word: baseVerb, tag: 'VB', phonetic: getPhonetic(baseVerb) },
      ];
      return {
        sentence,
        tense: 'Future Simple',
        tags,
        person: pron.person,
        number: pron.number,
        polarity: 'positive',
        questionType: 'WH',
        aspect: 'simple',
        voice: 'active',
        timeReference: 'future-relative',
      };
    },
  ];

  // pick a random template
  return randomChoice(templatePool)();
}

export default function Prototype() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // internally generate 10 diverse and pick one to show
    const batch = Array.from({ length: 10 }, () => generateDiverseMessage());
    const chosen = randomChoice(batch);
    setMessages([chosen]);

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

      console.log(data)
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
          {/* Headline */}
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
                  {/* Tense Detected card */}
                  <div className="bg-gradient-to-br from-pink-100 to-white border-l-4 border-pink-400 p-4 rounded-xl shadow-lg text-pink-800 text-base font-semibold">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-1">
                        🕒 <span className="text-pink-900 mr-1">Tense Detected:</span>{' '}
                        <span className="text-pink-600">{msg.tense}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.person && msg.number && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-200">
                          {`${msg.person} person, ${msg.number}`}
                        </div>
                      )}
                      {msg.polarity && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ring-1 ring-inset ring-green-200">
                          {msg.polarity === 'positive' ? 'Affirmative' : 'Negative'}
                        </div>
                      )}
                      {msg.questionType && msg.questionType !== 'none' && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200">
                          {msg.questionType === 'WH' ? 'WH Question' : 'Interrogative'}
                        </div>
                      )}
                       
                       
                    </div>
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
