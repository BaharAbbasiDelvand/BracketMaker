import React, { useMemo, useState } from "react";
import { Trophy, Shuffle, Users, Pencil, ChevronDown } from "lucide-react";
import SaveShareBar from "../../components/share/SaveShareBar";
import "./double-elimination.css";

type Team = {
    id: string;
    name: string;
    seed: number;
};

type Source =
    | { type: "seed"; teamId: string }
    | { type: "winner"; matchId: string }
    | { type: "loser"; matchId: string };

type MatchDef = {
    id: string;
    bracket: "W" | "L" | "F";
    sources: [Source | null, Source | null];
};

type MatchState = MatchDef & {
    teams: [Team | null, Team | null];
    winner: Team | null;
    loser: Team | null;
};

type Tournament = {
    teams: Team[];
    matches: MatchDef[];
    picks: Record<string, string | null>;
    grandFinalId: string;
    resetFinalId: string;
};

export type DoubleEliminationSnapshot = {
    teamNames: string[];
    tournament: Tournament;
};

type MatchPosition = {
    x: number;
    y: number;
    color: "winner" | "loser" | "final";
};

const TEAM_COUNT = 16;
const BOX_WIDTH = 180;
const BOX_HEIGHT = 72;
const HALF_HEIGHT = BOX_HEIGHT / 2;
const STAGE_WIDTH = 2320;
const STAGE_HEIGHT = 1400;

function createTeam(name: string, index: number): Team {
    const safeName = name.trim() || `Team ${index + 1}`;

    return {
        id: `team-${index + 1}-${safeName}`,
        name: safeName,
        seed: index + 1,
    };
}

function shuffleArray<T>(items: T[]): T[] {
    const next = [...items];

    for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }

    return next;
}

function buildTournament(teamNames: string[]): Tournament {
    const teams = shuffleArray(teamNames.map((name, index) => createTeam(name, index)));

    const matches: MatchDef[] = [
        { id: "W1", bracket: "W", sources: [{ type: "seed", teamId: teams[0].id }, { type: "seed", teamId: teams[1].id }] },
        { id: "W2", bracket: "W", sources: [{ type: "seed", teamId: teams[2].id }, { type: "seed", teamId: teams[3].id }] },
        { id: "W3", bracket: "W", sources: [{ type: "seed", teamId: teams[4].id }, { type: "seed", teamId: teams[5].id }] },
        { id: "W4", bracket: "W", sources: [{ type: "seed", teamId: teams[6].id }, { type: "seed", teamId: teams[7].id }] },
        { id: "W5", bracket: "W", sources: [{ type: "seed", teamId: teams[8].id }, { type: "seed", teamId: teams[9].id }] },
        { id: "W6", bracket: "W", sources: [{ type: "seed", teamId: teams[10].id }, { type: "seed", teamId: teams[11].id }] },
        { id: "W7", bracket: "W", sources: [{ type: "seed", teamId: teams[12].id }, { type: "seed", teamId: teams[13].id }] },
        { id: "W8", bracket: "W", sources: [{ type: "seed", teamId: teams[14].id }, { type: "seed", teamId: teams[15].id }] },

        { id: "W9", bracket: "W", sources: [{ type: "winner", matchId: "W1" }, { type: "winner", matchId: "W2" }] },
        { id: "W10", bracket: "W", sources: [{ type: "winner", matchId: "W3" }, { type: "winner", matchId: "W4" }] },
        { id: "W11", bracket: "W", sources: [{ type: "winner", matchId: "W5" }, { type: "winner", matchId: "W6" }] },
        { id: "W12", bracket: "W", sources: [{ type: "winner", matchId: "W7" }, { type: "winner", matchId: "W8" }] },

        { id: "W13", bracket: "W", sources: [{ type: "winner", matchId: "W9" }, { type: "winner", matchId: "W10" }] },
        { id: "W14", bracket: "W", sources: [{ type: "winner", matchId: "W11" }, { type: "winner", matchId: "W12" }] },

        { id: "W15", bracket: "W", sources: [{ type: "winner", matchId: "W13" }, { type: "winner", matchId: "W14" }] },

        { id: "L1", bracket: "L", sources: [{ type: "loser", matchId: "W1" }, { type: "loser", matchId: "W2" }] },
        { id: "L2", bracket: "L", sources: [{ type: "loser", matchId: "W3" }, { type: "loser", matchId: "W4" }] },
        { id: "L3", bracket: "L", sources: [{ type: "loser", matchId: "W5" }, { type: "loser", matchId: "W6" }] },
        { id: "L4", bracket: "L", sources: [{ type: "loser", matchId: "W7" }, { type: "loser", matchId: "W8" }] },

        { id: "L5", bracket: "L", sources: [{ type: "winner", matchId: "L1" }, { type: "loser", matchId: "W9" }] },
        { id: "L6", bracket: "L", sources: [{ type: "winner", matchId: "L2" }, { type: "loser", matchId: "W10" }] },
        { id: "L7", bracket: "L", sources: [{ type: "winner", matchId: "L3" }, { type: "loser", matchId: "W11" }] },
        { id: "L8", bracket: "L", sources: [{ type: "winner", matchId: "L4" }, { type: "loser", matchId: "W12" }] },

        { id: "L9", bracket: "L", sources: [{ type: "winner", matchId: "L5" }, { type: "winner", matchId: "L6" }] },
        { id: "L10", bracket: "L", sources: [{ type: "winner", matchId: "L7" }, { type: "winner", matchId: "L8" }] },

        { id: "L11", bracket: "L", sources: [{ type: "winner", matchId: "L9" }, { type: "loser", matchId: "W13" }] },
        { id: "L12", bracket: "L", sources: [{ type: "winner", matchId: "L10" }, { type: "loser", matchId: "W14" }] },

        { id: "L13", bracket: "L", sources: [{ type: "winner", matchId: "L11" }, { type: "winner", matchId: "L12" }] },

        { id: "L14", bracket: "L", sources: [{ type: "winner", matchId: "L13" }, { type: "loser", matchId: "W15" }] },

        { id: "GF", bracket: "F", sources: [{ type: "winner", matchId: "W15" }, { type: "winner", matchId: "L14" }] },
        { id: "RF", bracket: "F", sources: [{ type: "winner", matchId: "GF" }, { type: "loser", matchId: "GF" }] },
    ];

    return {
        teams,
        matches,
        picks: {},
        grandFinalId: "GF",
        resetFinalId: "RF",
    };
}

function resolveTournament(tournament: Tournament) {
    const teamMap = new Map(tournament.teams.map((team) => [team.id, team]));
    const matchMap = new Map<string, MatchState>();

    function resolveSource(source: Source | null): Team | null {
        if (!source) {
            return null;
        }

        if (source.type === "seed") {
            return teamMap.get(source.teamId) ?? null;
        }

        const sourceMatch = matchMap.get(source.matchId);
        if (!sourceMatch) {
            return null;
        }

        return source.type === "winner" ? sourceMatch.winner : sourceMatch.loser;
    }

    for (const match of tournament.matches) {
        const teamA = resolveSource(match.sources[0]);
        const teamB = resolveSource(match.sources[1]);
        const pickedWinnerId = tournament.picks[match.id] ?? null;

        let winner: Team | null = null;

        if (teamA && teamB) {
            if (pickedWinnerId === teamA.id) {
                winner = teamA;
            } else if (pickedWinnerId === teamB.id) {
                winner = teamB;
            }
        }

        const loser =
            winner && teamA && teamB
                ? winner.id === teamA.id
                    ? teamB
                    : teamA
                : null;

        matchMap.set(match.id, {
            ...match,
            teams: [teamA, teamB],
            winner,
            loser,
        });
    }

    const grandFinal = matchMap.get(tournament.grandFinalId) ?? null;
    const resetFinal = matchMap.get(tournament.resetFinalId) ?? null;

    const resetNeeded =
        !!grandFinal &&
        !!grandFinal.teams[0] &&
        !!grandFinal.teams[1] &&
        !!grandFinal.winner &&
        grandFinal.winner.id === grandFinal.teams[1].id;

    const champion =
        resetNeeded && resetFinal?.winner
            ? resetFinal.winner
            : !resetNeeded
              ? grandFinal?.winner ?? null
              : null;

    return {
        matchMap,
        grandFinal,
        resetFinal,
        resetNeeded,
        champion,
    };
}

const COL_W = 280;
const LEFT = 70;
const colX = (col: number) => LEFT + col * COL_W;

function getMatchPositions(): Record<string, MatchPosition> {
    const H = BOX_HEIGHT;
    const topOf = (center: number) => center - H / 2;

    const WB_TOP = 110;
    const WB_PITCH = 96;
    const wbC = (round: number, k: number) =>
        WB_TOP +
        H / 2 +
        (WB_PITCH / 2) * (2 ** round - 1) +
        k * (WB_PITCH * 2 ** round);

    const LB_TOP = 920;
    const LB_PITCH = 96;
    const lbA = (k: number) => LB_TOP + H / 2 + k * LB_PITCH;
    const lbB = (k: number) => (lbA(2 * k) + lbA(2 * k + 1)) / 2;
    const lbC = () => (lbB(0) + lbB(1)) / 2;

    const positions: Record<string, MatchPosition> = {};
    const place = (
        id: string,
        col: number,
        center: number,
        color: MatchPosition["color"]
    ) => {
        positions[id] = { x: colX(col), y: topOf(center), color };
    };

    for (let i = 0; i < 8; i += 1) place(`W${i + 1}`, 0, wbC(0, i), "winner");
    for (let i = 0; i < 4; i += 1) place(`W${i + 9}`, 1, wbC(1, i), "winner");
    place("W13", 2, wbC(2, 0), "winner");
    place("W14", 2, wbC(2, 1), "winner");
    place("W15", 3, wbC(3, 0), "winner");

    for (let i = 0; i < 4; i += 1) place(`L${i + 1}`, 0, lbA(i), "loser");
    for (let i = 0; i < 4; i += 1) place(`L${i + 5}`, 1, lbA(i), "loser");
    place("L9", 2, lbB(0), "loser");
    place("L10", 2, lbB(1), "loser");
    place("L11", 3, lbB(0), "loser");
    place("L12", 3, lbB(1), "loser");
    place("L13", 4, lbC(), "loser");
    place("L14", 5, lbC(), "loser");

    const gfCenter = (wbC(3, 0) + lbC()) / 2;
    place("GF", 6, gfCenter, "final");
    place("RF", 6, gfCenter + 160, "final");
    place("CH", 7, gfCenter, "final");

    return positions;
}

function getColor(kind: MatchPosition["color"]): string {
    if (kind === "winner") return "#60a5fa";
    if (kind === "loser") return "#fbbf24";
    return "#a78bfa";
}

function rowCenterY(position: MatchPosition, row: 0 | 1) {
    return position.y + row * HALF_HEIGHT + HALF_HEIGHT / 2;
}

function matchCenterY(position: MatchPosition) {
    return position.y + BOX_HEIGHT / 2;
}

function rightX(position: MatchPosition) {
    return position.x + BOX_WIDTH;
}

function leftX(position: MatchPosition) {
    return position.x;
}

function line(
    key: string,
    points: string,
    color: string,
    dashed = false
) {
    return (
        <polyline
            key={key}
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={dashed ? "6 5" : undefined}
        />
    );
}

function route(
    key: string,
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string
) {
    const midX = from.x + 28;
    return line(key, `${from.x},${from.y} ${midX},${from.y} ${midX},${to.y} ${to.x},${to.y}`, color);
}

function BracketLines({
    positions,
    resetNeeded,
}: {
    positions: Record<string, MatchPosition>;
    resetNeeded: boolean;
}) {
    const blue = getColor("winner");
    const orange = getColor("loser");
    const gray = getColor("final");
    const nodes: React.ReactNode[] = [];

    for (let i = 1; i <= 8; i += 1) {
        const pos = positions[`W${i}`];
        nodes.push(line(`w-seed-a-${i}`, `${pos.x - 36},${rowCenterY(pos, 0)} ${pos.x},${rowCenterY(pos, 0)}`, blue));
        nodes.push(line(`w-seed-b-${i}`, `${pos.x - 36},${rowCenterY(pos, 1)} ${pos.x},${rowCenterY(pos, 1)}`, blue));
    }

    const directFeeds: Array<[string, string, 0 | 1, string]> = [
        ["W1", "W9", 0, blue],
        ["W2", "W9", 1, blue],
        ["W3", "W10", 0, blue],
        ["W4", "W10", 1, blue],
        ["W5", "W11", 0, blue],
        ["W6", "W11", 1, blue],
        ["W7", "W12", 0, blue],
        ["W8", "W12", 1, blue],

        ["W9", "W13", 0, blue],
        ["W10", "W13", 1, blue],
        ["W11", "W14", 0, blue],
        ["W12", "W14", 1, blue],

        ["W13", "W15", 0, blue],
        ["W14", "W15", 1, blue],

        ["L1", "L5", 0, orange],
        ["L2", "L6", 0, orange],
        ["L3", "L7", 0, orange],
        ["L4", "L8", 0, orange],

        ["L5", "L9", 0, orange],
        ["L6", "L9", 1, orange],
        ["L7", "L10", 0, orange],
        ["L8", "L10", 1, orange],

        ["L9", "L11", 0, orange],
        ["L10", "L12", 0, orange],

        ["L11", "L13", 0, orange],
        ["L12", "L13", 1, orange],

        ["L13", "L14", 0, orange],

        ["W15", "GF", 0, gray],
        ["L14", "GF", 1, gray],
    ];

    directFeeds.forEach(([fromId, toId, toRow, color], index) => {
        const fromPos = positions[fromId];
        const toPos = positions[toId];

        nodes.push(
            route(
                `feed-${index}`,
                { x: rightX(fromPos), y: matchCenterY(fromPos) },
                { x: leftX(toPos), y: rowCenterY(toPos, toRow) },
                color
            )
        );
    });

    if (resetNeeded) {
        const gf = positions.GF;
        const rf = positions.RF;

        nodes.push(
            route(
                "gf-rf-top",
                { x: rightX(gf), y: rowCenterY(gf, 0) },
                { x: leftX(rf), y: rowCenterY(rf, 0) },
                gray
            )
        );

        nodes.push(
            route(
                "gf-rf-bottom",
                { x: rightX(gf), y: rowCenterY(gf, 1) },
                { x: leftX(rf), y: rowCenterY(rf, 1) },
                gray
            )
        );
    } else {
        const gf = positions.GF;
        const rf = positions.RF;

        nodes.push(
            line(
                "rf-placeholder-line",
                `${rightX(gf)},${matchCenterY(gf)} ${rightX(gf) + 32},${matchCenterY(gf)} ${rightX(gf) + 32},${matchCenterY(rf)} ${leftX(rf)},${matchCenterY(rf)}`,
                gray,
                true
            )
        );
    }

    return (
        <svg
            className="de-lines"
            viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
            preserveAspectRatio="xMinYMin meet"
        >
            {nodes}
        </svg>
    );
}

function BracketMatch({
    match,
    position,
    onPick,
}: {
    match: MatchState;
    position: MatchPosition;
    onPick: (matchId: string, teamId: string) => void;
}) {
    return (
        <div
            className={`de-match de-match--${position.color}`}
            style={{ left: position.x, top: position.y }}
        >
            {([0, 1] as const).map((teamIndex) => {
                const team = match.teams[teamIndex];
                const isWinner =
                    !!match.winner && !!team && match.winner.id === team.id;
                const isLoser = !!match.winner && !!team && !isWinner;

                return (
                    <button
                        key={teamIndex}
                        type="button"
                        className={[
                            "de-team",
                            isWinner ? "de-team--winner" : "",
                            isLoser ? "de-team--lost" : "",
                            team ? "" : "de-team--tbd",
                        ].join(" ")}
                        disabled={!team || isLoser}
                        onClick={() => team && onPick(match.id, team.id)}
                    >
                        <span className="de-team__seed">
                            {team ? team.seed : ""}
                        </span>
                        <span className="de-team__name">
                            {team ? team.name : "TBD"}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

type Props = {
    initial?: DoubleEliminationSnapshot;
};

function DoubleElimination({ initial }: Props) {
    const [teamNames, setTeamNames] = useState<string[]>(
        initial?.teamNames ??
            Array.from({ length: TEAM_COUNT }, (_, index) => `Team ${index + 1}`)
    );
    const [tournament, setTournament] = useState<Tournament | null>(
        initial?.tournament ?? null
    );
    const [showNames, setShowNames] = useState(!initial);

    const positions = useMemo(() => getMatchPositions(), []);
    const resolved = useMemo(() => {
        if (!tournament) {
            return null;
        }

        return resolveTournament(tournament);
    }, [tournament]);

    function handleTeamNameChange(index: number, value: string) {
        setTeamNames((current) => {
            const next = [...current];
            next[index] = value;
            return next;
        });
    }

    function handleGenerate() {
        setTournament(buildTournament(teamNames));
        setShowNames(false);
    }

    function handlePick(matchId: string, teamId: string) {
        setTournament((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                picks: {
                    ...current.picks,
                    [matchId]: teamId,
                },
            };
        });
    }

    const hasBracket =
        !!tournament &&
        !!resolved &&
        !!resolved.grandFinal &&
        !!resolved.resetFinal;

    return (
        <div className="de-page">
            <div className="de-inner">
                <h1 className="de-title-h">
                    <span>Double Elimination</span>
                </h1>

                <section className="de-controls">
                    <div className="de-controls__bar">
                        <div className="de-field">
                            <label>
                                <Users size={16} strokeWidth={2.2} />
                                Number of teams
                            </label>
                            <div className="de-count">16 teams</div>
                        </div>

                        <div className="de-controls__actions">
                            <button
                                type="button"
                                className="de-names-toggle"
                                onClick={() => setShowNames((v) => !v)}
                            >
                                <Pencil size={15} strokeWidth={2.2} />
                                {showNames ? "Hide names" : "Edit names"}
                                <ChevronDown
                                    size={15}
                                    strokeWidth={2.4}
                                    className={
                                        showNames
                                            ? "de-chevron de-chevron--open"
                                            : "de-chevron"
                                    }
                                />
                            </button>

                            <button
                                type="button"
                                className="de-generate"
                                onClick={handleGenerate}
                            >
                                <Shuffle size={18} strokeWidth={2.3} />
                                {tournament
                                    ? "Reshuffle bracket"
                                    : "Generate bracket"}
                            </button>

                            <SaveShareBar
                                canSave={hasBracket}
                                getPayload={() =>
                                    hasBracket && tournament
                                        ? {
                                              format: "double_elim",
                                              name: null,
                                              teams: teamNames,
                                              state: {
                                                  teamNames,
                                                  tournament,
                                              },
                                          }
                                        : null
                                }
                            />
                        </div>
                    </div>

                    {showNames && (
                        <div className="de-names-grid">
                            {teamNames.map((teamName, index) => (
                                <label className="de-name" key={index}>
                                    <span className="de-name__seed">
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

                {hasBracket && tournament && resolved && (
                    <div className="de-scroll">
                        <div
                            className="de-stage"
                            style={{
                                width: `${STAGE_WIDTH}px`,
                                height: `${STAGE_HEIGHT}px`,
                            }}
                        >
                            <div className="de-side-label de-side-label--winner">
                                Winners bracket
                            </div>
                            <div className="de-side-label de-side-label--loser">
                                Losers bracket
                            </div>

                            <div
                                className="de-panel-title"
                                style={{
                                    left: positions.GF.x,
                                    top: positions.GF.y - 30,
                                }}
                            >
                                Grand Final
                            </div>
                            <div
                                className="de-panel-title"
                                style={{
                                    left: positions.RF.x,
                                    top: positions.RF.y - 30,
                                }}
                            >
                                Reset Final
                            </div>
                            <div
                                className="de-panel-title"
                                style={{
                                    left: positions.CH.x,
                                    top: positions.CH.y - 30,
                                }}
                            >
                                Champion
                            </div>

                            <BracketLines
                                positions={positions}
                                resetNeeded={resolved.resetNeeded}
                            />

                            {tournament.matches.map((match) => {
                                const position = positions[match.id];
                                const resolvedMatch = resolved.matchMap.get(
                                    match.id
                                );

                                if (!position || !resolvedMatch) {
                                    return null;
                                }

                                if (
                                    match.id === tournament.resetFinalId &&
                                    !resolved.resetNeeded
                                ) {
                                    return (
                                        <div
                                            key={match.id}
                                            className="de-placeholder"
                                            style={{
                                                left: position.x,
                                                top: position.y,
                                            }}
                                        >
                                            <div className="de-placeholder__box">
                                                Only if needed
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <BracketMatch
                                        key={match.id}
                                        match={resolvedMatch}
                                        position={position}
                                        onPick={handlePick}
                                    />
                                );
                            })}

                            <div
                                className={
                                    resolved.champion
                                        ? "de-champion de-champion--crowned"
                                        : "de-champion"
                                }
                                style={{
                                    left: positions.CH.x,
                                    top: positions.CH.y,
                                }}
                            >
                                <Trophy size={20} strokeWidth={2.2} />
                                <span className="de-champion__name">
                                    {resolved.champion?.name ?? "TBD"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoubleElimination;
