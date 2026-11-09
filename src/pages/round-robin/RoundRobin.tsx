import React, { useEffect, useState, useCallback } from "react";
import SeedInputList from "../../components/input/SeedInput";
import MatchupCard from "../../components/cards/MatchUpCards";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import { useSeedStore } from "../../lib/seeds-zustand";
import { Sprout } from "lucide-react";
import "./round-robin.css";

type Matchup = {
    a: string;
    b: string;
    id: number;
    winner?: string;
};

const RoundRobin = () => {
    const [matchups, setMatchups] = useState<Matchup[] | null>(null);
    const { seeds, setInvalidIndexes } = useSeedStore();
    // pastel generator for inputs
    const pastelColorGenerator = (i: number) => {
        const hue = (i * 47) % 360;
        return `hsl(${hue} 65% 92%)`;
    };
    const generateMatchups = useCallback(() => {
        const filled = seeds.filter((s: string) => s.trim() !== "");
        const pairs: Matchup[] = [];

        let id = 0;
        for (let i = 0; i < filled.length; i++) {
            for (let j = i + 1; j < filled.length; j++) {
                pairs.push({ a: filled[i], b: filled[j], id: id++ });
            }
        }

        // fisher–yates algorithm for shuffling
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }

        setMatchups(pairs);
    }, [seeds]);

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
                const validSeeds = seeds.filter((s: string) => s.trim()).length;
                const hasDuplicates = seeds.some(
                    (s: string, i: number) =>
                        s && seeds.findIndex((x: string) => x === s) !== i
                );

                if (validSeeds >= 2) {
                    e.preventDefault();

                    if (hasDuplicates) {
                        const dups: number[] = [];
                        seeds.forEach((s: string, i: number) => {
                            if (
                                s &&
                                seeds.findIndex((x: string) => x === s) !== i
                            ) {
                                dups.push(i);
                            }
                        });
                        setInvalidIndexes(dups);
                        return;
                    }

                    setInvalidIndexes([]);
                    generateMatchups();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [seeds, matchups, setInvalidIndexes, generateMatchups]);

    const hasAnyDuplicates = seeds.some(
        (s: string, i: number) =>
            s && seeds.findIndex((x: string) => x === s) !== i
    );

    return (
        <div className="round-robin-page">
        <div className="round-robin-container">
            <h2>
                <span>Enter Seeds</span>
                <Sprout size={30} strokeWidth={2.2} />
            </h2>
            {!matchups && (
                <>
                    <SeedInputList />
                    <button
                        type="button"
                        onClick={() => {
                            if (hasAnyDuplicates) {
                                const dups: number[] = [];
                                seeds.forEach((s: string, i: number) => {
                                    if (
                                        s &&
                                        seeds.findIndex(
                                            (x: string) => x === s
                                        ) !== i
                                    ) {
                                        dups.push(i);
                                    }
                                });
                                setInvalidIndexes(dups);
                                return;
                            }
                            setInvalidIndexes([]);
                            generateMatchups();
                        }}
                        disabled={seeds.filter(Boolean).length < 2}
                        className="btn btn-primary btn-lg rounded-pill shadow-sm rr-generate"
                    >
                        Generate Matchups
                    </button>
                </>
            )}
            {matchups && (
                <>
                    <div className="matchup-grid">
                        {matchups.map((matchup, index) => (
                            <div
                                key={matchup.id}
                                className="p-3 rounded-3 shadow-sm"
                                style={{
                                    backgroundColor:
                                        pastelColorGenerator(index),
                                }}
                            >
                                <MatchupCard
                                    key={matchup.id}
                                    matchup={matchup}
                                    onVote={handleVote}
                                    displayNumber={index + 1}
                                />
                            </div>
                        ))}
                    </div>

                    {allMatchupsVoted && (
                        <Leaderboard seeds={seeds} matchups={matchups} />
                    )}
                </>
            )}
        </div>
        </div>
    );
};

export default RoundRobin;
