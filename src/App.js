import "./App.css";
import React, { Component } from "react";
import NavBar from "./components/navBar";
import Top from "./components/top";
import Suggest from "./components/suggest";
import Others from "./components/others";
import Sign from "./components/sign";
import axios from "axios";

class App extends Component {
  state = {
    name: "",
    favoriteBook: "",
    favorites: [],
    result: 0,
    btn: true,
	signedIn: false,
	confirmed_user: "",
	user_signIn: "",
	user_signUp: "",
	signIn_result: 0,
	signUp_result: 0,
	name_signUp: "",
  };
  backEndUrl = "https://book-club-qr21.onrender.com";
  apiEndpoint = "api/favorites";
  handleInputChange = (key, value) => {
    if (key === "name") {
      this.setState({ name: value });
    }
    if (key === "favoriteBook") {
      this.setState({ favoriteBook: value });
    }
	if (key === "user_signIn") {
		this.setState({ user_signIn: value });
	}
	if (key === "user_signUp") {
		this.setState({ user_signUp: value });
	}
	if (key === "name_signUp") {
		this.setState({ name_signUp: value });
	}
  };
  handle_SignIn = async () => {};
  handle_SignUp = async () => {};
  componentDidMount() {
    this.fetchFavorites();
  }
  fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `${this.backEndUrl}/${this.apiEndpoint}`
      );
      if (response.status === 200) {
        this.setState({ favorites: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleSubmit = async () => {
    const { name, favoriteBook, btn } = this.state;
    if (!btn || !name || !favoriteBook) {
      return;
    }
    try {
      this.setState({ btn: false });
      const response = await axios.post(
        `${this.backEndUrl}/${this.apiEndpoint}`,
        {
          name,
          book: favoriteBook,
        }
      );
      if (response.status === 201) {
        this.setState({
          name: "",
          favoriteBook: "",
        });
        this.setState({ result: 1 });
        setTimeout(() => {
          this.setState({ result: 0, btn: true });
        }, 2000);
        this.fetchFavorites();
      }
    } catch (error) {
      this.setState({ result: 2 });
      setTimeout(() => {
        this.setState({ result: 0, btn: true });
      }, 2000);
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
		  <Sign
		  	user_signIn={this.state.user_signIn}
			user_signUp={this.state.user_signUp}
			onInputChange={this.handleInputChange}
			onSignIn={this.handle_SignIn}
			onSignUp={this.handle_SignUp}
			signIn_result={this.state.signIn_result}
			signUp_result={this.state.signUp_result}
			signedIn={this.state.signedIn}
			confirmed_user={this.state.confirmed_user}
			name_signUp={this.state.name_signUp}
		  />
          <Suggest
            name={this.state.name}
            favoriteBook={this.state.favoriteBook}
            onInputChange={this.handleInputChange}
            onSubmit={this.handleSubmit}
            result={this.state.result}
			btn={this.state.btn}
          />
          <Others favorites={this.state.favorites} />
        </div>
      </div>
    );
  }
}

export default App;
