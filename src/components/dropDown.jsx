import React, { Component } from "react";

class DropDown extends Component {
  render() {
    const { searchResult = [], addBook } = this.props;
    let index = 0;
    return (
      <div>
        <br />
        <p>Sealect the book you want to suggest</p>
        <br />
        <select
          className="form-select"
          style={{ width: "100%" }}
          onChange={(e) => addBook(e.target.value)}
        >
          {searchResult.length === 0 ? (
            <option value={index++}>No results at the moment.</option>
          ) : (
            searchResult.map((result) => (
              <option value={index++} key={result.id}>
                {result.title} by {result.author}
              </option>
            ))
          )}
        </select>
      </div>
    );
  }
}

export default DropDown;
