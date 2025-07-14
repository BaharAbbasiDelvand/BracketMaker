import React from "react";

type Matchup = {
    a: string;
    b: string;
    id: number;
    winner?: string;
};

type Props = {
    seeds: string[];
    matchups: Matchup[];
};

const Leaderboard: React.FC<Props> = ({ seeds, matchups }) => {
    const computeLeaderboard = () => {
        const scores: { [seed: string]: number } = {};

        matchups.forEach(({ winner }) => {
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

    const entries = computeLeaderboard();

    return (
        <div className="leaderboard">
            <h3>Leaderboard</h3>
            <ol>
                {entries.map((entry) => (
                    <li key={entry.name}>
                        #{entry.rank} - {entry.name}: {entry.wins} win{entry.wins !== 1 ? "s" : ""}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;
