import React, { Component } from "react";

class DropDown extends Component {
  render() {
	const { searchResult = [] } = this.props;
	let index = 0;
	return (
	  <div>
		<br />
		<h7>Sealect the book you want to suggest</h7>
		<br />
		<select className="form-select" style={{ width: "100%" }}>
		  {searchResult.length === 0 ? (
			<option value={index++}>No results at the moment.</option>
		  ) : (
			searchResult.map((result) => (
			  <option value={index++} key={result.id}>
				{result.title} by {result.Author}
			  </option>
			))
		  )}
		</select>
	  </div>
	);
  }
}

export default DropDown;
