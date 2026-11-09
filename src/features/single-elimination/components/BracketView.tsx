import React from "react";
import { Trophy } from "lucide-react";
import BracketMatchCard from "./BracketMatchCard";
import {
    formatTeam,
    getRoundTitle,
    type BracketRound,
    type Team,
} from "../utils/singleEliminationEngine";

type BracketViewProps = {
    rounds: BracketRound[];
    champion: Team | null;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

const MATCH_H = 68;
const V_GAP = 28;
const PITCH0 = MATCH_H + V_GAP;
const CHAMP_H = 76;

const pow2 = (n: number) => Math.pow(2, n);
const padTop = (round: number) => (PITCH0 / 2) * (pow2(round) - 1);
const rowGap = (round: number) => PITCH0 * pow2(round) - MATCH_H;
const elbow = (round: number) => (PITCH0 * pow2(round)) / 2;

export default function BracketView({
    rounds,
    champion,
    onPick,
}: BracketViewProps) {
    if (rounds.length === 0) {
        return null;
    }

    const total = rounds.length;
    const lastRound = total - 1;
    const champTop = padTop(lastRound) + MATCH_H / 2 - CHAMP_H / 2;

    return (
        <div className="se-scroll">
            <div className="se-bracket">
                {rounds.map((round, roundIndex) => (
                    <div className="se-round" key={roundIndex}>
                        <div className="se-round__title">
                            {getRoundTitle(roundIndex, total)}
                        </div>
                        <div
                            className="se-round__matches"
                            style={{
                                paddingTop: `${padTop(roundIndex)}px`,
                                gap: `${rowGap(roundIndex)}px`,
                            }}
                        >
                            {round.map((match, matchIndex) => (
                                <BracketMatchCard
                                    key={match.id}
                                    match={match}
                                    isLast={roundIndex === lastRound}
                                    isTop={matchIndex % 2 === 0}
                                    elbow={elbow(roundIndex)}
                                    onPick={onPick}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                <div className="se-round se-round--champion">
                    <div className="se-round__title">Champion</div>
                    <div
                        className="se-champion-slot"
                        style={{ paddingTop: `${champTop}px` }}
                    >
                        <div
                            className={
                                champion
                                    ? "se-champion se-champion--crowned"
                                    : "se-champion"
                            }
                        >
                            <Trophy size={22} strokeWidth={2.2} />
                            <span className="se-champion__name">
                                {formatTeam(champion)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
