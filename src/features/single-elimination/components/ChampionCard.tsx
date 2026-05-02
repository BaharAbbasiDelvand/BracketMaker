import React from "react";
import { formatTeam, type Team } from "../utils/singleEliminationEngine";

type ChampionCardProps = {
    champion: Team | null;
};

export default function ChampionCard({ champion }: ChampionCardProps) {
    return (
        <div className="br-winner">
            <div className="br-winner__label">Winner</div>
            <div className="br-winner__box">{formatTeam(champion)}</div>
        </div>
    );
}