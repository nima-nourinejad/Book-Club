import React, { Component } from "react";
import DropDown from "./dropDown";

class Suggest extends Component {
  handleNotification = (result) => {
    if (!result) return "";
    if (result === 1)
      return (
        <p>
          <span className="badge bg-success m-2">Successfully Submitted</span>
        </p>
      );
    return (
      <p>
        <span className="badge bg-danger m-2">Failed</span>
      </p>
    );
  };
  btnClass = (btn) => {
    if (btn) {
      return "btn btn-primary mx-auto d-block";
    }
    return "btn btn-warning mx-auto d-block disabled";
  };
  btnText = (btn) => {
    if (btn) {
      return "Search";
    }
    return "Wait";
  };

  render() {
    const { favoriteBook, onInputChange, onSubmit, result, btn, searchResult, addBook } = this.props;

    return (
      <div className="card shadow-sm m-2">
        <div className="card-body" id="suggestForm">
          <div className="mb-3">
            <div className="mb-3">
              <label htmlFor="favoriteBook" className="form-label">
                Favorite Book
              </label>
              <textarea
                className="form-control"
                id="favoriteBook"
                rows="3"
                value={favoriteBook}
                onChange={(e) => onInputChange("favoriteBook", e.target.value)}
                placeholder="Share your favorite book"
              />
            </div>

            <button
              type="submit"
              className={this.btnClass(btn)}
              onClick={onSubmit}
            >
              {this.btnText(btn)}
            </button>
            <div>{this.handleNotification(result)}</div>
			<DropDown addBook={addBook} searchResult={searchResult} />
          </div>
        </div>
      </div>
    );
  }
}

export default Suggest;
