import React, { Component } from 'react';
import axios from 'axios';
import Favorite from './favorite';

class Others extends Component {
  
	render() {
	  const { favorites = [] } = this.props;
  
	  return (
		<div className="container-fluid p-2" id="otherSuggestions">
		  <h2 className="text-center mt-5">Other Suggestions</h2>
		  <br />
		  <div className="row">
			{favorites.length === 0 ? (
			  <p>No favorites found.</p>
			) : (
			  favorites.map((favorite) => (
				<Favorite
				  key={favorite._id}
				  name={favorite.name}
				  favorite={favorite.book}
				/>
			  ))
			)}
		  </div>
		</div>
	  );
	}
  }

export default Others;
