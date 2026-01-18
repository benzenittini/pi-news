import './App.css'
import { type ArticleError, type ArticleType } from './components/Article';
import ColumnLayout from './components/ColumnLayout';

type Props = {
  stories: ArticleType[] | ArticleError;
};

function TopStories({ stories }: Props) {
  return (
    <div className="topStories">
      <h1>Top Stories</h1>

      <ColumnLayout articles={stories} />
    </div>
  );
}

export default TopStories
