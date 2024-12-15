import React, { Component } from "react";

class Top extends Component {
  render() {
    return (
      <div className="row mb-5 text-center">
        <div className="col-12">
          <img
            src="https://nima-nourinejad.github.io/Book-Club/images/topImage.jpg"
            className="img-fluid rounded"
            alt="top"
          />

          <h1 className="mt-4">Welcome to Book Haven</h1>
          <p className="lead">
            Discover and share the stories that inspired you
          </p>
        </div>
      </div>
    );
  }
}

export default Top;
