import React from "react";
import { Trophy } from "lucide-react";
import "./leaderboard.css";

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
            <div className="leaderboard__head">
                <Trophy size={22} strokeWidth={2.2} />
                <h3>Leaderboard</h3>
            </div>

            <ol className="leaderboard__list">
                {entries.map((entry) => (
                    <li
                        key={entry.name}
                        className={`lb-row lb-row--${
                            entry.rank <= 3 ? entry.rank : "rest"
                        }`}
                    >
                        <span className="lb-row__rank">{entry.rank}</span>
                        <span className="lb-row__name">{entry.name}</span>
                        <span className="lb-row__wins">
                            {entry.wins} win{entry.wins !== 1 ? "s" : ""}
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;
