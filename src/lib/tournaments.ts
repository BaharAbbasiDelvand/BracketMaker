import { supabase } from "./supabaseClient";

export type TournamentFormat =
    | "round_robin"
    | "single_elim"
    | "double_elim";

export type NewTournament = {
    format: TournamentFormat;
    name: string | null;
    teams: unknown;
    state: unknown;
};

export type SavedTournament = {
    id: string;
    format: TournamentFormat;
    name: string | null;
    teams: unknown;
    state: unknown;
    created_at: string;
};

const TABLE = "tournaments";

export async function saveTournament(input: NewTournament): Promise<string> {
    if (!supabase) {
        throw new Error(
            "Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLISHABLE_KEY to your .env."
        );
    }

    const { data, error } = await supabase
        .from(TABLE)
        .insert({
            format: input.format,
            name: input.name,
            teams: input.teams,
            state: input.state,
        })
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data.id as string;
}

export async function loadTournament(
    id: string
): Promise<SavedTournament | null> {
    if (!supabase) {
        throw new Error(
            "Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLISHABLE_KEY to your .env."
        );
    }

    const { data, error } = await supabase
        .from(TABLE)
        .select("id, format, name, teams, state, created_at")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return (data as SavedTournament | null) ?? null;
}
