import React from "react";
import {
    formatTeam,
    type BracketMatch,
} from "../utils/singleEliminationEngine";

export type BracketMatchCardProps = {
    match: BracketMatch;
    isLast: boolean;
    isTop: boolean;
    elbow: number;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

export default function BracketMatchCard({
    match,
    isLast,
    isTop,
    elbow,
    onPick,
}: BracketMatchCardProps) {
    const className = [
        "se-match",
        "se-match--arm",
        isLast ? "se-match--final" : isTop ? "se-match--top" : "se-match--bottom",
    ].join(" ");

    return (
        <div
            className={className}
            style={{ "--se-elbow": `${elbow}px` } as React.CSSProperties}
        >
            {([0, 1] as const).map((teamIndex) => {
                const team = match.teams[teamIndex];
                const isWinner =
                    !!match.winner &&
                    !!team &&
                    match.winner.id === team.id;
                const isLoser = !!match.winner && !!team && !isWinner;

                return (
                    <button
                        key={teamIndex}
                        type="button"
                        className={[
                            "se-team",
                            isWinner ? "se-team--winner" : "",
                            isLoser ? "se-team--lost" : "",
                            team ? "" : "se-team--tbd",
                        ].join(" ")}
                        disabled={!team || isLoser}
                        onClick={() =>
                            onPick(match.roundIndex, match.matchIndex, teamIndex)
                        }
                    >
                        <span className="se-team__seed">
                            {team ? team.seed : ""}
                        </span>
                        <span className="se-team__name">
                            {formatTeam(team)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
