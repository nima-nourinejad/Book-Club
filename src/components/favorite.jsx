import React, { Component } from "react";

class Favorite extends Component {
	render() {
	  return (
		<div className="col-12 col-md-6 col-lg-4 mb-4">
		  <div className="card shadow-sm">
			<div className="card-body">
			  <h5 className="card-title">{this.props.name}</h5>
			  <p className="card-text">{this.props.favorite}</p>
			</div>
		  </div>
		</div>
	  );
	}
  }
  

export default Favorite;
