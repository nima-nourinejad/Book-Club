import React, { Component } from "react";

class DropDown extends Component {
  render() {
    const { searchResult = [], addBook } = this.props;
    let index = 0;
    return (
      <div>
        <br />
        <select
          className="form-select"
          style={{ width: "100%" }}
          onChange={(e) => {
			if (e.target.value === "0") return;
			addBook(e.target.value - 1);}}
        >
          {/* {searchResult.length === 0 ? (
            <option value={index++}>No results at the moment.</option>
          ) : (
            searchResult.map((result) => (
              <option value={index++} key={result.id}>
                {result.title} by {result.author}
              </option>
            ))
          )} */}
		  <option value={index++}>After search, Select the book</option>
		  {searchResult.map((result) => (
              <option value={index++} key={result.id}>
                {result.title} by {result.author}
              </option>
            ))}
        </select>
      </div>
    );
  }
}

export default DropDown;
