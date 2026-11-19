import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Repeat,
    Trophy,
    RotateCcw,
    Trash2,
    Loader,
    TriangleAlert,
    Bookmark,
    ArrowRight,
} from "lucide-react";
import {
    getMyBrackets,
    removeMyBracket,
    FORMAT_LABELS,
    type MyBracketEntry,
} from "../../lib/myBrackets";
import {
    deleteTournament,
    getUserTournaments,
    type TournamentFormat,
} from "../../lib/tournaments";
import { useCurrentUserSub } from "../../components/auth/AuthUserProvider";
import HomeLink from "../../components/nav/HomeLink";
import "./saved.css";

const FORMAT_ICONS: Record<TournamentFormat, typeof Repeat> = {
    round_robin: Repeat,
    single_elim: Trophy,
    double_elim: RotateCcw,
};

function relativeTime(savedAt: number): string {
    const seconds = Math.max(1, Math.round((Date.now() - savedAt) / 1000));

    if (seconds < 60) {
        return "just now";
    }

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.round(hours / 24);
    if (days < 7) {
        return `${days}d ago`;
    }

    return new Date(savedAt).toLocaleDateString();
}

const SavedTournaments = () => {
    const [saved, setSaved] = useState<MyBracketEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState<MyBracketEntry | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const userSub = useCurrentUserSub();

    useEffect(() => {
        let active = true;
        setLoading(true);

        if (userSub) {
            getUserTournaments(userSub)
                .then((entries) => {
                    if (active) {
                        setSaved(entries);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    if (active) {
                        setSaved([]);
                        setLoading(false);
                    }
                });
        } else {
            setSaved(getMyBrackets());
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [userSub]);

    const closeConfirm = () => {
        if (deleting) {
            return;
        }

        setPendingDelete(null);
        setDeleteError("");
    };

    useEffect(() => {
        if (!pendingDelete) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !deleting) {
                setPendingDelete(null);
                setDeleteError("");
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [pendingDelete, deleting]);

    const confirmRemove = async () => {
        if (!pendingDelete || deleting) {
            return;
        }

        const id = pendingDelete.id;
        setDeleting(true);
        setDeleteError("");

        try {
            const deleted = await deleteTournament(id);

            if (!deleted) {
                setDeleteError(
                    "Couldn't delete from the database — it may be missing a delete policy."
                );
                return;
            }

            removeMyBracket(id);
            setSaved((current) => current.filter((item) => item.id !== id));
            setPendingDelete(null);
        } catch (error) {
            setDeleteError(
                error instanceof Error ? error.message : "Could not delete."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="saved-page">
            <div className="saved-page__inner">
                <HomeLink />

                <header className="saved-page__head">
                    <span className="saved-page__badge">
                        <Bookmark size={22} strokeWidth={2.2} />
                    </span>
                    <h1 className="saved-page__title">Saved tournaments</h1>
                    <p className="saved-page__sub">
                        {userSub
                            ? "Synced to your account across devices."
                            : "Saved on this device — log in to sync them across devices."}
                    </p>
                </header>

                {loading ? (
                    <div className="saved-page__state">
                        <Loader
                            size={22}
                            strokeWidth={2.3}
                            className="confirm-spin"
                        />
                        <p>Loading your brackets…</p>
                    </div>
                ) : saved.length === 0 ? (
                    <div className="saved-page__empty">
                        <span className="saved-page__empty-icon">
                            <Bookmark size={26} strokeWidth={2} />
                        </span>
                        <h2 className="saved-page__empty-title">
                            Nothing saved yet
                        </h2>
                        <p className="saved-page__empty-text">
                            Build a bracket, then hit <strong>Save &amp; Share</strong>{" "}
                            to keep it here.
                        </p>
                        <Link to="/" className="saved-page__empty-cta">
                            Pick a format{" "}
                            <ArrowRight size={16} strokeWidth={2.4} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <ul className="home__saved-list">
                            {saved.map((entry) => {
                                const Icon =
                                    FORMAT_ICONS[entry.format] ?? Trophy;
                                const preview = entry.preview.join(", ");

                                return (
                                    <li
                                        className="home__saved-row"
                                        key={entry.id}
                                    >
                                        <Link
                                            to={`/t/${entry.id}`}
                                            className="home__saved-link"
                                        >
                                            <span className="home__saved-icon">
                                                <Icon
                                                    size={18}
                                                    strokeWidth={2.2}
                                                />
                                            </span>
                                            <span className="home__saved-main">
                                                <span className="home__saved-label">
                                                    {FORMAT_LABELS[
                                                        entry.format
                                                    ] ?? "Bracket"}
                                                </span>
                                                <span className="home__saved-sub">
                                                    {entry.teamsCount} teams
                                                    {preview
                                                        ? ` · ${preview}`
                                                        : ""}
                                                </span>
                                            </span>
                                            <span className="home__saved-time">
                                                {relativeTime(entry.savedAt)}
                                            </span>
                                        </Link>
                                        <button
                                            type="button"
                                            className="home__saved-remove"
                                            onClick={() =>
                                                setPendingDelete(entry)
                                            }
                                            aria-label="Delete this bracket"
                                            title="Delete this bracket"
                                        >
                                            <Trash2 size={16} strokeWidth={2.2} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className="home__saved-note">
                            {userSub
                                ? "Deleting a bracket removes it everywhere, so its share link stops working."
                                : "Deleting a bracket removes it from the database, so its share link stops working."}
                        </p>
                    </>
                )}
            </div>

            {pendingDelete && (
                <div
                    className="confirm-overlay"
                    role="presentation"
                    onClick={closeConfirm}
                >
                    <div
                        className="confirm-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="confirm-icon">
                            <Trash2 size={22} strokeWidth={2.2} />
                        </span>
                        <h2 id="confirm-title" className="confirm-title">
                            Delete this bracket?
                        </h2>
                        <p className="confirm-text">
                            This permanently deletes your&nbsp;
                            {FORMAT_LABELS[pendingDelete.format] ?? "bracket"}
                            {" bracket"} and its share link. Anyone with the link
                            will no longer be able to open it. This can&rsquo;t
                            be undone.
                        </p>

                        {deleteError && (
                            <p className="confirm-error">
                                <TriangleAlert size={15} strokeWidth={2.3} />
                                {deleteError}
                            </p>
                        )}

                        <div className="confirm-actions">
                            <button
                                type="button"
                                className="confirm-cancel"
                                onClick={closeConfirm}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="confirm-delete"
                                onClick={confirmRemove}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <Loader
                                        size={16}
                                        strokeWidth={2.3}
                                        className="confirm-spin"
                                    />
                                ) : (
                                    <Trash2 size={16} strokeWidth={2.3} />
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedTournaments;
