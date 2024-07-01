import React from 'react';
import Navbar from './navbar';
import Dashboard from './dashboard';
import './App.css'; // Import custom CSS

function App() {
  return (
    <div className="App">
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;
