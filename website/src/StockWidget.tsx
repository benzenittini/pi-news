import { MarketOverview } from "react-ts-tradingview-widgets";

type Props = {
  stocks: string[],
};

function StockWidget({ stocks }: Props) {

  return (
    <MarketOverview
      colorTheme={"light"}
      dateRange={"1M"}
      locale={"en"}
      largeChartUrl={""}
      isTransparent={true}
      showFloatingTooltip={true}
      plotLineColorGrowing={"rgba(76, 175, 80, 1)"}
      plotLineColorFalling={"rgba(242, 54, 69, 1)"}
      gridLineColor={"rgba(41, 98, 255, 0)"}
      scaleFontColor={"#0F0F0F"}
      belowLineFillColorGrowing={"rgba(76, 175, 80, 0.12)"}
      belowLineFillColorFalling={"rgba(242, 54, 69, 0.12)"}
      belowLineFillColorGrowingBottom={"rgba(76, 175, 80, 0)"}
      belowLineFillColorFallingBottom={"rgba(242, 54, 69, 0)"}
      symbolActiveColor={"rgba(41, 98, 255, 0.12)"}
      tabs={[
        {
          title: "Watchlist",
          originalTitle: "Watchlist",
          symbols: stocks.map(stock => ({ s: stock }))
        }
      ]}
      width={"100%"}
      height={"100%"}
      showSymbolLogo={true}
      showChart={true}
    ></MarketOverview>
  );
}

export default StockWidget
