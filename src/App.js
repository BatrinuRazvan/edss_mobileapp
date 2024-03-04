import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Your home page component
import Earthquake from './components/disasters/Earthquake'
import Epidemic from './components/disasters/Epidemic'
import Hurricane from './components/disasters/Hurricane'
// Import other pages

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/earthquake" element={<Earthquake />} />
        <Route path="/epidemic" element={<Epidemic />} />
        <Route path="/earthquake" element={<Hurricane />} />
        {/* Define other routes */}
      </Routes>
    </Router>
  );
}

export default App;
