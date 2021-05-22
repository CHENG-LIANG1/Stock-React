import React from "react";
import logo from "./stocks.png";

function Home() {
  return (
    <div>
      <div className="stockPrices">
        <h1>Stock Prices</h1>
        <img src={logo} alt="Logo" />
      </div>

      <div className="welcome">
        <p>
          Welcome to the Stock Analyst portal. Click on Stocks to see the
          available companies, Quote to get the latest price information by
          stock symbol.
        </p>
        <p>
            If you are a registered member, click on the rows in stocks tab to view price history.
        </p>
      </div>
    </div>
  );
}
export default Home;
