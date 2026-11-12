import React, { useRef, useState } from "react";
import { TriangleAlert, Plus, X } from "lucide-react";
import { useSeedStore } from "../../lib/seeds-zustand";
import "./seedinput.css";

const MAX_SEEDS = 30;

const SeedInput: React.FC = () => {
    const {
        seeds,
        invalidIndexes,
        updateSeed,
        addSeed,
        removeSeed,
        setInvalidIndexes,
    } = useSeedStore();
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
        requestAnimationFrame(() => inputsRef.current[seeds.length]?.focus());
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
        <div className="seed-list">
            {seeds.map((seed: string, index: number) => {
                const hasError = invalidIndexes.includes(index);
                const hasEmptyError =
                    emptyError !== null && seed.trim() === "";
                const invalid = hasError || hasEmptyError;

                return (
                    <div className="seed-row-wrap" key={index}>
                        <div className="seed-row">
                            <span className="seed-row__num">{index + 1}</span>
                            <input
                                ref={(el) => setInputRef(el, index)}
                                value={seed}
                                onChange={(e) => {
                                    setEmptyError(null);
                                    updateSeed(index, e.currentTarget.value);
                                }}
                                placeholder={`Seed ${index + 1}`}
                                className={`seed-input ${
                                    invalid ? "seed-input--invalid" : ""
                                }`}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                            <button
                                type="button"
                                className="seed-row__remove"
                                onClick={() => removeSeed(index)}
                                disabled={seeds.length <= 1}
                                aria-label={`Remove seed ${index + 1}`}
                                title="Remove seed"
                            >
                                <X size={16} strokeWidth={2.4} />
                            </button>
                        </div>
                        {hasError && (
                            <p className="seed-row__error">Duplicate seed</p>
                        )}
                    </div>
                );
            })}

            {emptyError && (
                <div className="seed-empty-error" role="alert">
                    <TriangleAlert size={16} strokeWidth={2.2} />
                    {emptyError}
                </div>
            )}

            <button
                type="button"
                onClick={handleAddSeed}
                disabled={seeds.length >= MAX_SEEDS}
                className="rr-add-seed"
            >
                <Plus size={17} strokeWidth={2.6} />
                Add seed
            </button>
        </div>
    );
};

export default SeedInput;
