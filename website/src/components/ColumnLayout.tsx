
import type { ArticleType } from './Article';
import Article from './Article';

type Props = {
  articles: ArticleType[],
  lockedComponents?: React.ReactNode[],
  /**
   * Estimate for the number of half-articles the locked components take up in total.
   * Ex: set to "2" if they take up roughly the same space as one article.
   */
  lockedHeight?: number,
  invert?: boolean,
}

function ColumnLayout({ articles, lockedComponents = [], lockedHeight = 0, invert = false }: Props) {

  // First "lockedHeight*2" articles go in the left column. All others are split 2 to 1.
  const { left, right } = articles.reduce((acc, item, i) => {
    if (i < lockedHeight) {
      acc.left.push(item);
    } else if ((i - lockedHeight) % 3 == 2) {
      acc.right.push(item);
    } else {
      acc.left.push(item);
    }
    return acc;
  }, { left: [], right: [] } as {left: ArticleType[], right: ArticleType[]});
  const leftColumn  = invert ? right : left;
  const rightColumn = invert ? left  : right;

  return (
    <div style={{ display: 'flex', gap: 'var(--padding1)' }}>
      <div style={{ flex: invert ? '1' : '2', display: 'flex', gap: 'var(--padding1)', flexDirection: 'column' }}>
        {invert && lockedComponents}

        {leftColumn.map(a => (<Article key={a.title} article={a} columns={invert ? 1 : 2} />))}
      </div>

      <div style={{ flex: invert ? '2' : '1', display: 'flex', flexDirection: 'column', gap: 'var(--padding2)' }}>
        {!invert && lockedComponents}

        {rightColumn.map(a => (<Article key={a.title} article={a} columns={invert ? 2 : 1} />))}
      </div>
    </div>
  );
}

export default ColumnLayout
