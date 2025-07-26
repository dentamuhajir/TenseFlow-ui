// https://codepen.io/vikramsoni/pen/RNbpQEm
export default function Prototype() {
  return (
    <main className="w-screen h-screen bg-gradient-to-tr from-gray-100 to-neutral-200 flex flex-col justify-center">
      <div className="w-[80%] max-w-2xl mx-auto">
        <h1 className="z-10 bg-gradient-to-r from-black via-pink-500 to-violet-800 inline-block text-transparent bg-clip-text font-normal text-5xl leading-tight">
          Welcome to TenseFlow,
        </h1>
        <br />
        <h1 className="z-10 bg-gradient-to-r from-black via-pink-500 to-violet-800 inline-block text-transparent bg-clip-text font-normal text-5xl -mt-2 mb-2 leading-tight">
          Let's improve your English grammar!
        </h1>

        <p className="text-neutral-500 leading-tight tracking-tight mb-6 text-lg">
          Try one of the example prompts below <br />
          or type your own sentence to analyze its grammar and tenses.
        </p>

        <div className="flex w-full mb-6 gap-3 text-sm text-neutral-800">
          {[
            "I want to ask you. What is the capital city of Jakarta?",
            "She has been reading a book since morning.",
            "They won't be coming to the party tonight.",
          ].map((prompt, index) => (
            <div
              key={index}
              className="group relative grow border border-neutral-300 shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:bg-neutral-100/30 rounded-xl p-4 transition-all duration-300 cursor-pointer"
            >
              {prompt}
              <svg
                className="absolute right-2 bottom-2 h-4 text-neutral-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <g fill="none">
                  <path
                    d="M2 8a.75.75 0 0 1 .75-.75h8.787L8.25 4.309a.75.75 0 0 1 1-1.118L14 7.441a.75.75 0 0 1 0 1.118l-4.75 4.25a.75.75 0 1 1-1-1.118l3.287-2.941H2.75A.75.75 0 0 1 2 8z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
          ))}
        </div>

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
    </main>
  );
}
