import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Repeat, Trophy, RotateCcw, ArrowRight, X } from "lucide-react";
import {
    getMyBrackets,
    removeMyBracket,
    FORMAT_LABELS,
    type MyBracketEntry,
} from "../../lib/myBrackets";
import { type TournamentFormat } from "../../lib/tournaments";
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

    useEffect(() => {
        setSaved(getMyBrackets());
    }, []);

    const handleRemove = (id: string) => {
        removeMyBracket(id);
        setSaved((current) => current.filter((item) => item.id !== id));
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
                                        onClick={() => handleRemove(entry.id)}
                                        aria-label="Remove from this list"
                                    >
                                        <X size={16} strokeWidth={2.4} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="home__saved-note">
                        Saved on this device. Removing a bracket here only hides
                        it from this list.
                    </p>
                </section>
            )}
        </div>
    );
}
