import './App.css';
import type { ArticleType } from './components/Article';
import ColumnLayout from './components/ColumnLayout';
import './Entertainment.css';

export type WotD = {
  word: string;
  partOfSpeech: string;
  definition: string;
};

type Props = {
  jotd: string;
  wotd: WotD;
  articles: ArticleType[];
};

function Entertainment({ jotd, wotd, articles }: Props) {

  return (
    <div className="entertainment">
      <h1>Entertainment and Lifestyle</h1>

      <ColumnLayout
        articles={articles}
        lockedHeight={2}
        lockedComponents={[
          (<div key="weather" style={{ maxWidth: '329px' }}>
            <div id="ww_5eb47bc65c244" v='1.3' loc='id' a='{"t":"responsive","lang":"en","sl_lpl":1,"ids":["wl595"],"font":"Times","sl_ics":"one","sl_sot":"fahrenheit","cl_bkg":"#FFFFFF00","cl_font":"#000000","cl_cloud":"#d4d4d4","cl_persp":"#2196F3","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722","cl_odd":"#00000000"}'>More forecasts: <a href="https://oneweather.org/new_york_city/30_days/" id="ww_5eb47bc65c244_u" target="_blank">Weather New York 30 days</a></div><script async src="https://app3.weatherwidget.org/js/?id=ww_5eb47bc65c244"></script>
          </div>),

          (<div key="jotd" className="infobox">
            <h4>Joke of the Day</h4>
            <p>{jotd}</p>
          </div>),

          (<div key="wotd" className="infobox">
            <h4>Word of the Day</h4>
            <p><span style={{ textDecoration: 'underline' }}>{wotd.word.replaceAll("*", "")}</span> <span style={{ fontStyle: 'italic' }}>({wotd.partOfSpeech})</span> : <span>{wotd.definition}</span></p>
          </div>),
        ]}
      />

    </div>
  );
}

export default Entertainment
