import './App.css'
import type { ArticleType } from './components/Article';
import ColumnLayout from './components/ColumnLayout';
import StockWidget from './StockWidget';

type Props = {
  stocks: string[],
  news: ArticleType[],
}

function Finance({ stocks, news }: Props) {

  const widgetHeight = 200 + 60*stocks.length;

  return (
    <div className="finance">
      <h1>Business and Finance</h1>

      <ColumnLayout
        articles={news}
        lockedComponents={[
          <div key="stock-widget" style={{ minHeight: widgetHeight + 32 + 'px' }}>
            <div style={{ float: 'right', width: '100%', height: widgetHeight + 'px' }}>
              <StockWidget stocks={stocks} />
            </div>
          </div>
        ]}
        lockedHeight={1}
        invert={true}
      />

    </div>
  );
}

export default Finance
