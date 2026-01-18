import './App.css';
import type { ArticleError, ArticleType } from './components/Article';
import Entertainment, { type WotD } from './Entertainment';
import Finance from './Finance';
import Heading from './Heading';
import TopStories from './TopStories';

declare const paper: {
  date: string,
  costCents: string,
  topStories: ArticleType[] | ArticleError,
  topics: ArticleType[] | ArticleError,
  jotd: string,
  wotd: WotD,
  finance: {
    stocks: string[],
    news: ArticleType[] | ArticleError,
  }
};

function App() {

  return (
    <>
      {/* Lol, never have I ever had this many styles defined inline. */}
      <span style={{
        position: 'absolute',
        right: 'var(--padding1)',
        top: 'var(--padding1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50px',
        height: '50px',
        color: 'var(--text-gray)',
        border: '1px dotted var(--text-gray)',
        borderRadius: '50%',
        opacity: '0.4',
        transform: 'rotate(-10deg)',
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
