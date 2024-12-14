import React, { Component } from 'react';
import axios from 'axios';
import Favorite from './favorite';

class Others extends Component {
  // Initialize state directly without a constructor
  state = {
    favorites: [],
    error: null,
  };

  // Fetch data after the component mounts
  componentDidMount() {
    this.fetchFavorites();
  }

  // Function to fetch favorites from the API
  fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      this.setState({ favorites: response.data });
    } catch (error) {
      this.setState({ error: 'Failed to fetch favorites!' });
    }
  };

  render() {
    const { favorites, error } = this.state;

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
