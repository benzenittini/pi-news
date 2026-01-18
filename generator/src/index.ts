
import fs from 'fs';

import { filterUnrelatedTopics, getAJoke, getWotD, promptAI, reformatNews } from './functions.js';

const DEBUG = false;

async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

// ====================
// Load the Environment
// --------------------

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_API_KEY) {
  console.log("A 'BRAVE_API_KEY' must be provided to the node environment.");
  process.exit(1);
}

const STOCKS = process.env.STOCKS;
if (!STOCKS) {
  console.log("A list of 'STOCKS' must be provided to the node environment.");
  process.exit(1);
}

const STOCK_TOPICS = process.env.STOCK_TOPICS;
if (!STOCK_TOPICS) {
  console.log("A list of 'STOCK_TOPICS' must be provided to the node environment.");
  process.exit(1);
}

const TOPICS = process.env.TOPICS;
if (!TOPICS) {
  console.log("A list of 'TOPICS' must be provided to the node environment.");
  process.exit(1);
}


// ===============
// Gather our Data
// ---------------

const today = new Date();
const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Just some fun cost metrics
let tokenCount = 0;
let requestCount = 0;

// -- Top Stories --

console.log("\n== TOP STORIES ==");
console.log("Querying Brave's Search API...");
const news = DEBUG
  ? JSON.parse(fs.readFileSync('./debug_stories.json', 'utf-8'))
  : await promptAI(BRAVE_API_KEY,
`Task: Summarize the top 3 news stories from the past 24 hours.

Requirements:
- Select the 3 most significant/impactful stories globally
- Only include stories with new developments in the past 24 hours
- Avoid: opinion pieces, editorials, or unverified reports
- Cover diverse topics (politics, business, technology, etc.)
- For each story, format as:
  * Clear, descriptive title
  * 5-8 sentence summary including:
    - What happened
    - Key parties/entities involved
    - Why it's significant
    - Current status/implications
- If no significant news exists for a topic in the timeframe, note this briefly
- Prioritize stories by impact, relevance, and newsworthiness`
);
fs.writeFileSync("./debug_stories.json", JSON.stringify(news, null, 2), 'utf-8');
tokenCount += news.usage.total_tokens;
requestCount++;

console.log("Reformatting response...");
const topStories = await reformatNews(news.choices[0].message.content);

await sleep(1000); // Brave's API limits to 2 requests per second. Sleeping after every request to be safe.

// -- Topics of Interest --

console.log("\n== TOPICS OF INTEREST ==");
console.log("Querying Brave's Search API...");
const topicNews = DEBUG
  ? JSON.parse(fs.readFileSync('./debug_topics.json', 'utf-8'))
  : await promptAI(BRAVE_API_KEY,
`Task: Summarize recent news (past 24 hours) for the following topics.

Topics: ${TOPICS}

Requirements:
- Only include developments from the past 24 hours
- Provide balanced coverage across all topics (no single topic should dominate)
- For each news item, format as:
  * Brief descriptive title
  * 5-8 sentence summary covering:
    - What happened
    - Key parties/entities involved
    - Why it's relevant to the topic
- If no significant news exists for a topic in the timeframe, note this briefly
- Write no more than 5 stories`
);
fs.writeFileSync("./debug_topics.json", JSON.stringify(topicNews, null, 2), 'utf-8');
tokenCount += topicNews.usage.total_tokens;
requestCount++;

console.log("Reformatting response...");
let topics = await reformatNews(topicNews.choices[0].message.content);

if (Array.isArray(topics)) {
  console.log("Filtering response...");
  topics = await filterUnrelatedTopics(topics, TOPICS);
}

await sleep(1000); // Brave's API limits to 2 requests per second. Sleeping after every request to be safe.

// -- Stock News --

console.log("\n== STOCKS ==");
console.log("Querying Brave's Search API...");
const financeNews = DEBUG
  ? JSON.parse(fs.readFileSync('./debug_finances.json', 'utf-8'))
  : await promptAI(BRAVE_API_KEY,
`Task: Summarize recent news (past 24 hours) for the following stocks/assets.

Stocks: ${STOCK_TOPICS}

Requirements:
- Only include developments from the past 24 hours
- Provide balanced coverage across all stocks (no single stock should dominate)
- For each news item, format as:
  * Brief descriptive title
  * 5-8 sentence summary covering key details
- If no significant news exists for a topic in the timeframe, note this briefly
- Include news about the companies themselves or closely related entities`
);
fs.writeFileSync("./debug_finances.json", JSON.stringify(financeNews, null, 2), 'utf-8');
tokenCount += financeNews.usage.total_tokens;
requestCount++;

console.log("Reformatting response...");
let stockArticles = await reformatNews(financeNews.choices[0].message.content);
const finance = { stocks: STOCKS.split(', '), news: stockArticles };

await sleep(1000); // Brave's API limits to 2 requests per second. Sleeping after every request to be safe.

// -- WotD / JotD --

console.log("\n== WOTD / JOTD ==");
console.log("Querying WotD...");
const wotd = await getWotD(news.choices[0].message.content);
console.log("Querying JotD...");
const jotd = await getAJoke();

// -- Write the Newspaper --
const costCents = Math.round((400 * requestCount / 1000) + (500 * tokenCount / 1000000)); // $4.00 per 1000 requests, $5.00 per million tokens.
const newspaper = { date, costCents, topStories, topics, jotd, wotd, finance };
fs.writeFileSync("./debug_newspaper.json", 'const paper = ' + JSON.stringify(newspaper, null, 2), 'utf-8');
fs.writeFileSync("../website/dist/data.js", 'const paper = ' + JSON.stringify(newspaper, null, 2), 'utf-8');

console.log("\nDone!\n");