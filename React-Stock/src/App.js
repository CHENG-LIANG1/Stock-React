import React from "react";
import "./styles.css";
import Nav from "./components/navbar.js";
import Home from "./components/home.js";
import Stocks from "./components/stocks.js";
import Quote from "./components/quote.js";
import PriceHis from "./components/priceHistory.js";
import Login from "./components/login.js"
import Register from "./components/register.js";


import { BrowserRouter, Switch, Route } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Stocks" exact component={Stocks} />
          <Route path="/Quote" exact component={Quote} />
          <Route path="/login" exact component={Login}/>
          <Route path="/register" exact component={Register}/>
          <Route path="/:symbol" component={PriceHis}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
