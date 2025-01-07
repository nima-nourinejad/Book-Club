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
            if (e.target.value) addBook(e.target.value);
          }}
        >
          <option value="" style={{ color: "grey" }} disabled selected>
            Select your book
          </option>
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
