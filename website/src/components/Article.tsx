
export type ArticleType = {
  title: string;
  content: string;
};


export type ArticleError = {
  content: string;
}

export type Props = {
  article: ArticleType;
  columns?: number;
};

function Article({ article, columns = 2 }: Props) {

  return (
    <article>
      <h2>{article.title}</h2>
      <p style={{ columns, columnGap: 'var(--padding2)' }}>{article.content}</p>
    </article>
  );
}

export default Article;
