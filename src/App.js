import "./App.css";
import React, { Component } from "react";
import NavBar from "./components/navBar";
import Top from "./components/top";
import Suggest from "./components/suggest";
import Others from "./components/others";

class App extends Component {
  render() {
    return (
      <div style={{ minHeight: "150vh" }} className="container-fluid bg-dark text-white p-0">
        <div className="container">
          <NavBar />
          <Top />
		  <Suggest />
		  <br/>
		  <br/>
		  <Others />
        </div>
      </div>
    );
  }
}

export default App;
