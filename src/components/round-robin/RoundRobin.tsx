import React, { useState } from "react";
import SeedInputList from "./SeedInputList";
import MatchupList from "./MatchUpList";

const RoundRobin = () => {
    const [seeds, setSeeds] = useState<string[]>([""]);
    const [matchups, setMatchups] = useState<[string, string][] | null>(null);

    const generateMatchups = () => {
        const filled = seeds.filter((s) => s.trim() !== "");
        const pairs: [string, string][] = [];

        for (let i = 0; i < filled.length; i++) {
            for (let j = i + 1; j < filled.length; j++) {
                pairs.push([filled[i], filled[j]]);
            }
        }

        setMatchups(pairs);
    };

    return (
        <div className="round-robin-container">
            <h2>Enter Songs</h2>
            <SeedInputList seeds={seeds} setSeeds={setSeeds} />
            <button onClick={generateMatchups} disabled={seeds.filter(Boolean).length < 2}>
                Generate Matchups
            </button>
            {matchups && <MatchupList matchups={matchups} />}
        </div>
    );
};

export default RoundRobin;
