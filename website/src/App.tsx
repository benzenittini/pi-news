import './App.css';
import type { ArticleType } from './components/Article';
import Entertainment, { type WotD } from './Entertainment';
import Finance from './Finance';
import Heading from './Heading';
import TopStories from './TopStories';

declare const paper: {
  date: string,
  costCents: string,
  topStories: ArticleType[],
  topics: ArticleType[],
  jotd: string,
  wotd: WotD,
  finance: {
    stocks: string[],
    news: ArticleType[],
  }
};

function App() {

  return (
    <>
      <span style={{
        position: 'absolute',
        right: 'var(--padding1)',
        top: 'var(--padding1)',
        color: 'var(--text-gray)',
        fontStyle: 'italic',
        }}>{paper.costCents}&cent;</span>

      <Heading date={paper.date}/>

      <TopStories stories={paper.topStories} />

      <Finance stocks={paper.finance.stocks} news={paper.finance.news} />

      <Entertainment jotd={paper.jotd} wotd={paper.wotd} articles={paper.topics} />

      <div className="footer">
        <span>Source: <a href="https://github.com/benzenittini/pi-news">github.com/benzenittini/pi-news</a></span>
        <span>Powered by: <a href="https://brave.com/search/api/">Brave Search API</a>, <a href="https://ollama.com/">Ollama</a>, and <a href="https://ollama.com/library/ministral-3">Ministral 3 14b</a></span>
      </div>
    </>
  );
}

export default App
