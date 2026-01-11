
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

// -- Top Stories --

console.log("\n== TOP STORIES ==");
console.log("Querying Brave's Search API...");
const news = DEBUG
  ? JSON.parse(fs.readFileSync('./debug_stories.json', 'utf-8'))
  : await promptAI(BRAVE_API_KEY, "Summarize the top 3 news stories for the past 24 hours, giving each a title followed by a 3-8 sentence summary.");
fs.writeFileSync("./debug_stories.json", JSON.stringify(news), 'utf-8');

console.log("Reformatting response...");
const topStories = await reformatNews(news.choices[0].message.content);

await sleep(1000); // Brave's API limits to 2 requests per second. Sleeping after every request to be safe.

// -- Topics of Interest --

console.log("\n== TOPICS OF INTEREST ==");
console.log("Querying Brave's Search API...");
const topicNews = DEBUG
  ? JSON.parse(fs.readFileSync('./debug_topics.json', 'utf-8'))
  : await promptAI(BRAVE_API_KEY, `Summarize any news that occurred in the past 24 hours related to the following topics, giving each a brief title followed by a 3-8 sentence summary: ${TOPICS}`);
fs.writeFileSync("./debug_topics.json", JSON.stringify(topicNews), 'utf-8');

console.log("Reformatting response...");
let topics = await reformatNews(topicNews.choices[0].message.content);

console.log("Filtering response...");
topics = await filterUnrelatedTopics(topics, TOPICS);

await sleep(1000); // Brave's API limits to 2 requests per second. Sleeping after every request to be safe.

// -- Stock News --

console.log("\n== STOCKS ==");
console.log("Querying Brave's Search API...");
const financeNews = DEBUG
  ? JSON.parse(fs.readFileSync('./debug_finances.json', 'utf-8'))
  : await promptAI(BRAVE_API_KEY, `Summarize any news that occurred in the past 24 hours related to the following stocks or any related stocks, giving each a brief title followed by a 3-8 sentence summary: ${STOCKS}`);
fs.writeFileSync("./debug_finances.json", JSON.stringify(financeNews), 'utf-8');

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
const newspaper = { date, topStories, topics, jotd, wotd, finance };
fs.writeFileSync("./debug_newspaper.json", 'const paper = ' + JSON.stringify(newspaper, null, 2), 'utf-8');

console.log("\nDone!\n");