export type Team = {
    id: string;
    name: string;
    seed: number;
};

export type BracketMatch = {
    id: string;
    roundIndex: number;
    matchIndex: number;
    teams: [Team | null, Team | null];
    winner: Team | null;
};

export type BracketRound = BracketMatch[];

export const ALLOWED_TEAM_COUNTS = [2, 4, 8, 16, 32] as const;
export const TEAM_BOX_HEIGHT = 34;
export const MATCH_HEIGHT = TEAM_BOX_HEIGHT * 2;
export const BASE_GAP = 22;

export function createTeam(name: string, seed: number): Team {
    const trimmed = name.trim();
    const safeName = trimmed || `Team ${seed}`;

    return {
        id: `team-${seed}-${safeName.replace(/\s+/g, "-").toLowerCase()}`,
        name: safeName,
        seed,
    };
}

export function shuffleArray<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export function createEmptyRounds(teamCount: number): BracketRound[] {
    const rounds: BracketRound[] = [];
    let matchesInRound = teamCount / 2;
    let roundIndex = 0;

    while (matchesInRound >= 1) {
        const round: BracketRound = [];

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

export function cloneRounds(rounds: BracketRound[]): BracketRound[] {
    return rounds.map((round) =>
        round.map((match) => ({
            ...match,
            teams: [...match.teams] as [Team | null, Team | null],
            winner: match.winner,
        }))
    );
}

export function buildInitialBracket(teamNames: string[]): BracketRound[] {
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

export function propagateWinners(rounds: BracketRound[]): BracketRound[] {
    const nextRounds = cloneRounds(rounds);

    for (let roundIndex = 1; roundIndex < nextRounds.length; roundIndex += 1) {
        for (
            let matchIndex = 0;
            matchIndex < nextRounds[roundIndex].length;
            matchIndex += 1
        ) {
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

export function pickMatchWinner(
    rounds: BracketRound[],
    roundIndex: number,
    matchIndex: number,
    teamIndex: 0 | 1
): BracketRound[] {
    if (rounds.length === 0) {
        return rounds;
    }

    const next = cloneRounds(rounds);
    const match = next[roundIndex]?.[matchIndex];

    if (!match) {
        return rounds;
    }

    const selectedTeam = match.teams[teamIndex];

    if (!selectedTeam) {
        return rounds;
    }

    match.winner = selectedTeam;

    return propagateWinners(next);
}

export function getChampion(rounds: BracketRound[]): Team | null {
    if (rounds.length === 0) {
        return null;
    }

    return rounds[rounds.length - 1][0]?.winner ?? null;
}

export function getRoundTitle(
    roundIndex: number,
    totalRounds: number
): string {
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

export function getColumnPadding(roundIndex: number): number {
    return roundIndex === 0
        ? 0
        : ((Math.pow(2, roundIndex) - 1) * BASE_GAP) / 2;
}

export function getColumnGap(roundIndex: number): number {
    return BASE_GAP + (Math.pow(2, roundIndex) - 1) * (MATCH_HEIGHT + BASE_GAP);
}

export function formatTeam(team: Team | null): string {
    return team ? team.name : "TBD";
}