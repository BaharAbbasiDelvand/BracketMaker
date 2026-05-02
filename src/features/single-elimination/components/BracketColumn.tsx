import React from "react";
import BracketMatchCard from "./BracketMatchCard";
import {
    getColumnGap,
    getColumnPadding,
    type BracketMatch,
} from "../utils/singleEliminationEngine";

export type BracketColumnProps = {
    title: string;
    roundIndex: number;
    side: "left" | "right";
    matches: BracketMatch[];
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

export default function BracketColumn({
    title,
    roundIndex,
    side,
    matches,
    onPick,
}: BracketColumnProps) {
    return (
        <div
            className="br-column"
            style={{
                paddingTop: `${getColumnPadding(roundIndex)}px`,
            }}
        >
            <div className="br-column__title">{title}</div>

            <div
                className="br-column__matches"
                style={{
                    gap: `${getColumnGap(roundIndex)}px`,
                }}
            >
                {matches.map((match) => (
                    <BracketMatchCard
                        key={match.id}
                        match={match}
                        side={side}
                        connect
                        onPick={onPick}
                    />
                ))}
            </div>
        </div>
    );
}