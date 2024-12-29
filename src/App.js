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
  apiUserEndpoint = "api/users";
  handleInputChange = (key, value) => {
    if (key === "name" && this.state.signedIn) {
      return;
    }
    this.setState({ [key]: value });
  };
  handle_SignUp = async () => {
    const { name_signUp, user_signUp, signedIn } = this.state;
    if (!name_signUp || !user_signUp || signedIn) {
      return;
    }
    try {
      const response = await axios.post(
        `${this.backEndUrl}/${this.apiUserEndpoint}`,
        {
          name: name_signUp,
          username: user_signUp,
        }
      );
      if (response.status === 201) {
        this.setState({ signUp_result: 1, name_signUp: "", user_signUp: "" });
        setTimeout(() => {
          this.setState({ signUp_result: 0 });
        }, 2000);
      } else {
        this.setState({ signUp_result: 2 });
        setTimeout(() => {
          this.setState({ signUp_result: 0 });
        }, 2000);
      }
    } catch (error) {
      this.setState({ signUp_result: 2 });
      setTimeout(() => {
        this.setState({ signUp_result: 0 });
      }, 2000);
    }
  };
  handle_SignIn = async () => {
    const { user_signIn, signedIn } = this.state;
    if (!user_signIn || signedIn) {
      return;
    }
    try {
      const response = await axios.get(
        `${this.backEndUrl}/${this.apiUserEndpoint}/${user_signIn}`
      );
      if (response.status === 200) {
        const name = response.data.name;
        this.setState({
          signIn_result: 1,
          confirmed_user: name,
          signedIn: true,
          name: name,
        });
        setTimeout(() => {
          this.setState({ signIn_result: 0 });
        }, 2000);
      } else {
        this.setState({ signIn_result: 2 });
        setTimeout(() => {
          this.setState({ signIn_result: 0 });
        }, 2000);
      }
    } catch (error) {
      this.setState({ signIn_result: 2 });
      setTimeout(() => {
        this.setState({ signIn_result: 0 });
      }, 2000);
    }
  };

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
    try {
      const response = await axios.get(
        `${this.backEndUrl}/${this.apiUserEndpoint}`
      );
      if (response.status === 200) {
        const newFavorites = this.state.favorites.concat(response.data);
        this.setState({ favorites: newFavorites });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleSubmit = async () => {
    const { name, favoriteBook, btn, signedIn, user_signIn } = this.state;
    if (!btn || !name || !favoriteBook) {
      return;
    }
    try {
      this.setState({ btn: false });
      const response = await axios.put(
        `${this.backEndUrl}/${this.apiUserEndpoint}`,
        {
          username: user_signIn,
          book: favoriteBook,
        }
      );
	  console.log(response.status);
      if (response.status === 200) {
        if (!signedIn) {
          this.setState({ name: "" });
        }
        this.setState({
          result: 1,
          favoriteBook: "",
        });
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
