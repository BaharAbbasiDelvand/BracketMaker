import React from "react";
import "./App.css";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RoundRobin from "./components/round-robin/RoundRobin";
import SingleElimination from "./components/single-elimination/SingleElimination";
import { Home } from "./components/home/Home";
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
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
