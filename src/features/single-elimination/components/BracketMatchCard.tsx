import React from "react";
import {
    formatTeam,
    type BracketMatch,
} from "../utils/singleEliminationEngine";

export type BracketMatchCardProps = {
    match: BracketMatch;
    side: "left" | "right" | "center";
    connect?: boolean;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

export default function BracketMatchCard({
    match,
    side,
    connect = true,
    onPick,
}: BracketMatchCardProps) {
    return (
        <div
            className={[
                "br-match",
                `br-match--${side}`,
                connect ? "br-match--connect" : "",
            ].join(" ")}
        >
            <button
                type="button"
                className={[
                    "br-team",
                    match.winner?.id === match.teams[0]?.id
                        ? "br-team--winner"
                        : "",
                ].join(" ")}
                disabled={!match.teams[0]}
                onClick={() => onPick(match.roundIndex, match.matchIndex, 0)}
            >
                {formatTeam(match.teams[0])}
            </button>

            <button
                type="button"
                className={[
                    "br-team",
                    match.winner?.id === match.teams[1]?.id
                        ? "br-team--winner"
                        : "",
                ].join(" ")}
                disabled={!match.teams[1]}
                onClick={() => onPick(match.roundIndex, match.matchIndex, 1)}
            >
                {formatTeam(match.teams[1])}
            </button>
        </div>
    );
}