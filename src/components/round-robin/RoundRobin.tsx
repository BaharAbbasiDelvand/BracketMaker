import React, { useState } from "react";
import SeedInputList from "./SeedInputList";
import MatchupCard from "./MatchUpCards";

type Matchup = {
    a: string;
    b: string;
    id: number;
    winner?: string;
};

const RoundRobin = () => {
    const [seeds, setSeeds] = useState<string[]>([""]);
    const [matchups, setMatchups] = useState<Matchup[] | null>(null);

    const generateMatchups = () => {
        const filled = seeds.filter((s) => s.trim() !== "");
        const pairs: Matchup[] = [];

        let id = 0;
        for (let i = 0; i < filled.length; i++) {
            for (let j = i + 1; j < filled.length; j++) {
                pairs.push({ a: filled[i], b: filled[j], id: id++ });
            }
        }

        setMatchups(pairs);
    };

    const handleVote = (matchupId: number, winner: string) => {
        setMatchups((prev) =>
            prev?.map((m) =>
                m.id === matchupId ? { ...m, winner } : m
            ) || null
        );
    };

    return (
        <div className="round-robin-container">
            <h2>Enter Songs</h2>
            {!matchups && (
                <>
                    <SeedInputList seeds={seeds} setSeeds={setSeeds} />
                    <button onClick={generateMatchups} disabled={seeds.filter(Boolean).length < 2}>
                        Generate Matchups
                    </button>
                </>
            )}

            {matchups && (
                <div className="matchup-grid">
                    {matchups.map((matchup) => (
                        <MatchupCard
                            key={matchup.id}
                            matchup={matchup}
                            onVote={handleVote}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoundRobin;
