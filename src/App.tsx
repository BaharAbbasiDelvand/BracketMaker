import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RoundRobin from "./pages/round-robin/RoundRobin";
import DoubleElimination from "./pages/double-elimination/DoubleElimination";
import { Home } from "./pages/home/Home";
import SingleEliminationPage from "./pages/single-elimination/SingleElimination";
import SharedTournament from "./pages/shared/SharedTournament";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/round-robin" element={<RoundRobin />} />
                    <Route path="/single-elimination" element={<SingleEliminationPage />} />
                    <Route path="/double-elimination" element={<DoubleElimination />} />
                    <Route path="/t/:id" element={<SharedTournament />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;