import React, { Component } from "react";

class User extends Component {
  printFavorite = (user) => {
    if (user.books.length === 0) {
      return <p>No suggestions found.</p>;
    }
    return user.books.map((book) => (
      <div className="card shadow-sm" key={book._id}>
        <div className="card-body">
          <p className="card-title fw-bold">{book.title}</p>
          <p className="card-title fst-italic">{`by ${book.author}`}</p>
        </div>
      </div>
    ));
  };
  render() {
    const { user = { name: "", books: [] } } = this.props;
    return (
      <div className="col-12 col-md-6 col-lg-4 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            {this.printFavorite(user)}
          </div>
        </div>
      </div>
    );
  }
}

export default User;
