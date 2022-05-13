import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/style.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import Admin from './components/admin'

function App() {
  return (
    <div className="App">
      <Router basename={'/works/loanapp'}>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
