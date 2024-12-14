import "./App.css";
import React, { Component } from "react";
import NavBar from "./components/navBar";
import Top from "./components/top";
import Suggest from "./components/suggest";
import Others from "./components/others";
import axios from "axios";

class App extends Component {
  state = {
    name: "",
    favoriteBook: "",
    favorites: [],
    result: 0,
  };
  handleInputChange = (key, value) => {
    if (key === "name") {
      this.setState({ name: value });
    }
    if (key === "favoriteBook") {
      this.setState({ favoriteBook: value });
    }
  };
  componentDidMount() {
    this.fetchFavorites();
  }
  fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/favorites");
      if (response.status === 200) {
        this.setState({ favorites: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleSubmit = async () => {
    const { name, favoriteBook } = this.state;
    if (!name || !favoriteBook) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/favorites", {
        name,
        book: favoriteBook,
      });
      if (response.status === 201) {
        this.setState({
          name: "",
          favoriteBook: "",
        });
        this.setState({ result: 1 });
        setTimeout(() => {
          this.setState({ result: 0 });
        }, 2000);
        this.fetchFavorites();
      }
    } catch (error) {
      console.error(error);
      this.setState({ result: 2 });
      setTimeout(() => {
        this.setState({ result: 0 }, 2000);
      });
    }
  };

  render() {
    return (
      <div
        style={{ minHeight: "150vh" }}
        className="container-fluid bg-dark text-white p-0"
      >
        <div className="container">
          <NavBar />
          <Top />
          <Suggest
            name={this.state.name}
            favoriteBook={this.state.favoriteBook}
            onInputChange={this.handleInputChange}
            onSubmit={this.handleSubmit}
			result={this.state.result}
          />
          <Others favorites={this.state.favorites} />
        </div>
      </div>
    );
  }
}

export default App;
