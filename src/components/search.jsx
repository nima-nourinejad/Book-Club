import React, { Component } from "react";

class Search extends Component {
  render() {
    const { searchTitle, onInputChange, onSearch } = this.props;
    return (
      <div className="card shadow-sm m-2">
        <div className="card-body" id="searchForm">
          <div className="mb-3">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <textarea
                className="form-control"
                id="title"
                rows="3"
                value={searchTitle}
                onChange={(e) => onInputChange("searchTitle", e.target.value)}
                placeholder="Enter a title"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary mx-auto d-block"
              onClick={onSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
