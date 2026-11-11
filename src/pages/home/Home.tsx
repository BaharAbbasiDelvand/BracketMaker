import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Repeat,
    Trophy,
    RotateCcw,
    ArrowRight,
    Trash2,
    Loader,
    TriangleAlert,
} from "lucide-react";
import {
    getMyBrackets,
    removeMyBracket,
    FORMAT_LABELS,
    type MyBracketEntry,
} from "../../lib/myBrackets";
import {
    deleteTournament,
    type TournamentFormat,
} from "../../lib/tournaments";
import "./Home.css";

const modes = [
    {
        to: "/round-robin",
        Icon: Repeat,
        title: "Round-Robin",
        desc: "Everyone faces everyone. Fairest way to crown a true ranking.",
        accent: "#ec4899",
    },
    {
        to: "/single-elimination",
        Icon: Trophy,
        title: "Single-Elimination",
        desc: "One loss and you're out. Fast, dramatic, winner takes all.",
        accent: "#14b8a6",
    },
    {
        to: "/double-elimination",
        Icon: RotateCcw,
        title: "Double-Elimination",
        desc: "A second chance through the losers' bracket before you're gone.",
        accent: "#f59e0b",
    },
];

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

export function Home() {
    const [saved, setSaved] = useState<MyBracketEntry[]>([]);
    const [pendingDelete, setPendingDelete] = useState<MyBracketEntry | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        setSaved(getMyBrackets());
    }, []);

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
        <div className="home">
            <p className="home__eyebrow">Tournaments made easy</p>
            <h1 className="home__title">Rank whatever!</h1>
            <p className="home__subtitle">
                Teams, snacks, movie nights — pick a format and settle it once and for all.
            </p>

            <div className="home__cards">
                {modes.map((mode) => (
                    <Link
                        key={mode.to}
                        to={mode.to}
                        className="home__card"
                        style={{ "--accent": mode.accent } as React.CSSProperties}
                    >
                        <span className="home__card-icon">
                            <mode.Icon size={24} strokeWidth={2.2} />
                        </span>
                        <h2 className="home__card-title">{mode.title}</h2>
                        <p className="home__card-desc">{mode.desc}</p>
                        <span className="home__card-cta">
                            Start <ArrowRight size={16} strokeWidth={2.4} />
                        </span>
                    </Link>
                ))}
            </div>

            {saved.length > 0 && (
                <section className="home__saved">
                    <h2 className="home__saved-title">Your saved brackets</h2>
                    <ul className="home__saved-list">
                        {saved.map((entry) => {
                            const Icon = FORMAT_ICONS[entry.format] ?? Trophy;
                            const preview = entry.preview.join(", ");

                            return (
                                <li className="home__saved-row" key={entry.id}>
                                    <Link
                                        to={`/t/${entry.id}`}
                                        className="home__saved-link"
                                    >
                                        <span className="home__saved-icon">
                                            <Icon size={18} strokeWidth={2.2} />
                                        </span>
                                        <span className="home__saved-main">
                                            <span className="home__saved-label">
                                                {FORMAT_LABELS[entry.format] ??
                                                    "Bracket"}
                                            </span>
                                            <span className="home__saved-sub">
                                                {entry.teamsCount} teams
                                                {preview ? ` · ${preview}` : ""}
                                            </span>
                                        </span>
                                        <span className="home__saved-time">
                                            {relativeTime(entry.savedAt)}
                                        </span>
                                    </Link>
                                    <button
                                        type="button"
                                        className="home__saved-remove"
                                        onClick={() => setPendingDelete(entry)}
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
                        Saved on this device. Deleting a bracket removes it from
                        the database too, so its share link stops working.
                    </p>
                </section>
            )}

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
}
