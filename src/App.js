import "./App.css";
import React, { Component } from "react";
import NavBar from "./components/navBar";
import Top from "./components/top";
import Suggest from "./components/suggest";
import Sign from "./components/sign";
import Allusers from "./components/allusers";
import OwnBook from "./components/ownBook";
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
    allUsers: [],
    fullSignedInUser: {},
    searchTitle: "",
    searchResult: [],
    searched: false,
  };

  backEndUrl = "https://book-club-qr21.onrender.com";
  apiEndpoint = "api/favorites";
  apiUserEndpoint = "api/users";
  apiNew = "api/new";
  apiGoogle = "api/google";
  apiAdd = "api/add";

  addBook = async (value) => {
    console.log(`value: ${value}`);
    const { signedIn, user_signIn, favoriteBook, searched, searchResult } =
      this.state;
    if (!signedIn || !searched || !favoriteBook) return;
    console.log("I am here");
    try {
      const title = searchResult[value].title;
      const author = searchResult[value].author;
      const response = await axios.post(`${this.backEndUrl}/${this.apiAdd}`, {
        username: user_signIn,
        title: title,
        author: author,
      });
      if (response.status === 200) {
        this.setState({ favoriteBook: "", searched: false, searchResult: [] });
        this.fetchFavorites();
        this.fetchOwnBook();
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchOwnBook = async () => {
    const { signedIn, user_signIn } = this.state;
    if (!signedIn) {
      return;
    }
    try {
      const response = await axios.get(
        `${this.backEndUrl}/${this.apiNew}/${user_signIn}`
      );
      if (response.status === 200) {
        this.setState({ fullSignedInUser: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };
  handle_search = async () => {
    const { searchTitle } = this.state;
    console.log(`searchTitle: ${searchTitle}`);
    if (!searchTitle) return;
    try {
      this.setState({ searchResult: [] });
      const formattedTitle = searchTitle.replaceAll(" ", "+");
      console.log(`formattedTitle: ${formattedTitle}`);
      console.log(
        `I will send a get request to ${this.backEndUrl}/${this.apiGoogle}/${formattedTitle}`
      );
      const response = await axios.get(
        `${this.backEndUrl}/${this.apiGoogle}/${formattedTitle}`
      );
      console.log(`response status: ${response.status}`);
      console.log(`response: ${response}`);
      if (response.status === 200) {
        this.setState({ searchResult: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleInputChange = (key, value) => {
    if (key === "name" && this.state.signedIn) {
      return;
    }
    this.setState({ [key]: value });
  };
  handle_delete = async (book_id) => {
    const { signedIn, user_signIn } = this.state;
    if (!signedIn) {
      return;
    }
    try {
      const response = await axios.delete(
        `${this.backEndUrl}/${this.apiNew}/${user_signIn}/${book_id}`
      );
      if (response.status === 200) {
        try {
          this.fetchFavorites();
          this.fetchOwnBook();
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  handle_SignUp = async () => {
    const { name_signUp, user_signUp, signedIn } = this.state;
    if (!name_signUp || !user_signUp || signedIn) {
      return;
    }
    try {
      const response = await axios.post(`${this.backEndUrl}/${this.apiNew}`, {
        name: name_signUp,
        username: user_signUp,
      });
      if (response.status === 201) {
        this.setState({ signUp_result: 1, name_signUp: "", user_signUp: "" });
        this.fetchFavorites();
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
        `${this.backEndUrl}/${this.apiNew}/${user_signIn}`
      );
      if (response.status === 200) {
        const name = response.data.name;
        this.setState({
          signIn_result: 1,
          confirmed_user: name,
          signedIn: true,
          name: name,
          user_signIn: user_signIn,
          fullSignedInUser: response.data,
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
    // try {
    //   const response = await axios.get(
    //     `${this.backEndUrl}/${this.apiUserEndpoint}`
    //   );
    //   if (response.status === 200) {
    //     this.setState({ favorites: response.data });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    try {
      const response = await axios.get(`${this.backEndUrl}/${this.apiNew}`);
      if (response.status === 200) {
        this.setState({ allUsers: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handle_SignOut = () => {
    this.setState({
		name: "",
		favoriteBook: "",
		result: 0,
		btn: true,
		signedIn: false,
		confirmed_user: "",
		user_signIn: "",
		user_signUp: "",
		signIn_result: 0,
		signUp_result: 0,
		name_signUp: "",
		fullSignedInUser: {},
		searchTitle: "",
		searchResult: [],
		searched: false,
    });
	this.fetchFavorites();
  };

  handleSubmit = async () => {
    const { name, favoriteBook, btn, signedIn, user_signIn } = this.state;
    if (!btn || !name || !favoriteBook || !signedIn) {
      return;
    }
    try {
      this.setState({ searchResult: [], searched: true });
      const formattedTitle = favoriteBook.replaceAll(" ", "+");
      const response = await axios.get(
        `${this.backEndUrl}/${this.apiGoogle}/${formattedTitle}`
      );
      if (response.status === 200) {
        this.setState({ searchResult: response.data });
      }
    } catch (error) {
      console.error(error);
    }
    // try {
    //   this.setState({ btn: false });
    //   const response = await axios.put(`${this.backEndUrl}/${this.apiNew}`, {
    //     username: user_signIn,
    //     book: favoriteBook,
    //   });
    //   if (response.status === 200) {
    //     if (!signedIn) {
    //       this.setState({ name: "" });
    //     }
    //     this.setState({
    //       result: 1,
    //       favoriteBook: "",
    //     });
    //     setTimeout(() => {
    //       this.setState({ result: 0, btn: true });
    //     }, 2000);
    //     this.fetchFavorites();
    //     this.fetchOwnBook();
    //   }
    // } catch (error) {
    //   this.setState({ result: 2 });
    //   setTimeout(() => {
    //     this.setState({ result: 0, btn: true });
    //   }, 2000);
    // }
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
          {/* <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 d-flex justify-content-center">
                <Search
                  searchTitle={this.state.searchTitle}
                  onInputChange={this.handleInputChange}
                  onSearch={this.handle_search}
                />
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-center">
                <Result searchResult={this.state.searchResult} />
              </div>
            </div>
          </div> */}
          <Sign
            user_signIn={this.state.user_signIn}
            user_signUp={this.state.user_signUp}
            onInputChange={this.handleInputChange}
            onSignIn={this.handle_SignIn}
            onSignUp={this.handle_SignUp}
            onSignOut={this.handle_SignOut}
            signIn_result={this.state.signIn_result}
            signUp_result={this.state.signUp_result}
            signedIn={this.state.signedIn}
            confirmed_user={this.state.confirmed_user}
            name_signUp={this.state.name_signUp}
          />
          {this.state.signedIn ? (
            <div className="container-fluid">
              <div className="row align-items-start">
                <div className="col-12 col-md-6 d-flex justify-content-center">
                  <Suggest
                    name={this.state.name}
                    favoriteBook={this.state.favoriteBook}
                    onInputChange={this.handleInputChange}
                    onSubmit={this.handleSubmit}
                    result={this.state.result}
                    btn={this.state.btn}
                    searchResult={this.state.searchResult}
                    addBook={this.addBook}
					searched = {this.state.searched}
                  />
                </div>
                <div className="col-12 col-md-6 d-flex justify-content-center">
                  <OwnBook
                    user={this.state.fullSignedInUser}
                    onDelete={this.handle_delete}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <h1>
                <span className="badge bg-danger">Please sign in first</span>
              </h1>
            </div>
          )}
          <div>
            <Allusers users={this.state.allUsers} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
