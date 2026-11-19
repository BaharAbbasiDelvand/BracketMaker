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
    userId?: string | null;
};

export type UserBracketEntry = {
    id: string;
    format: TournamentFormat;
    teamsCount: number;
    preview: string[];
    savedAt: number;
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
            user_id: input.userId ?? null,
        })
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data.id as string;
}

export async function getUserTournaments(
    userId: string
): Promise<UserBracketEntry[]> {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from(TABLE)
        .select("id, format, teams, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map((row) => {
        const teams = Array.isArray(row.teams)
            ? (row.teams as unknown[])
                  .map((team) => String(team))
                  .filter((team) => team.trim() !== "")
            : [];

        return {
            id: row.id as string,
            format: row.format as TournamentFormat,
            teamsCount: teams.length,
            preview: teams.slice(0, 3),
            savedAt: new Date(row.created_at as string).getTime(),
        };
    });
}

export async function deleteTournament(id: string): Promise<boolean> {
    if (!supabase) {
        throw new Error(
            "Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLISHABLE_KEY to your .env."
        );
    }

    const { data, error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {
        throw new Error(error.message);
    }

    return (data?.length ?? 0) > 0;
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
