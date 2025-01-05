import React, { Component } from "react";

class OwnBook extends Component {
  state = {};
  render() {
    const { user = { name: "", books: [] }, onDelete} = this.props;
	// const onDel  = this.props.onDel;
    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Suggestions</h5>
              {user.books.map((book) => (
                <div className="card shadow-sm" key={book._id}>
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OwnBook;
