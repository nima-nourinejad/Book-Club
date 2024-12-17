import React, { Component } from "react";

class Sign extends Component {
  designSign = (
    user_signIn,
    user_signUp,
    signIn_result,
    signUp_result,
    onInputChange,
    onSignIn,
    onSignUp,
    signedIn,
    confirmed_user,
    name_signUp
  ) => {
    if (signedIn) {
      return (
        <div className="container-fluid d-flex  justify-content-center" id="sign">
		  <div className="card text-bg-success mb-3">
			<div className="card-header">Welcome {confirmed_user}</div>
			</div>
        </div>
      );
    }
    return (
      <div className="container-fluid" id="sign">
        <div className="card text-bg-secondary mb-3">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card-body" id="signUp">
                <div className="mb-3">
                  <label htmlFor="name_signUp" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name_signUp"
                    value={name_signUp}
                    onChange={(e) =>
                      onInputChange("name_signUp", e.target.value)
                    }
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="user_signUp" className="form-label">
                    User Name
                  </label>
                  <input
                    className="form-control"
                    id="user_signUp"
                    value={user_signUp}
                    onChange={(e) =>
                      onInputChange("user_signUp", e.target.value)
                    }
                    placeholder="Choose a user name"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={onSignUp}
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card-body" id="signIn">
                <div className="mb-3">
                  <label htmlFor="user_signIn" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="user_signIn"
                    value={user_signIn}
                    onChange={(e) =>
                      onInputChange("user_signIn", e.target.value)
                    }
                    placeholder="Enter your user name"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={onSignIn}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      user_signIn,
      user_signUp,
      signIn_result,
      signUp_result,
      onInputChange,
      onSignIn,
      onSignUp,
      signedIn,
      confirmed_user,
      name_signUp,
    } = this.props;
    return this.designSign(
      user_signIn,
      user_signUp,
      signIn_result,
      signUp_result,
      onInputChange,
      onSignIn,
      onSignUp,
      signedIn,
      confirmed_user,
      name_signUp
    );
  }
}

export default Sign;
