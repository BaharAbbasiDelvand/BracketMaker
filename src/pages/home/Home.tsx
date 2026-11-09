import { Link } from "react-router-dom";
import { Repeat, Trophy, RotateCcw, ArrowRight } from "lucide-react";
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

export function Home() {
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
        </div>
    );
}
