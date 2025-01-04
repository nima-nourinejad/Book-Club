import React, { Component } from "react";
import User from "./user";

class Allusers extends Component {
  render() {
    const { users = [] } = this.props;

    return (
      <div className="container-fluid p-2" id="allUsers">
        <h2 className="text-center mt-5">Suggestions</h2>
        <br />
        <div className="row">
          {users.length === 0 ? (
            <p>No users at the moment.</p>
          ) : (
            users.map((user) => (
              <User
                key={user._id}
                user={user}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Allusers;
