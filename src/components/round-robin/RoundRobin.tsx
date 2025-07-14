import React, { useState } from "react";
import SeedInputList from "./SeedInputList";
import MatchupCard from "../cards/MatchUpCards";

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
    
        for (let i = pairs.length - 1; i > 0; i--) { //fisher-yates algorithm for shuffling
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }
    
        setMatchups(pairs);
    };
    

    const handleVote = (matchupId: number, winner: string) => {
        setMatchups(
            (prev) =>
                prev?.map((m) => (m.id === matchupId ? { ...m, winner } : m)) ||
                null
        );
    };
    const allMatchupsVoted = matchups?.every((m) => m.winner) ?? false;

    const computeLeaderboard = () => {
        const scores: { [seed: string]: number } = {};

        matchups?.forEach(({ winner }) => {
            if (winner) {
                scores[winner] = (scores[winner] || 0) + 1;
            }
        });

        const allPlayers = new Set(seeds.filter((s) => s.trim() !== ""));
        allPlayers.forEach((player) => {
            if (!scores[player]) scores[player] = 0;
        });

        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([name, score], index) => ({
                rank: index + 1,
                name,
                wins: score,
            }));
    };

    return (
        <div className="round-robin-container">
            <h2>Enter Songs</h2>
            {!matchups && (
                <>
                    <SeedInputList seeds={seeds} setSeeds={setSeeds} />
                    <button
                        onClick={generateMatchups}
                        disabled={seeds.filter(Boolean).length < 2}
                    >
                        Generate Matchups
                    </button>
                </>
            )}

            {matchups && (
                <>
                    <div className="matchup-grid">
                        {matchups.map((matchup) => (
                            <MatchupCard
                                key={matchup.id}
                                matchup={matchup}
                                onVote={handleVote}
                            />
                        ))}
                    </div>

                    {allMatchupsVoted && (
                        <div className="leaderboard">
                            <h3>Leaderboard</h3>
                            <ol>
                                {computeLeaderboard().map((entry) => (
                                    <li key={entry.name}>
                                        #{entry.rank} - {entry.name}:{" "}
                                        {entry.wins} win
                                        {entry.wins !== 1 ? "s" : ""}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RoundRobin;
