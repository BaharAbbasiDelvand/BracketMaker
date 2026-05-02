import React from "react";
import BracketColumn from "./BracketColumn";
import BracketMatchCard from "./BracketMatchCard";
import ChampionCard from "./ChampionCard";
import {
    getColumnPadding,
    getRoundTitle,
    type BracketRound,
    type Team,
} from "../utils/singleEliminationEngine";

type BracketViewProps = {
    rounds: BracketRound[];
    champion: Team | null;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

export default function BracketView({
    rounds,
    champion,
    onPick,
}: BracketViewProps) {
    const totalRounds = rounds.length;
    const sideRounds = totalRounds - 1;

    const leftColumns = Array.from({ length: sideRounds }, (_, roundIndex) => {
        const matches = rounds[roundIndex];
        const half = matches.length / 2;

        return {
            roundIndex,
            title: getRoundTitle(roundIndex, totalRounds),
            matches: matches.slice(0, half),
        };
    });

    const rightColumns = Array.from({ length: sideRounds }, (_, offset) => {
        const roundIndex = sideRounds - 1 - offset;
        const matches = rounds[roundIndex];
        const half = matches.length / 2;

        return {
            roundIndex,
            title: getRoundTitle(roundIndex, totalRounds),
            matches: matches.slice(half),
        };
    });

    if (rounds.length === 0) {
        return null;
    }

    return (
        <div className="br-scroll">
            <div className="bracket-layout">
                {leftColumns.map((column) => (
                    <BracketColumn
                        key={`left-${column.roundIndex}`}
                        title={column.title}
                        roundIndex={column.roundIndex}
                        side="left"
                        matches={column.matches}
                        onPick={onPick}
                    />
                ))}

                <div
                    className="br-center"
                    style={{
                        paddingTop: `${getColumnPadding(sideRounds - 1)}px`,
                    }}
                >
                    <div className="br-column__title">Final</div>

                    <BracketMatchCard
                        match={rounds[totalRounds - 1][0]}
                        side="center"
                        connect={false}
                        onPick={onPick}
                    />

                    <ChampionCard champion={champion} />
                </div>

                {rightColumns.map((column) => (
                    <BracketColumn
                        key={`right-${column.roundIndex}`}
                        title={column.title}
                        roundIndex={column.roundIndex}
                        side="right"
                        matches={column.matches}
                        onPick={onPick}
                    />
                ))}
            </div>
        </div>
    );
}