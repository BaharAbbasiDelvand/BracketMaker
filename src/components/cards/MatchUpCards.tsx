import React from "react";
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

const MatchupCard: React.FC<Props> = ({ matchup, displayNumber, onVote }) => {
    const { id, a, b, winner } = matchup;

    return (
        <div className="matchup-card">
            <h4 className="matchup-title">Matchup {displayNumber}</h4> 
            <div className="matchup-choices">
                <div className="matchup-choice-a">{a}</div>
                <div className="vs"> vs </div>
                <div className="matchup-choice-b">{b}</div>
            </div>
            {!winner ? (
                <div className="vote-buttons">
                    <button onClick={() => onVote(id, a)}>{a}</button>
                    <button onClick={() => onVote(id, b)}>{b}</button>
                </div>
            ) : (
                <p className="winner">
                    Voted: <strong>{winner}</strong>
                </p>
            )}
        </div>
    );
};

export default MatchupCard;

