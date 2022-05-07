import React from 'react';
import { Login, Register, Header } from '../'

function LandingPage() {
  return (
    <div className="App">
      <div className="header">
        <Header
        ></Header>
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