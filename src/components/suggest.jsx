import React, { Component } from 'react';
import axios from "axios";

class Suggest extends Component {
  state = {
    name: "",
    favoriteBook: "",
    successMessage: "",
    errorMessage: "",
  };

  // Handle input changes for both fields
  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  // Handle form submission
  handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form refresh


    const { name, favoriteBook } = this.state;

    // Validate inputs
    if (!name || !favoriteBook) {
      this.setState({ errorMessage: "Please fill out both fields!" });
      return;
    }

    try {
      // Send POST request to backend
      const response = await axios.post("http://localhost:5000/api/favorites", {
        name,
        book: favoriteBook,
      });

      if (response.status === 201) {
        this.setState({
          successMessage: "Favorite book shared successfully!",
          errorMessage: "",
          name: "",
          favoriteBook: "",
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: "Failed to submit favorite. Please try again.",
      });
    }
  };

  render() {
    const { name, favoriteBook, successMessage, errorMessage } = this.state;

    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body" id="suggestForm">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}  // Bind input to state
                  onChange={this.handleInputChange}  // Use handleInputChange
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="favoriteBook" className="form-label">Favorite Book</label>
                <textarea
                  className="form-control"
                  id="favoriteBook"
                  rows="3"
                  value={favoriteBook}  // Bind textarea to state
                  onChange={this.handleInputChange}  // Use handleInputChange
                  placeholder="Share your favorite book"
                />
              </div>
              
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <button type="submit" className="btn btn-primary mx-auto d-block" onClick={this.handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Suggest;
