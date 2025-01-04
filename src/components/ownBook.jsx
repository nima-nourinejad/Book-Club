import React, { Component } from "react";

class OwnBook extends Component {
  state = {};
  render() {
    const { user = { name: "", books: [] } } = this.props;
    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Suggestions</h5>
              {user.books.map((book) => (
				<div key={book._id} className="m-2">
                <button
                  
                  type="button"
                  className="btn btn-primary position-relative"
                >
                  {book.title}
                  <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
					<button type="button" className="btn-close" aria-label="Close"></button>
                  </span>
                </button>
				<br />
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
