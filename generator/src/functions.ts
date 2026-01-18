
import { Agent, fetch } from 'undici';

const ollamaKeepAlive = '1h';

const restTimeout = 1000 * 60 * 60 * 2; // 2 hour timeout b/c ollama on pi is slowwww

async function submitRestCall(config: {
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    body?: object,
    queryParams?: Record<string, string>,
    headers?: Record<string, string>,
}) {
    const url = new URL(config.url);
    for (const param in config.queryParams ?? {}) {
        url.searchParams.append(param, config.queryParams![param]);
    }

    return fetch(url, {
        method: config.method,
        headers: config.headers ?? {},
        body: config.body ? JSON.stringify(config.body) : undefined,
        dispatcher: new Agent({ headersTimeout: restTimeout, connectTimeout: restTimeout, bodyTimeout: restTimeout }),
    });
}


export async function getAJoke() {
  const joke = await submitRestCall({
    url: 'https://icanhazdadjoke.com/',
    method: 'get',
    headers: { 'Accept': 'application/json' },
  });
  return (await joke.json() as { id: string, joke: string, status: number }).joke;
}

export async function getWotD(seed: string) {
  const parseResponse: any = await submitRestCall({
    url: 'http://localhost:11434/api/generate',
    method: 'post',
    body: {
        model: 'ministral-3:14b',
        format: {
          type: 'object',
          properties: {
            'word': { type: 'string' },
            'partOfSpeech': { type: 'string' },
            'definition': { type: 'string' },
          },
          required: ['word', 'partOfSpeech', 'definition'],
        },
        keep_alive: ollamaKeepAlive,
        stream: false,
        prompt: `Choose a good "word of the day" using the following news articles as inspiration, making sure to provide a part of speech and one-sentence definition for the word: ${seed}`
    }
  }).then(r => r.json());
  return JSON.parse(parseResponse.response) as { word: string, partOfSpeech: string, definition: string };
}

export async function promptAI(apiKey: string, prompt: string) {
  const response = await submitRestCall({
      method: 'post',
      url: 'https://api.search.brave.com/res/v1/chat/completions',
      body: {
        stream: false,
        messages: [{"role": "user", "content": prompt}],
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Subscription-Token': apiKey,
      },
  });
  return response.json();
}

export async function reformatNews(news: string) {
  const parseResponse: any = await submitRestCall({
    url: 'http://localhost:11434/api/generate',
    method: 'post',
    body: {
      model: 'ministral-3:14b',
      format: {
        type: 'object',
        properties: {
          'articles': {
              type: 'array',
              items: {
                  type: 'object',
                  properties: {
                    'title': { type: 'string' },
                    'content': { type: 'string' },
                  },
                  required: [ 'title', 'content' ],
              }
          }
        },
        required: ['articles'],
      },
      keep_alive: ollamaKeepAlive,
      stream: false,
      prompt: `Extract the news articles from the following content: ${news}`,
    }
  }).then(r => r.json());
  const articles = JSON.parse(parseResponse.response).articles as { title: string, content: string }[];
  return (articles.length === 0)
    ? { content: news }
    : articles;
}

export async function filterUnrelatedTopics(articles: { title: string, content: string }[], topics: string) {
  const validArticles = [];
  for (const article of articles) {
    const relationResponse: any = await submitRestCall({
      url: 'http://localhost:11434/api/generate',
      method: 'post',
      body: {
        model: 'ministral-3:14b',
        format: {
          type: 'object',
          properties: {
            'related': { type: 'boolean', }
          },
          required: ['related'],
        },
        keep_alive: ollamaKeepAlive,
        stream: false,
        prompt: `Given the topic list: [${topics}], is the following article related to at least one of these topics? ${article.content}`,
      }
    }).then(r => r.json());

    const isRelated = JSON.parse(relationResponse.response).related as boolean;
    if (isRelated) {
      validArticles.push(article);
    }
  }

  return validArticles;
}