import React from "react";

type Props = {
    matchup: {
        id: number;
        a: string;
        b: string;
        winner?: string;
    };
    onVote: (id: number, winner: string) => void;
};

const MatchupCard: React.FC<Props> = ({ matchup, onVote }) => {
    const { id, a, b, winner } = matchup;

    return (
        <div className="matchup-card">
            <h4>Matchup {id + 1}</h4>
            <p>{a} vs {b}</p>
            {!winner ? (
                <div className="vote-buttons">
                    <button onClick={() => onVote(id, a)}>{a}</button>
                    <button onClick={() => onVote(id, b)}>{b}</button>
                </div>
            ) : (
                <p className="winner">Voted: <strong>{winner}</strong></p>
            )}
        </div>
    );
};

export default MatchupCard;

