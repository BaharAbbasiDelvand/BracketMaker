import { useMemo, useState } from "react";
import {
    ALLOWED_TEAM_COUNTS,
    type BracketRound,
    type Team,
    buildInitialBracket,
    getChampion,
    pickMatchWinner,
} from "../utils/singleEliminationEngine";

type Step = "setup" | "bracket";

type UseSingleEliminationTournamentResult = {
    step: Step;
    teamCount: number;
    teamNames: string[];
    rounds: BracketRound[];
    champion: Team | null;
    allowedTeamCounts: readonly number[];
    handleTeamCountChange: (count: number) => void;
    handleTeamNameChange: (index: number, value: string) => void;
    handleGenerate: () => void;
    handleBack: () => void;
    handlePickWinner: (
        roundIndex: number,
        matchIndex: number,
        teamIndex: 0 | 1
    ) => void;
};

export function useSingleEliminationTournament(): UseSingleEliminationTournamentResult {
    const [step, setStep] = useState<Step>("setup");
    const [teamCount, setTeamCount] = useState<number>(16);
    const [teamNames, setTeamNames] = useState<string[]>(
        Array.from({ length: 16 }, (_, index) => `Team ${index + 1}`)
    );
    const [rounds, setRounds] = useState<BracketRound[]>([]);

    const champion = useMemo(() => getChampion(rounds), [rounds]);

    const handleTeamCountChange = (count: number) => {
        const nextCount = ALLOWED_TEAM_COUNTS.includes(
            count as (typeof ALLOWED_TEAM_COUNTS)[number]
        )
            ? count
            : 16;

        setTeamCount(nextCount);
        setTeamNames((current) =>
            Array.from(
                { length: nextCount },
                (_, index) => current[index] ?? `Team ${index + 1}`
            )
        );
    };

    const handleTeamNameChange = (index: number, value: string) => {
        setTeamNames((current) => {
            const next = [...current];
            next[index] = value;
            return next;
        });
    };

    const handleGenerate = () => {
        setRounds(buildInitialBracket(teamNames));
        setStep("bracket");
    };

    const handleBack = () => {
        setRounds([]);
        setStep("setup");
    };

    const handlePickWinner = (
        roundIndex: number,
        matchIndex: number,
        teamIndex: 0 | 1
    ) => {
        setRounds((current) =>
            pickMatchWinner(current, roundIndex, matchIndex, teamIndex)
        );
    };

    return {
        step,
        teamCount,
        teamNames,
        rounds,
        champion,
        allowedTeamCounts: ALLOWED_TEAM_COUNTS,
        handleTeamCountChange,
        handleTeamNameChange,
        handleGenerate,
        handleBack,
        handlePickWinner,
    };
}