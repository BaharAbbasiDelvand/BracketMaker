import React from "react";

type Props = {
    seeds: string[];
    setSeeds: React.Dispatch<React.SetStateAction<string[]>>;
};

const MAX_SEEDS = 30; //for now

const SeedInputList: React.FC<Props> = ({ seeds, setSeeds }) => {
    const handleChange = (index: number, value: string) => {
        const trimmedValue = value.trim();
        const isDuplicate = seeds.some((s, i) => i !== index && s === trimmedValue);
        if (isDuplicate) {
            alert(`"${trimmedValue}" is already entered as a seed.`);
            return;
        }
        const updated = [...seeds];
        updated[index] = trimmedValue;
        setSeeds(updated);
    };
    const addSeed = () => {
        if (seeds.length < MAX_SEEDS && !seeds.includes("")) {
            setSeeds([...seeds, ""]);
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Tab" && index === seeds.length - 1 && !e.shiftKey) {
            addSeed(); 
            setTimeout(() => {
                const inputs = document.querySelectorAll<HTMLInputElement>(".seed-input");
                inputs[inputs.length - 1]?.focus();
            }, 0);
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
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
            <button onClick={addSeed} disabled={seeds.length >= MAX_SEEDS}>
                + Add Seed
            </button>
        </div>
    );
};

export default SeedInputList;
