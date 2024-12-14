import React, { Component } from 'react';

class NavBar extends Component {
	render() { 
		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
            <a className="navbar-brand" href="#">Book Haven</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#suggestForm">Your Favorite</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#otherSuggestions">Others suggestions</a>
                    </li>
                </ul>
            </div>
        </nav>
		);
	}
}
 
export default NavBar;