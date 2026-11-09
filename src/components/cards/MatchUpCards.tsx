import React from "react";
import { Check } from "lucide-react";
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

const MatchupCard: React.FC<Props> = ({ matchup, displayNumber, onVote }) => {
    const { id, a, b, winner } = matchup;
    const decided = !!winner;

    const renderChoice = (team: string) => {
        const isWinner = decided && winner === team;
        const isLoser = decided && winner !== team;

        return (
            <button
                type="button"
                className={[
                    "rr-choice",
                    isWinner ? "rr-choice--winner" : "",
                    isLoser ? "rr-choice--lost" : "",
                ].join(" ")}
                disabled={decided}
                onClick={() => !decided && onVote(id, team)}
            >
                <span className="rr-choice__name">{team}</span>
                {isWinner && (
                    <Check
                        size={18}
                        strokeWidth={2.6}
                        className="rr-choice__check"
                    />
                )}
            </button>
        );
    };

    return (
        <div className="matchup-card">
            <div className="matchup-card__head">
                <span className="matchup-card__num">
                    Matchup {displayNumber}
                </span>
                {decided && (
                    <span className="matchup-card__picked">
                        Your pick: <strong>{winner}</strong>
                    </span>
                )}
            </div>

            <div className="matchup-choices">
                {renderChoice(a)}
                <span className="vs">vs</span>
                {renderChoice(b)}
            </div>
        </div>
    );
};

export default MatchupCard;
