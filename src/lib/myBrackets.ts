import { type TournamentFormat } from "./tournaments";

export type MyBracketEntry = {
    id: string;
    format: TournamentFormat;
    teamsCount: number;
    preview: string[];
    savedAt: number;
};

const STORAGE_KEY = "bracketmaker:my-brackets";
const MAX_ENTRIES = 50;

export const FORMAT_LABELS: Record<TournamentFormat, string> = {
    round_robin: "Round-Robin",
    single_elim: "Single-Elimination",
    double_elim: "Double-Elimination",
};

export function getMyBrackets(): MyBracketEntry[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(
            (entry): entry is MyBracketEntry =>
                entry &&
                typeof entry.id === "string" &&
                typeof entry.format === "string"
        );
    } catch {
        return [];
    }
}

export function addMyBracket(entry: MyBracketEntry): void {
    try {
        const existing = getMyBrackets().filter(
            (item) => item.id !== entry.id
        );
        const next = [entry, ...existing].slice(0, MAX_ENTRIES);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        return;
    }
}

export function removeMyBracket(id: string): void {
    try {
        const next = getMyBrackets().filter((item) => item.id !== id);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        return;
    }
}
