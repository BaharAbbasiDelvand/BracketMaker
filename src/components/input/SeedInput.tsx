import React, { useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useSeedStore } from "../../lib/seeds-zustand";
import "./seedinput.css";

const MAX_SEEDS = 30;

// pastel generator for inputs
const pastelColorGenerator = (i: number) => {
    const hue = (i * 47) % 360;
    return `hsl(${hue} 65% 92%)`;
};

const SeedInput: React.FC = () => {
    const { seeds, invalidIndexes, updateSeed, addSeed, setInvalidIndexes } =
        useSeedStore();
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [emptyError, setEmptyError] = useState<string | null>(null);

    const setInputRef = (el: HTMLInputElement | null, idx: number) => {
        inputsRef.current[idx] = el;
    };

    const handleAddSeed = () => {
        const emptyIndex = seeds.findIndex((s) => s.trim() === "");
        if (emptyIndex !== -1) {
            setEmptyError(
                "Give the empty seed a name before adding another one."
            );
            inputsRef.current[emptyIndex]?.focus();
            return;
        }
        setEmptyError(null);
        addSeed();
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Tab" && index === seeds.length - 1 && !e.shiftKey) {
            const lastValue = seeds[index];
            if (lastValue.trim() === "") {
                e.preventDefault();
                setEmptyError(
                    "Give the empty seed a name before adding another one."
                );
                return;
            }
            if (seeds.some((s, i) => i !== index && s === lastValue)) {
                e.preventDefault();
                setInvalidIndexes([index]);
                return;
            }
            setInvalidIndexes([]);
            setEmptyError(null);
            addSeed();
            requestAnimationFrame(() =>
                inputsRef.current[seeds.length]?.focus()
            );
        }
    };

    return (
        <div className="d-flex flex-column gap-3">
            {seeds.map((seed: string, index: number) => {
                const hasError = invalidIndexes.includes(index);
                const hasEmptyError =
                    emptyError !== null && seed.trim() === "";
                return (
                    <div key={index}>
                        <input
                            ref={(el) => setInputRef(el, index)}
                            value={seed}
                            onChange={(e) => {
                                setEmptyError(null);
                                updateSeed(index, e.currentTarget.value);
                            }}
                            placeholder={`Seed ${index + 1}`}
                            className={`form-control form-control-lg ${
                                hasError || hasEmptyError ? "is-invalid" : ""
                            }`}
                            style={{
                                backgroundColor: pastelColorGenerator(index),
                                borderRadius: "0.75rem",
                            }}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                        {hasError && (
                            <div className="invalid-feedback d-block">
                                Duplicate seed!
                            </div>
                        )}
                    </div>
                );
            })}

            {emptyError && (
                <div className="seed-empty-error" role="alert">
                    <TriangleAlert size={18} strokeWidth={2.2} />
                    {emptyError}
                </div>
            )}

            <button
                type="button"
                onClick={handleAddSeed}
                disabled={seeds.length >= MAX_SEEDS}
                className="btn btn-primary btn-lg rounded-pill shadow-sm align-self-start rr-add-seed"
            >
                + Add seed
            </button>
        </div>
    );
};

export default SeedInput;
