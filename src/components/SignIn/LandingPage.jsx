import React from 'react';
import { Login, Register } from '../'

function LandingPage() {
  return (
    <div className="App">
      <div className="header">
        <div id="header">
          <h3 className="header-name">noteify</h3>
        </div>
      </div>
      <div className="content">
          <div className="loginForm">
            <Login className="signIn"/>
            <Register className="signUp"/>
          </div>
      </div>
    </div >);
}

export default LandingPage;