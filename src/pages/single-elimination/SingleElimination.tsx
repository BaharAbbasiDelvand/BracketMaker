import React, { useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "./single-elimination.css";

type Team = {
    id: string;
    name: string;
    seed: number;
};

type Match = {
    id: string;
    roundIndex: number;
    matchIndex: number;
    teams: [Team | null, Team | null];
    winner: Team | null;
};

const ALLOWED_TEAM_COUNTS = [2, 4, 8, 16, 32];
const TEAM_BOX_HEIGHT = 34;
const MATCH_HEIGHT = TEAM_BOX_HEIGHT * 2;
const BASE_GAP = 22;

function createTeam(name: string, seed: number): Team {
    return {
        id: `team-${seed}-${name.trim() || `Team ${seed}`}`,
        name: name.trim() || `Team ${seed}`,
        seed,
    };
}

function shuffleArray<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function createEmptyRounds(teamCount: number): Match[][] {
    const rounds: Match[][] = [];
    let matchesInRound = teamCount / 2;
    let roundIndex = 0;

    while (matchesInRound >= 1) {
        const round: Match[] = [];

        for (let matchIndex = 0; matchIndex < matchesInRound; matchIndex += 1) {
            round.push({
                id: `round-${roundIndex}-match-${matchIndex}`,
                roundIndex,
                matchIndex,
                teams: [null, null],
                winner: null,
            });
        }

        rounds.push(round);
        matchesInRound /= 2;
        roundIndex += 1;
    }

    return rounds;
}

function buildInitialBracket(teamNames: string[]): Match[][] {
    const teams = shuffleArray(
        teamNames.map((name, index) => createTeam(name, index + 1))
    );
    const rounds = createEmptyRounds(teams.length);

    for (let i = 0; i < teams.length; i += 2) {
        const matchIndex = i / 2;
        rounds[0][matchIndex].teams = [teams[i], teams[i + 1]];
    }

    return rounds;
}

function propagateWinners(rounds: Match[][]): Match[][] {
    const nextRounds = rounds.map((round) =>
        round.map((match) => ({
            ...match,
            teams: [...match.teams] as [Team | null, Team | null],
            winner: match.winner,
        }))
    );

    for (let roundIndex = 1; roundIndex < nextRounds.length; roundIndex += 1) {
        for (let matchIndex = 0; matchIndex < nextRounds[roundIndex].length; matchIndex += 1) {
            const previousA = nextRounds[roundIndex - 1][matchIndex * 2];
            const previousB = nextRounds[roundIndex - 1][matchIndex * 2 + 1];
            const current = nextRounds[roundIndex][matchIndex];

            current.teams = [previousA.winner, previousB.winner];

            const [teamA, teamB] = current.teams;
            const winner = current.winner;

            const stillValid =
                winner !== null &&
                ((teamA !== null && winner.id === teamA.id) ||
                    (teamB !== null && winner.id === teamB.id));

            if (!stillValid) {
                current.winner = null;
            }
        }
    }

    return nextRounds;
}

function getRoundTitle(roundIndex: number, totalRounds: number): string {
    if (roundIndex === totalRounds - 1) {
        return "Final";
    }

    if (roundIndex === totalRounds - 2) {
        return "Semifinal";
    }

    if (roundIndex === totalRounds - 3) {
        return "Quarterfinal";
    }

    return `Round ${roundIndex + 1}`;
}

function getColumnPadding(roundIndex: number): number {
    return roundIndex === 0 ? 0 : ((Math.pow(2, roundIndex) - 1) * BASE_GAP) / 2;
}

function getColumnGap(roundIndex: number): number {
    return BASE_GAP + (Math.pow(2, roundIndex) - 1) * (MATCH_HEIGHT + BASE_GAP);
}

function formatTeam(team: Team | null): string {
    if (!team) {
        return "TBD";
    }

    return team.name;
}

type MatchCardProps = {
    match: Match;
    side: "left" | "right" | "center";
    connect: boolean;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

function MatchCard({ match, side, connect, onPick }: MatchCardProps) {
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
                    match.winner?.id === match.teams[0]?.id ? "br-team--winner" : "",
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
                    match.winner?.id === match.teams[1]?.id ? "br-team--winner" : "",
                ].join(" ")}
                disabled={!match.teams[1]}
                onClick={() => onPick(match.roundIndex, match.matchIndex, 1)}
            >
                {formatTeam(match.teams[1])}
            </button>
        </div>
    );
}

type SideColumnProps = {
    title: string;
    roundIndex: number;
    side: "left" | "right";
    matches: Match[];
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

function SideColumn({ title, roundIndex, side, matches, onPick }: SideColumnProps) {
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
                    <MatchCard
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

type CenterFinalProps = {
    finalMatch: Match;
    champion: Team | null;
    visualRoundIndex: number;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

function CenterFinal({
    finalMatch,
    champion,
    visualRoundIndex,
    onPick,
}: CenterFinalProps) {
    return (
        <div
            className="br-center"
            style={{
                paddingTop: `${getColumnPadding(visualRoundIndex)}px`,
            }}
        >
            <div className="br-column__title">Final</div>

            <MatchCard
                match={finalMatch}
                side="center"
                connect={false}
                onPick={onPick}
            />

            <div className="br-winner">
                <div className="br-winner__label">Winner</div>
                <div className="br-winner__box">{formatTeam(champion)}</div>
            </div>
        </div>
    );
}

type BracketProps = {
    rounds: Match[][];
    champion: Team | null;
    onPick: (roundIndex: number, matchIndex: number, teamIndex: 0 | 1) => void;
};

function SymmetricalBracket({ rounds, champion, onPick }: BracketProps) {
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

    return (
        <div className="br-scroll">
            <div className="bracket-layout">
                {leftColumns.map((column) => (
                    <SideColumn
                        key={`left-${column.roundIndex}`}
                        title={column.title}
                        roundIndex={column.roundIndex}
                        side="left"
                        matches={column.matches}
                        onPick={onPick}
                    />
                ))}

                <CenterFinal
                    finalMatch={rounds[totalRounds - 1][0]}
                    champion={champion}
                    visualRoundIndex={sideRounds - 1}
                    onPick={onPick}
                />

                {rightColumns.map((column) => (
                    <SideColumn
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

export default function SingleElimination() {
    const [step, setStep] = useState<"setup" | "bracket">("setup");
    const [teamCount, setTeamCount] = useState<number>(16);
    const [teamNames, setTeamNames] = useState<string[]>(
        Array.from({ length: 16 }, (_, index) => `Team ${index + 1}`)
    );
    const [rounds, setRounds] = useState<Match[][]>([]);

    const champion = useMemo(() => {
        if (rounds.length === 0) {
            return null;
        }

        return rounds[rounds.length - 1][0]?.winner ?? null;
    }, [rounds]);

    const handleTeamCountChange = (count: number) => {
        const nextCount = ALLOWED_TEAM_COUNTS.includes(count) ? count : 16;

        setTeamCount(nextCount);
        setTeamNames((current) =>
            Array.from({ length: nextCount }, (_, index) => current[index] ?? `Team ${index + 1}`)
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
        setRounds((current) => {
            if (current.length === 0) {
                return current;
            }

            const next = current.map((round) =>
                round.map((match) => ({
                    ...match,
                    teams: [...match.teams] as [Team | null, Team | null],
                    winner: match.winner,
                }))
            );

            const match = next[roundIndex][matchIndex];
            const selectedTeam = match.teams[teamIndex];

            if (!selectedTeam) {
                return current;
            }

            match.winner = selectedTeam;
            return propagateWinners(next);
        });
    };

    if (step === "setup") {
        return (
            <Container className="py-4">
                <h1 className="mb-4">Single Elimination</h1>

                <Card className="shadow-sm">
                    <Card.Body>
                        <Row className="g-3 mb-4">
                            <Col md={4}>
                                <Form.Group controlId="teamCount">
                                    <Form.Label>Number of teams</Form.Label>
                                    <Form.Select
                                        value={teamCount}
                                        onChange={(e) => handleTeamCountChange(Number(e.target.value))}
                                    >
                                        {ALLOWED_TEAM_COUNTS.map((count) => (
                                            <option key={count} value={count}>
                                                {count}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3">
                            {teamNames.map((teamName, index) => (
                                <Col xs={12} md={6} lg={4} key={index}>
                                    <Form.Group controlId={`seed-${index + 1}`}>
                                        <Form.Label>Team {index + 1}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teamName}
                                            onChange={(e) =>
                                                handleTeamNameChange(index, e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>

                        <div className="mt-4 d-flex gap-2">
                            <Button onClick={handleGenerate}>Generate Shuffled Bracket</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 px-3">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <h1 className="mb-1">{teamCount} Team Single Elimination</h1>
                    <div className="text-muted">
                        Teams were shuffled randomly before being placed into the bracket.
                    </div>
                </div>

                <Button variant="secondary" onClick={handleBack}>
                    Back to Setup
                </Button>
            </div>

            {rounds.length > 0 && (
                <SymmetricalBracket
                    rounds={rounds}
                    champion={champion}
                    onPick={handlePickWinner}
                />
            )}
        </Container>
    );
}