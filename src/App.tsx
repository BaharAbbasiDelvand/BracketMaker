import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RoundRobin from "./pages/round-robin/RoundRobin";
import SingleElimination from "./pages/single-elimination/SingleElimination";
import { Home } from "./pages/home/Home";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/round-robin" element={<RoundRobin />} />
                    <Route
                        path="/single-elimination"
                        element={<SingleElimination />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;