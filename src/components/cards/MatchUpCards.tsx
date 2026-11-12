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

    const renderChoice = (team: string, side: "a" | "b") => {
        const isWinner = decided && winner === team;
        const isLoser = decided && winner !== team;
        const initial = team.trim().charAt(0).toUpperCase() || "?";

        return (
            <button
                type="button"
                className={[
                    "rr-choice",
                    `rr-choice--${side}`,
                    isWinner ? "rr-choice--winner" : "",
                    isLoser ? "rr-choice--lost" : "",
                ].join(" ")}
                disabled={decided}
                onClick={() => !decided && onVote(id, team)}
            >
                <span className="rr-choice__avatar">
                    {isWinner ? (
                        <Check size={24} strokeWidth={2.8} />
                    ) : (
                        initial
                    )}
                </span>
                <span className="rr-choice__name">{team}</span>
                <span className="rr-choice__state">
                    {isWinner ? "Your pick" : isLoser ? "" : "Tap to pick"}
                </span>
            </button>
        );
    };

    return (
        <div className="matchup-card">
            <div className="matchup-card__head">
                <span className="matchup-card__eyebrow">
                    Matchup {displayNumber}
                </span>
                <span className="matchup-card__prompt">
                    {decided ? "Your pick is locked in" : "Which one wins?"}
                </span>
            </div>

            <div className="matchup-choices">
                {renderChoice(a, "a")}
                <span className="rr-vs">VS</span>
                {renderChoice(b, "b")}
            </div>
        </div>
    );
};

export default MatchupCard;
