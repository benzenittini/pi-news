import './App.css'

export type TopStory = {
  title: string;
  article: string;
};

type Props = {
  stories: TopStory[];
};

function TopStories({ stories }: Props) {
  return (
    <div className="topStories">
      <h1>Top Stories</h1>
      <div style={{ display: 'flex', gap: 'var(--padding1)' }}>
        <div style={{ flex: '2', display: 'flex', gap: 'var(--padding1)', flexDirection: 'column' }}>
          <div>
            <h2>{stories[0].title}</h2>
            <article style={{ columns: 2, columnGap: 'var(--padding2)' }}>{stories[0].article}</article>
          </div>
          <div>
            <h2>{stories[1].title}</h2>
            <article>{stories[1].article}</article>
          </div>
        </div>
        <div style={{ flex: '1' }}>
          <h2>{stories[2].title}</h2>
          <article>{stories[2].article}</article>
        </div>
      </div>
    </div>
  );
}

export default TopStories
