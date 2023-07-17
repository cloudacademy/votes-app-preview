import logo from './logo.svg';
import './App.css';
import VoteButton from './VoteButton.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <VoteButton />
      </header>
    </div>
  );
}

export default App;
