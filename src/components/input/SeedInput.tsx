import React, { useState } from "react";
import './seedinput.css';
import { useSeedStore } from "../../lib/seeds-zustand";

// type SeedInputProps = {
//     seeds: string[];
//     setSeeds: React.Dispatch<React.SetStateAction<string[]>>;
//     invalidIndexes: number[];
//     setInvalidIndexes: React.Dispatch<React.SetStateAction<number[]>>;
// };

const MAX_SEEDS = 30; //for now

const SeedInput: React.FC = ({  }) => {
    // const handleChange = (index: number, value: string) => {
    //     const updated = [...seeds];
    //     updated[index] = value;
    //     setSeeds(updated);
    // };
    const { seeds, invalidIndexes, updateSeed, addSeed, setInvalidIndexes } = useSeedStore();


   
    // const addSeed = () => {
    //     const lastIndex = seeds.length - 1;
    //     const lastValue = seeds[lastIndex];

    //     if (seeds.some((s, i) => i !== lastIndex && s === lastValue)) {
    //         setInvalidIndexes([lastIndex]);
    //         return;
    //     }

    //     setInvalidIndexes([]);
    //     if (seeds.length < MAX_SEEDS && !seeds.includes("")) {
    //         setSeeds([...seeds, ""]);
    //     }
    // };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Tab" && index === seeds.length - 1 && !e.shiftKey) {
            const lastValue = seeds[index];
            if (seeds.some((s: string, i: number) => i !== index && s === lastValue)) {
                e.preventDefault();
                setInvalidIndexes([index]);
                return;
            }
            setInvalidIndexes([]);
            addSeed();
            setTimeout(() => {
                const inputs =
                    document.querySelectorAll<HTMLInputElement>(".seed-input");
                inputs[inputs.length - 1]?.focus();
            }, 0);
        }
    };

    return (
        <div>
            {seeds.map((seed: string, index: number) => (
                <div key={index} className="seed-input-wrapper">
                    <input
                        value={seed}
                        onChange={(e) => updateSeed(index, e.target.value)}
                        placeholder={`Seed ${index + 1}`}
                        className={`seed-input ${
                            invalidIndexes.includes(index) ? "input-error" : ""
                        }`}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                    {invalidIndexes.includes(index) && (
                        <div className="input-error-text">Duplicate seed!</div>
                    )}
                </div>
            ))}
            <button onClick={addSeed} disabled={seeds.length >= MAX_SEEDS}>
                + Add Seed
            </button>
        </div>
    );
};

export default SeedInput;
