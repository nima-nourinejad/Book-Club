import React, { Component } from "react";

class Suggest extends Component {
  handleNotification = (result) => {
    if (!result) return "";
    if (result == 1)
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
    return "btn btn-danger mx-auto d-block disabled";
  };
  btnText = (btn) => {
	if (btn) {
	  return "Submit";
	}
	return "Wait";
  }

  render() {
    const { name, favoriteBook, onInputChange, onSubmit, result, btn } =
      this.props;

    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body" id="suggestForm">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => onInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="favoriteBook" className="form-label">
                  Favorite Book
                </label>
                <textarea
                  className="form-control"
                  id="favoriteBook"
                  rows="3"
                  value={favoriteBook}
                  onChange={(e) =>
                    onInputChange("favoriteBook", e.target.value)
                  }
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Suggest;
