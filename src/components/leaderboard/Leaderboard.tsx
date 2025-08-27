import React from "react";
import Carousel from "react-bootstrap/Carousel";
import './leaderboard.css';
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
        <div className="leaderboard-container">
            <h3 className="leaderboard-title">🏆 Leaderboard</h3>
            <Carousel controls indicators={false} interval={null}>
                {entries.map((entry) => (
                    <Carousel.Item key={entry.name}>
                        <div
                            className="leaderboard-entry"
                            
                        >
                            
                                <h2>#{entry.rank}</h2>
                                <h3>{entry.name}</h3>
                                <p>{entry.wins} win{entry.wins !== 1 ? "s" : ""}</p>
                        </div>
                        <Carousel.Caption>
                            <h5 className="entry-title">{entry.name}</h5>
                            <div className="entry-subtitle">
                                Currently ranked #{entry.rank} with {entry.wins} win
                                {entry.wins !== 1 ? "s" : ""}
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Leaderboard;
