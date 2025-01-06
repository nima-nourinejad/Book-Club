import React, { Component } from "react";

class Result extends Component {
  render() {
    const { searchResult = [] } = this.props;
	console.log(`searchResult: ${searchResult}`);
	console.log('searchResult is an array: ${Array.isArray(searchResult)}');
	console.log(`searchResult.length: ${searchResult.length}`);
    return (
      <div className="container-fluid p-2" id="allUsers">
        <h2 className="text-center mt-5">Search Result</h2>
        <br />
        <div className="row">
          {searchResult.length === 0 ? (
            <p>No results at the moment.</p>
          ) : (
            searchResult.map((result) => (
              <div key={result.id}>
                <p>{result.title}</p>
                <p>{result.Author}</p>
                <br />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Result;
