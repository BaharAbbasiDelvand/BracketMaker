import React from "react";
import Card from 'react-bootstrap/Card';
import './matchupcards.css';

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

const colorVariants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
];

const MatchupCard: React.FC<Props> = ({ matchup, displayNumber, onVote }) => {
    const { id, a, b, winner } = matchup;

    const variantA = colorVariants[id % colorVariants.length];
    const variantB = colorVariants[(id + 1) % colorVariants.length];

    return (
        <div className="matchup-card">
            <h4 className="matchup-title">Matchup {displayNumber}</h4>
            <div className="matchup-choices">
                <div
                    className="selectable-card"
                    onClick={() => !winner && onVote(id, a)}
                >
                    <Card
                        bg={variantA}
                        text={variantA === 'light' ? 'dark' : 'white'}
                        style={{ width: '18rem' }}
                        className="mb-2"
                    >
                        <Card.Body>
                            <Card.Title>{a}</Card.Title>
                        </Card.Body>
                    </Card>
                </div>

                <div className="vs">vs</div>

                <div
                    className="selectable-card"
                    onClick={() => !winner && onVote(id, b)}
                >
                    <Card
                        bg={variantB}
                        text={variantB === 'light' ? 'dark' : 'white'}
                        style={{ width: '18rem' }}
                        className="mb-2"
                    >
                        <Card.Body>
                            <Card.Title>{b}</Card.Title>
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
