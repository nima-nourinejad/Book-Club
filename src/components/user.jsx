import React, { Component } from "react";

class User extends Component {
  printFavorite = (user) => {
    if (user.books.length === 0) {
      return <p>No suggestions found.</p>;
    }
    return user.books.map((book) => (
      <p key={book._id} className="card-text">
        {book.title}
      </p>
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
