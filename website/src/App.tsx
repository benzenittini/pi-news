import './App.css';
import Entertainment from './Entertainment';
import Finance from './Finance';
import Gossip from './Gossip';
import Heading from './Heading';
import TopStories, { type TopStory } from './TopStories';

declare const articleContents: {
  date: string;
  topStories: TopStory[];
};

function App() {

  return (
    <>
      <Heading date={articleContents.date}/>

      <TopStories stories={articleContents.topStories} />

      <Finance />

      <Entertainment />

      <Gossip />

      {/* <div style={{ width: '100%', height: '10px', marginBottom: '13px', boxShadow: '0px 13px 10px #bbb' }} /> */}

      <div className="footer">
        <span>Source: <a href="https://github.com/benzenittini/pi-news">github.com/benzenittini/pi-news</a></span>
        <span>Powered by: <a href="https://brave.com/search/api/">Brave Search API</a>, <a href="https://ollama.com/">Ollama</a>, and <a href="https://ollama.com/library/ministral-3">Ministral 3 14b</a></span>
      </div>
    </>
  );
}

export default App
