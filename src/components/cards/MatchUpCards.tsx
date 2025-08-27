import React from "react";
import Card from "react-bootstrap/Card";
import "./matchupcards.css";

type Props = {
    matchup: {
        id: number;
        a: string;
        b: string;
        winner?: string;
    };
    displayNumber: number;
    onVote: (id: number, winner: string) => void;
};

// pastel generator
const pastelColorGenerator = (i: number) => {
    const hue = (i * 47) % 360;
    return `hsl(${hue}, 70%, 85%)`; 
};

const MatchupCard: React.FC<Props> = ({ matchup, displayNumber, onVote }) => {
    const { id, a, b, winner } = matchup;

    const colorA = pastelColorGenerator(id * 2);
    const colorB = pastelColorGenerator(id * 2 + 1);

    return (
        <div className="matchup-card">
            <h4 className="matchup-title">Matchup {displayNumber}</h4>
            <div className="matchup-choices">
                <div
                    className="selectable-card"
                    onClick={() => !winner && onVote(id, a)}
                >
                    <Card
                        style={{
                            width: "18rem",
                            backgroundColor: colorA,
                            border: "none",
                        }}
                        className="mb-2 shadow-sm rounded-3"
                    >
                        <Card.Body>
                            <Card.Title style={{ color: "#333" }}>
                                {a}
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </div>

                <div className="vs">vs</div>

                <div
                    className="selectable-card"
                    onClick={() => !winner && onVote(id, b)}
                >
                    <Card
                        style={{
                            width: "18rem",
                            backgroundColor: colorB,
                            border: "none",
                        }}
                        className="mb-2 shadow-sm rounded-3"
                    >
                        <Card.Body>
                            <Card.Title style={{ color: "#333" }}>
                                {b}
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {winner && (
                <p className="winner">
                    Voted: <strong>{winner}</strong>
                </p>
            )}
        </div>
    );
};

export default MatchupCard;
