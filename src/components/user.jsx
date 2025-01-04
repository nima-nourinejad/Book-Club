import React, { Component } from "react";

class User extends Component {
	render() {
		const { user = {name: "", books: []} } = this.props;
	  return (
		<div className="col-12 col-md-6 col-lg-4 mb-4">
		  <div className="card shadow-sm">
			<div className="card-body">
			  <h5 className="card-title">{user.name}</h5>
			  {user.books.map((book) => (
				<p key={book._id} className="card-text">{book}</p>
			  ))}
			</div>
		  </div>
		</div>
	  );
	}
  }
  

export default User;
