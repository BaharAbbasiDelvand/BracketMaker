import React from "react";

type Props = {
    seeds: string[];
    setSeeds: React.Dispatch<React.SetStateAction<string[]>>;
};

const MAX_SEEDS = 30; //for now

const SeedInputList: React.FC<Props> = ({ seeds, setSeeds }) => {
    const handleChange = (index: number, value: string) => {
        const updated = [...seeds];
        updated[index] = value;
        setSeeds(updated);
    };

    const addSeed = () => {
        if (seeds.length < MAX_SEEDS) {
            setSeeds([...seeds, ""]);
        }
    };

    return (
        <div>
            {seeds.map((seed, index) => (
                <input
                    key={index}
                    value={seed}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder={`Seed ${index + 1}`}
                    className="seed-input"
                />
            ))}
            <button onClick={addSeed} disabled={seeds.length >= MAX_SEEDS}>
                + Add Seed
            </button>
        </div>
    );
};

export default SeedInputList;
