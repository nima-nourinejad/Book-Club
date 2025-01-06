import React, { Component } from "react";

class OwnBook extends Component {
  printFavorite = (user, onDelete) => {
	if (user.books.length === 0) {
	  return <p>No suggestions found.</p>;
	}
	return user.books.map((book) => (
		<div className="card shadow-sm" key={book._id}>
		  <div className="card-body">
			<p className="card-title fw-bold">{book.title}</p>
			<p className="card-title fst-italic">{`by ${book.author}`}</p>
			<button
			  className="btn btn-outline-danger"
			  onClick={() => onDelete(book._id)}
			>
			  Delete
			</button>
		  </div>
		</div>
	  ));
  }
  render() {
    const { user = { name: "", books: [] }, onDelete} = this.props;
    return (
          <div className="card shadow-sm m-2">
            <div className="card-body">
              <h5 className="card-title">Your Suggestions</h5>
			  {this.printFavorite(user, onDelete)}
            </div>
          </div>

    );
  }
}

export default OwnBook;
