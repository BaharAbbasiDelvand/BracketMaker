import React, { useEffect, useState, useCallback } from "react";
import SeedInputList from "../../components/input/SeedInput";
import MatchupDeck from "../../components/cards/MatchupDeck";
import Leaderboard from "../../components/leaderboard/Leaderboard";
import SaveShareBar from "../../components/share/SaveShareBar";
import HomeLink from "../../components/nav/HomeLink";
import { useSeedStore } from "../../lib/seeds-zustand";
import { Sprout } from "lucide-react";
import "./round-robin.css";

type Matchup = {
    a: string;
    b: string;
    id: number;
    winner?: string;
};

export type RoundRobinSnapshot = {
    seeds: string[];
    matchups: Matchup[];
};

type Props = {
    initial?: RoundRobinSnapshot;
};

const RoundRobin = ({ initial }: Props) => {
    const [matchups, setMatchups] = useState<Matchup[] | null>(
        initial?.matchups ?? null
    );
    const { seeds, setInvalidIndexes, setSeeds } = useSeedStore();

    useEffect(() => {
        if (initial) {
            setSeeds(initial.seeds);
        }
    }, [initial, setSeeds]);
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
            <HomeLink />
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
                    <div className="rr-share-row">
                        <SaveShareBar
                            canSave={matchups.length > 0}
                            getPayload={() =>
                                matchups && matchups.length > 0
                                    ? {
                                          format: "round_robin",
                                          name: null,
                                          teams: seeds,
                                          state: { seeds, matchups },
                                      }
                                    : null
                            }
                        />
                    </div>

                    <MatchupDeck matchups={matchups} onVote={handleVote} />

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
