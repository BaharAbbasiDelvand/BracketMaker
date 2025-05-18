import React from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RoundRobin from "./components/round-robin/RoundRobin";
import SingleElimination from "./components/single-elimination/SingleElimination";

function App() {
    return (
        <Router>
            <div className="App">
                <h1>Song Ranking</h1>

                <Link to="/round-robin">
                    <Button variant="danger" className="m-2">
                        Round-Robin
                    </Button>
                </Link>
                <Link to="/single-elimination">
                    <Button variant="info" className="m-2">
                        Single-Elimination Bracket
                    </Button>
                </Link>

                <Routes>
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
