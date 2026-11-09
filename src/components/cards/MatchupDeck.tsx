import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchupCard from "./MatchUpCards";
import "./matchupcards.css";

type Matchup = {
    id: number;
    a: string;
    b: string;
    winner?: string;
};

type Props = {
    matchups: Matchup[];
    onVote: (id: number, winner: string) => void;
};

const MatchupDeck: React.FC<Props> = ({ matchups, onVote }) => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState<"next" | "prev">("next");

    const total = matchups.length;
    const votedCount = matchups.filter((m) => m.winner).length;
    const safeCurrent = Math.min(current, total - 1);
    const matchup = matchups[safeCurrent];

    const goTo = useCallback(
        (index: number, dir: "next" | "prev") => {
            if (index < 0 || index >= total) {
                return;
            }
            setDirection(dir);
            setCurrent(index);
        },
        [total]
    );

    const goNext = useCallback(
        () => goTo(safeCurrent + 1, "next"),
        [goTo, safeCurrent]
    );
    const goPrev = useCallback(
        () => goTo(safeCurrent - 1, "prev"),
        [goTo, safeCurrent]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                goNext();
            } else if (e.key === "ArrowLeft") {
                goPrev();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goNext, goPrev]);

    const handleVote = (id: number, winner: string) => {
        onVote(id, winner);

        if (safeCurrent < total - 1) {
            window.setTimeout(() => goTo(safeCurrent + 1, "next"), 440);
        }
    };

    return (
        <div className="rr-deck">
            <div className="rr-deck__bar">
                <div className="rr-deck__count">
                    Matchup {safeCurrent + 1} <span>of {total}</span>
                </div>
                <div className="rr-deck__progress">
                    <div
                        className="rr-deck__progress-fill"
                        style={{ width: `${(votedCount / total) * 100}%` }}
                    />
                </div>
                <div className="rr-deck__voted">
                    {votedCount}/{total} voted
                </div>
            </div>

            <div className="rr-deck__stage">
                <button
                    type="button"
                    className="rr-deck__nav"
                    onClick={goPrev}
                    disabled={safeCurrent === 0}
                    aria-label="Previous matchup"
                >
                    <ChevronLeft size={22} strokeWidth={2.4} />
                </button>

                <div
                    key={safeCurrent}
                    className={`rr-deck__card rr-deck__card--${direction}`}
                >
                    <MatchupCard
                        matchup={matchup}
                        displayNumber={safeCurrent + 1}
                        onVote={handleVote}
                    />
                </div>

                <button
                    type="button"
                    className="rr-deck__nav"
                    onClick={goNext}
                    disabled={safeCurrent === total - 1}
                    aria-label="Next matchup"
                >
                    <ChevronRight size={22} strokeWidth={2.4} />
                </button>
            </div>

            <div className="rr-deck__dots">
                {matchups.map((m, index) => (
                    <button
                        type="button"
                        key={m.id}
                        className={[
                            "rr-dot",
                            index === safeCurrent ? "rr-dot--active" : "",
                            m.winner ? "rr-dot--done" : "",
                        ].join(" ")}
                        onClick={() =>
                            goTo(index, index > safeCurrent ? "next" : "prev")
                        }
                        aria-label={`Go to matchup ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MatchupDeck;
