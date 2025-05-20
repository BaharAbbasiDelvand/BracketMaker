import React from "react";

type Props = {
    matchups: [string, string][];
};

const MatchupList: React.FC<Props> = ({ matchups }) => {
    return (
        <div className="matchup-list">
            <h3>Generated Matchups ({matchups.length})</h3>
            <ul>
                {matchups.map(([a, b], index) => (
                    <li key={index}>
                        {a} vs. {b}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchupList;
