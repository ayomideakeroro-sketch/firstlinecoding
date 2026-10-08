/**
 * Course content fixtures.
 *
 * Everything the UI knows about tracks and lessons lives here so a later
 * milestone can move it into the database without touching the screens.
 *
 * Lesson `checks` are JavaScript expressions evaluated inside the sandboxed
 * runner after the learner's code has run. For `js` lessons, `__logs` holds
 * every console line; for `html` lessons, the learner's page is the `document`.
 */

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'code'; text: string }

export interface Check {
  label: string
  test: string
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  concept: string
  body: Block[]
  task: string[]
  starter: string
  solution: string
  hints: string[]
  checks: Check[]
}

export interface Track {
  id: string
  title: string
  tagline: string
  description: string
  mode: 'js' | 'html'
  level: 'Absolute beginner' | 'Beginner' | 'Intermediate'
  accent: 'tomato' | 'moss' | 'mustard'
  status: 'open' | 'soon'
  learners: number
  lessons: Lesson[]
  /** Titles shown for tracks that aren't playable yet */
  upcoming?: string[]
}

const javascript: Track = {
  id: 'javascript-foundations',
  title: 'JavaScript Foundations',
  tagline: 'Your first programming language, from console.log to objects.',
  description:
    'JavaScript runs every website you use. In six short lessons you will print output, store values, write functions, make decisions, loop over lists and model real things with objects — all by typing real code.',
  mode: 'js',
  level: 'Absolute beginner',
  accent: 'tomato',
  status: 'open',
  learners: 18342,
  lessons: [
    {
      id: 'hello-world',
      title: 'Say hello',
      minutes: 4,
      concept: 'Output',
      body: [
        {
          kind: 'p',
          text: 'Every programmer starts the same way: by making the computer say something. In JavaScript, `console.log()` prints whatever you put between the parentheses.',
        },
        { kind: 'code', text: "console.log('I am learning to code')" },
        {
          kind: 'p',
          text: 'Text wrapped in quotes is called a **string**. The quotes tell JavaScript "this is words, not instructions". You can use single or double quotes — just be consistent.',
        },
      ],
      task: [
        'Use `console.log()` to print exactly `Hello, world!`',
        'Press **Run** to see your output, then **Check** to finish the lesson.',
      ],
      starter: "// Print a greeting below\n\n",
      solution: "console.log('Hello, world!')\n",
      hints: [
        'Strings need quotes around them: `\'Hello, world!\'`',
        "Try: `console.log('Hello, world!')` — watch the comma and the exclamation mark.",
      ],
      checks: [
        { label: 'Something was printed', test: '__logs.length > 0' },
        {
          label: 'The output is exactly "Hello, world!"',
          test: "__logs.some(l => l.trim() === 'Hello, world!')",
        },
      ],
    },
    {
      id: 'variables',
      title: 'Remember things with variables',
      minutes: 6,
      concept: 'Variables',
      body: [
        {
          kind: 'p',
          text: 'A **variable** is a labelled box that holds a value. Use `const` for values that never change and `let` for values that will.',
        },
        {
          kind: 'code',
          text: "const city = 'Lisbon'\nlet visits = 1\nvisits = visits + 1\nconsole.log(city, visits) // Lisbon 2",
        },
        {
          kind: 'p',
          text: 'Notice that `visits` gets a new value on line 3, but `city` never does. Trying to reassign a `const` is an error — which is exactly why it is useful.',
        },
      ],
      task: [
        "Create a `const` called `language` holding the string `'JavaScript'`.",
        'Create a `let` called `lessonsDone` starting at `1`, then add 1 to it.',
        'Print both variables with `console.log()`.',
      ],
      starter: "// 1. language\n\n// 2. lessonsDone\n\n// 3. print them\n",
      solution:
        "const language = 'JavaScript'\nlet lessonsDone = 1\nlessonsDone = lessonsDone + 1\nconsole.log(language, lessonsDone)\n",
      hints: [
        "Strings need quotes: `const language = 'JavaScript'`",
        'To add one: `lessonsDone = lessonsDone + 1` (or the shortcut `lessonsDone++`).',
      ],
      checks: [
        { label: '`language` is the string "JavaScript"', test: "language === 'JavaScript'" },
        { label: '`lessonsDone` ends up as 2', test: 'lessonsDone === 2' },
        { label: 'You printed something', test: '__logs.length > 0' },
      ],
    },
    {
      id: 'functions',
      title: 'Package steps into functions',
      minutes: 7,
      concept: 'Functions',
      body: [
        {
          kind: 'p',
          text: 'A **function** is a reusable recipe. You give it inputs (called **parameters**), it does some work, and it can `return` a result.',
        },
        {
          kind: 'code',
          text: "function double(n) {\n  return n * 2\n}\n\nconsole.log(double(21)) // 42",
        },
        {
          kind: 'p',
          text: 'Template strings use backticks and let you drop values straight into text with `${...}`:',
        },
        { kind: 'code', text: 'const pet = "otter"\nconsole.log(`My favourite animal is the ${pet}`)' },
      ],
      task: [
        'Write a function called `greet` that takes one parameter, `person`.',
        "It should **return** a string like `Hello, Ada!` for `greet('Ada')`.",
      ],
      starter: 'function greet(person) {\n  // return a greeting\n}\n\nconsole.log(greet("Ada"))\n',
      solution: 'function greet(person) {\n  return `Hello, ${person}!`\n}\n\nconsole.log(greet("Ada"))\n',
      hints: [
        'Use `return`, not `console.log`, inside the function.',
        'Wrap the text in backticks and drop the name in with `${person}` — then add the `!` at the end.',
      ],
      checks: [
        { label: '`greet` is a function', test: "typeof greet === 'function'" },
        { label: "greet('Ada') returns \"Hello, Ada!\"", test: "greet('Ada') === 'Hello, Ada!'" },
        { label: 'Works for any name', test: "greet('Grace Hopper') === 'Hello, Grace Hopper!'" },
      ],
    },
    {
      id: 'conditionals',
      title: 'Make decisions with if / else',
      minutes: 6,
      concept: 'Conditionals',
      body: [
        {
          kind: 'p',
          text: 'Programs constantly choose between paths. An `if` statement runs a block only when its condition is `true`; `else` catches everything else.',
        },
        {
          kind: 'code',
          text: "function umbrella(chanceOfRain) {\n  if (chanceOfRain > 60) {\n    return 'Bring it'\n  } else {\n    return 'Leave it'\n  }\n}",
        },
        {
          kind: 'p',
          text: 'Comparison operators give you true or false: `>`, `<`, `>=`, `<=`, `===` (equal) and `!==` (not equal).',
        },
      ],
      task: [
        'Write `grade(score)` that returns `\'pass\'` when score is **50 or more**.',
        "Otherwise it returns `'retry'`.",
      ],
      starter: 'function grade(score) {\n  \n}\n\nconsole.log(grade(72))\nconsole.log(grade(31))\n',
      solution:
        "function grade(score) {\n  if (score >= 50) {\n    return 'pass'\n  } else {\n    return 'retry'\n  }\n}\n\nconsole.log(grade(72))\nconsole.log(grade(31))\n",
      hints: ['“50 or more” is `score >= 50`.', 'Make sure both branches `return` a string.'],
      checks: [
        { label: 'grade(72) is "pass"', test: "grade(72) === 'pass'" },
        { label: 'grade(31) is "retry"', test: "grade(31) === 'retry'" },
        { label: 'Exactly 50 passes', test: "grade(50) === 'pass'" },
      ],
    },
    {
      id: 'arrays-and-loops',
      title: 'Lists and loops',
      minutes: 8,
      concept: 'Arrays & loops',
      body: [
        {
          kind: 'p',
          text: 'An **array** is an ordered list: `[3, 8, 12]`. A `for...of` loop visits each item in turn, so you can do something with every one.',
        },
        {
          kind: 'code',
          text: "const snacks = ['olives', 'figs', 'almonds']\nfor (const snack of snacks) {\n  console.log('I like ' + snack)\n}",
        },
        {
          kind: 'p',
          text: 'A common pattern is the **accumulator**: start a variable at 0 and add to it inside the loop.',
        },
      ],
      task: [
        'Write `total(numbers)` that adds up every number in the array and returns the sum.',
        'An empty array should return `0`.',
      ],
      starter:
        'function total(numbers) {\n  let sum = 0\n  // loop over numbers here\n  return sum\n}\n\nconsole.log(total([4, 8, 15, 16, 23, 42]))\n',
      solution:
        'function total(numbers) {\n  let sum = 0\n  for (const n of numbers) {\n    sum = sum + n\n  }\n  return sum\n}\n\nconsole.log(total([4, 8, 15, 16, 23, 42]))\n',
      hints: ['`for (const n of numbers) { ... }`', 'Inside the loop: `sum = sum + n`'],
      checks: [
        { label: 'total([1, 2, 3]) is 6', test: 'total([1, 2, 3]) === 6' },
        { label: 'total([4, 8, 15, 16, 23, 42]) is 108', test: 'total([4, 8, 15, 16, 23, 42]) === 108' },
        { label: 'An empty list totals 0', test: 'total([]) === 0' },
      ],
    },
    {
      id: 'objects',
      title: 'Model the world with objects',
      minutes: 8,
      concept: 'Objects',
      body: [
        {
          kind: 'p',
          text: 'An **object** groups related values under named keys. You read a value with a dot: `book.title`.',
        },
        {
          kind: 'code',
          text: "const book = { title: 'Dune', pages: 412 }\nconsole.log(book.title + ' has ' + book.pages + ' pages')",
        },
        {
          kind: 'p',
          text: 'Functions often take an object as input so they can use several pieces of information at once.',
        },
      ],
      task: [
        'Write `describe(pet)` where `pet` looks like `{ name: \'Miso\', species: \'cat\', age: 3 }`.',
        "Return `'Miso is a 3 year old cat'`.",
      ],
      starter:
        "function describe(pet) {\n  \n}\n\nconst miso = { name: 'Miso', species: 'cat', age: 3 }\nconsole.log(describe(miso))\n",
      solution:
        "function describe(pet) {\n  return `${pet.name} is a ${pet.age} year old ${pet.species}`\n}\n\nconst miso = { name: 'Miso', species: 'cat', age: 3 }\nconsole.log(describe(miso))\n",
      hints: ['Read values with `pet.name`, `pet.age` and `pet.species`.', 'A template string keeps it tidy.'],
      checks: [
        {
          label: 'Describes Miso correctly',
          test: "describe({ name: 'Miso', species: 'cat', age: 3 }) === 'Miso is a 3 year old cat'",
        },
        {
          label: 'Works for another pet',
          test: "describe({ name: 'Pickle', species: 'tortoise', age: 41 }) === 'Pickle is a 41 year old tortoise'",
        },
      ],
    },
  ],
}

const htmlCss: Track = {
  id: 'html-and-css',
  title: 'HTML & CSS: Build a Page',
  tagline: 'Structure and style a real web page, watching it change as you type.',
  description:
    'HTML gives a page its structure; CSS gives it personality. Across four lessons you will write headings, lists and links, then colour and lay them out with Flexbox — with a live preview beside your code.',
  mode: 'html',
  level: 'Absolute beginner',
  accent: 'moss',
  status: 'open',
  learners: 11207,
  lessons: [
    {
      id: 'first-page',
      title: 'Your first web page',
      minutes: 5,
      concept: 'Tags',
      body: [
        {
          kind: 'p',
          text: 'HTML is made of **tags**. Most come in pairs: an opening tag like `<h1>` and a closing tag like `</h1>`, with content in between.',
        },
        { kind: 'code', text: '<h1>Rosa’s Bakery</h1>\n<p>Fresh sourdough every morning.</p>' },
        {
          kind: 'p',
          text: '`<h1>` is the main heading of a page. `<p>` is a paragraph. The browser decides how they look by default — we will change that later with CSS.',
        },
      ],
      task: ['Add an `<h1>` heading with any title you like.', 'Add a `<p>` paragraph underneath it.'],
      starter: '<!-- Write your heading and paragraph here -->\n\n',
      solution: '<h1>My first page</h1>\n<p>I built this myself.</p>\n',
      hints: ['Don’t forget the closing tag: `</h1>`', 'Paragraphs: `<p>Some words</p>`'],
      checks: [
        {
          label: 'There is an <h1> with text',
          test: "!!document.querySelector('h1') && document.querySelector('h1').textContent.trim().length > 0",
        },
        {
          label: 'There is a <p> with text',
          test: "!!document.querySelector('p') && document.querySelector('p').textContent.trim().length > 0",
        },
      ],
    },
    {
      id: 'lists-and-links',
      title: 'Lists and links',
      minutes: 6,
      concept: 'Nesting',
      body: [
        {
          kind: 'p',
          text: 'Tags can live inside other tags. A `<ul>` (unordered list) holds `<li>` list items.',
        },
        { kind: 'code', text: '<ul>\n  <li>Flour</li>\n  <li>Water</li>\n  <li>Salt</li>\n</ul>' },
        {
          kind: 'p',
          text: 'Links use the `<a>` tag with an `href` **attribute** telling the browser where to go: `<a href="https://example.com">Visit</a>`.',
        },
      ],
      task: ['Make a `<ul>` with at least **three** `<li>` items.', 'Add one `<a>` link with an `href`.'],
      starter: '<h1>Weekend plans</h1>\n\n',
      solution:
        '<h1>Weekend plans</h1>\n<ul>\n  <li>Farmers market</li>\n  <li>Long walk</li>\n  <li>Finish lesson 3</li>\n</ul>\n<a href="https://developer.mozilla.org">Read more on MDN</a>\n',
      hints: ['Each item is `<li>...</li>` inside the `<ul>`.', 'A link: `<a href="https://...">text</a>`'],
      checks: [
        { label: 'A <ul> with 3+ items', test: "document.querySelectorAll('ul > li').length >= 3" },
        { label: 'A link with an href', test: "!!document.querySelector('a[href]')" },
      ],
    },
    {
      id: 'styling',
      title: 'Add colour with CSS',
      minutes: 7,
      concept: 'Selectors',
      body: [
        {
          kind: 'p',
          text: 'CSS rules pick elements with a **selector** and then set **properties**. You can write CSS inside a `<style>` tag.',
        },
        {
          kind: 'code',
          text: '<style>\n  h1 {\n    color: tomato;\n    font-family: Georgia, serif;\n  }\n</style>',
        },
        { kind: 'p', text: 'Colours can be names (`tomato`), hex codes (`#3f7a4f`) or `rgb(...)` values.' },
      ],
      task: [
        'Give the `h1` a `color` other than black.',
        'Give the `body` a `background` colour.',
      ],
      starter: '<style>\n  \n</style>\n\n<h1>Night market</h1>\n<p>Dumplings, lanterns and live music.</p>\n',
      solution:
        '<style>\n  body { background: #fdf3dc; }\n  h1 { color: tomato; }\n</style>\n\n<h1>Night market</h1>\n<p>Dumplings, lanterns and live music.</p>\n',
      hints: ['`h1 { color: tomato; }`', '`body { background: lightyellow; }`'],
      checks: [
        {
          label: 'The heading has a colour',
          test: "!!document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).color !== 'rgb(0, 0, 0)'",
        },
        {
          label: 'The page has a background',
          test: "getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)'",
        },
      ],
    },
    {
      id: 'flexbox',
      title: 'Lay things out with Flexbox',
      minutes: 9,
      concept: 'Layout',
      body: [
        {
          kind: 'p',
          text: 'By default, blocks stack vertically. Setting `display: flex` on a parent lines its children up in a row.',
        },
        {
          kind: 'code',
          text: '.row {\n  display: flex;\n  gap: 12px;\n}',
        },
        {
          kind: 'p',
          text: 'The `.row` selector targets any element with `class="row"`. `gap` adds breathing room between children.',
        },
      ],
      task: [
        'Make the `.row` element a flex container.',
        'Keep at least three `.card` elements inside it.',
      ],
      starter:
        '<style>\n  .card { padding: 16px; background: #fff; border: 2px solid #1d1b18; border-radius: 10px; }\n  .row {\n    \n  }\n</style>\n\n<div class="row">\n  <div class="card">Plan</div>\n  <div class="card">Build</div>\n  <div class="card">Ship</div>\n</div>\n',
      solution:
        '<style>\n  .card { padding: 16px; background: #fff; border: 2px solid #1d1b18; border-radius: 10px; }\n  .row {\n    display: flex;\n    gap: 12px;\n  }\n</style>\n\n<div class="row">\n  <div class="card">Plan</div>\n  <div class="card">Build</div>\n  <div class="card">Ship</div>\n</div>\n',
      hints: ['Inside `.row { }` add `display: flex;`', 'Try `gap: 12px;` for spacing.'],
      checks: [
        {
          label: '.row uses display: flex',
          test: "!!document.querySelector('.row') && getComputedStyle(document.querySelector('.row')).display === 'flex'",
        },
        { label: 'Three or more cards', test: "document.querySelectorAll('.row > .card').length >= 3" },
      ],
    },
  ],
}

const python: Track = {
  id: 'python-basics',
  title: 'Python for Curious Minds',
  tagline: 'The friendliest language for data, automation and science.',
  description:
    'A gentle path into Python, running entirely in your browser. Variables, lists, dictionaries and a tiny text adventure to finish.',
  mode: 'js',
  level: 'Beginner',
  accent: 'mustard',
  status: 'soon',
  learners: 0,
  lessons: [],
  upcoming: ['print() and strings', 'Numbers and maths', 'Lists', 'Dictionaries', 'Loops', 'Build a text adventure'],
}

export const tracks: Track[] = [javascript, htmlCss, python]

export function getTrack(trackId: string) {
  return tracks.find((t) => t.id === trackId)
}

export function getLesson(trackId: string, lessonId: string) {
  const track = getTrack(trackId)
  if (!track) return undefined
  const index = track.lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) return undefined
  return {
    track,
    lesson: track.lessons[index],
    index,
    prev: track.lessons[index - 1],
    next: track.lessons[index + 1],
  }
}

export const learnerStories = [
  {
    name: 'Tomasz Wieczorek',
    role: 'Warehouse supervisor → junior front-end dev',
    quote:
      'I did one lesson on my lunch break every day. Seeing the checks go green was weirdly addictive. Four months later I shipped my first pull request at work.',
  },
  {
    name: 'Adaeze Okafor',
    role: 'Nursing student',
    quote:
      'Every tutorial I tried before wanted me to install things. Here I was writing JavaScript in the first ninety seconds.',
  },
  {
    name: 'Rui Tanaka-Bell',
    role: 'Retired, learning for fun',
    quote: 'The hints are patient without giving the game away. I built my grandson a flexbox birthday card.',
  },
]
