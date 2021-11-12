import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import OtherPage from './Otherpage'
import Fib from './Fib'

function App() {
  return (
    <Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to="/">Home</Link>
        <Link to="/otherpage">Other Page</Link>
      </header>
        <Routes>
          <Route exact path="/" element={<Fib />} />
          <Route exact path="/otherpage" element={<OtherPage />} />
        </Routes>
    </Router>
  );
}

export default App;
