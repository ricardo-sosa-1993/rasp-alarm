import React, { useEffect } from 'react';
import { setupAlarm } from './services/alarm-setup';
import './App.css';


function App() {
  useEffect(() => {
    setupAlarm();
  }, []);

  return (
    <div className="App">
      <h1 className="App-title">Pi Alarm</h1>
    </div>
  );
}

export default App;
