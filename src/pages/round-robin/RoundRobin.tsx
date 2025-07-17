import React, { useEffect, useState } from "react";
import SeedInputList from "../../components/input/SeedInput";
import MatchupCard from "../../components/cards/MatchUpCards";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import { useSeedStore } from "../../lib/seeds-zustand";

type Matchup = {
    a: string;
    b: string;
    id: number;
    winner?: string;
};

const RoundRobin = () => {
    const [matchups, setMatchups] = useState<Matchup[] | null>(null);
    const { seeds, invalidIndexes, setInvalidIndexes } = useSeedStore();

    const generateMatchups = () => {
        const filled = seeds.filter((s: string) => s.trim() !== "");
        const pairs: Matchup[] = [];

        let id = 0;
        for (let i = 0; i < filled.length; i++) {
            for (let j = i + 1; j < filled.length; j++) {
                pairs.push({ a: filled[i], b: filled[j], id: id++ });
            }
        }

        for (let i = pairs.length - 1; i > 0; i--) { //fisher-yates algorithm for shuffling
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }

        setMatchups(pairs);
    };

    const handleVote = (matchupId: number, winner: string) => {
        setMatchups(
            (prev) =>
                prev?.map((m) => (m.id === matchupId ? { ...m, winner } : m)) ||
                null
        );
    };
    const allMatchupsVoted = matchups?.every((m) => m.winner) ?? false;
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;

            if (
                e.key === "Enter" &&
                !matchups &&
                activeEl instanceof HTMLInputElement &&
                activeEl.classList.contains("seed-input")
            ) {
                const validSeeds = seeds.filter((s:string) => s.trim()).length;
                if (validSeeds >= 2) {
                    e.preventDefault();
                    generateMatchups();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [seeds, matchups]);
    const hasAnyDuplicates = seeds.some(
        (s: string, i: number) => s && seeds.findIndex((x:string) => x === s) !== i
    );

    return (
        <div className="round-robin-container">
            <h2>Enter Seeds</h2>
            {!matchups && (
                <>
                    <SeedInputList/>
                    <button
                        onClick={() => {
                            if (hasAnyDuplicates) {
                                const dups: number[] = [];
                                seeds.forEach((s: string, i:number) => {
                                    if (s && seeds.findIndex((x:string) => x === s) !== i) dups.push(i);
                                });
                                setInvalidIndexes(dups);
                                return;
                            }
                            setInvalidIndexes([]);
                            generateMatchups();
                        }}
                        disabled={seeds.filter(Boolean).length < 2}
                    >
                        Generate Matchups
                    </button>
                </>
            )}
            {matchups && (
                <>
                    <div className="matchup-grid">
                        {matchups.map((matchup, index) => (
                            <MatchupCard
                                key={matchup.id}
                                matchup={matchup}
                                onVote={handleVote}
                                displayNumber={index + 1}
                            />
                        ))}
                    </div>
                    {allMatchupsVoted && (
                        <Leaderboard seeds={seeds} matchups={matchups} />
                    )}
                </>
            )}
        </div>
    );
};

export default RoundRobin;
