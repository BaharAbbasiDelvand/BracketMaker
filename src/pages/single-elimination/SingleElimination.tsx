import React, { useState } from "react";
import { Shuffle, Users, Pencil, ChevronDown } from "lucide-react";
import BracketView from "../../features/single-elimination/components/BracketView";
import {
    useSingleEliminationTournament,
    type SingleEliminationSnapshot,
} from "../../features/single-elimination/hooks/useSingleEliminationTournament";
import SaveShareBar from "../../components/share/SaveShareBar";
import HomeLink from "../../components/nav/HomeLink";
import "./single-elimination.css";

type Props = {
    initial?: SingleEliminationSnapshot;
};

export default function SingleEliminationPage({ initial }: Props) {
    const {
        teamCount,
        teamNames,
        rounds,
        champion,
        allowedTeamCounts,
        handleTeamCountChange,
        handleTeamNameChange,
        handleGenerate,
        handlePickWinner,
    } = useSingleEliminationTournament(initial);

    const [showNames, setShowNames] = useState(true);
    const hasBracket = rounds.length > 0;

    const onGenerate = () => {
        handleGenerate();
        setShowNames(false);
    };

    return (
        <div className="se-page">
            <div className="se-inner">
                <HomeLink />
                <h1 className="se-title">
                    <span>Single Elimination</span>
                </h1>

                <section className="se-controls">
                    <div className="se-controls__bar">
                        <div className="se-field">
                            <label htmlFor="se-team-count">
                                <Users size={16} strokeWidth={2.2} />
                                Number of teams
                            </label>
                            <select
                                id="se-team-count"
                                className="se-select"
                                value={teamCount}
                                onChange={(e) =>
                                    handleTeamCountChange(Number(e.target.value))
                                }
                            >
                                {allowedTeamCounts.map((count) => (
                                    <option key={count} value={count}>
                                        {count} teams
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="se-controls__actions">
                            <button
                                type="button"
                                className="se-names-toggle"
                                onClick={() => setShowNames((v) => !v)}
                            >
                                <Pencil size={15} strokeWidth={2.2} />
                                {showNames ? "Hide names" : "Edit names"}
                                <ChevronDown
                                    size={15}
                                    strokeWidth={2.4}
                                    className={
                                        showNames
                                            ? "se-chevron se-chevron--open"
                                            : "se-chevron"
                                    }
                                />
                            </button>

                            <button
                                type="button"
                                className="se-generate"
                                onClick={onGenerate}
                            >
                                <Shuffle size={18} strokeWidth={2.3} />
                                {hasBracket
                                    ? "Reshuffle bracket"
                                    : "Generate bracket"}
                            </button>

                            <SaveShareBar
                                canSave={hasBracket}
                                getPayload={() =>
                                    hasBracket
                                        ? {
                                              format: "single_elim",
                                              name: null,
                                              teams: teamNames,
                                              state: {
                                                  teamCount,
                                                  teamNames,
                                                  rounds,
                                              },
                                          }
                                        : null
                                }
                            />
                        </div>
                    </div>

                    {showNames && (
                        <div className="se-names-grid">
                            {teamNames.map((teamName, index) => (
                                <label className="se-name" key={index}>
                                    <span className="se-name__seed">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={teamName}
                                        placeholder={`Team ${index + 1}`}
                                        onChange={(e) =>
                                            handleTeamNameChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                            ))}
                        </div>
                    )}
                </section>

                {hasBracket && (
                    <BracketView
                        rounds={rounds}
                        champion={champion}
                        onPick={handlePickWinner}
                    />
                )}
            </div>
        </div>
    );
}
