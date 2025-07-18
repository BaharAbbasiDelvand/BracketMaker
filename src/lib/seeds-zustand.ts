import { create } from "zustand";

export interface SeedStore {
    seeds: string[];
    invalidIndexes: number[];
    setSeeds: (newSeeds: string[]) => void;
    setInvalidIndexes: (indexes: number[]) => void;
    addSeed: () => void;
    updateSeed: (index: number, value: string) => void;
}

export const useSeedStore = create<SeedStore>((set, get) => ({
    seeds: [""],
    invalidIndexes: [],
    setSeeds: (newSeeds: string[]) => set({ seeds: newSeeds }),
    setInvalidIndexes: (indexes: number[]) => set({ invalidIndexes: indexes }),
    addSeed: () => {
        const seeds = get().seeds;
        if (seeds.length < 30 && !seeds.includes("")) {
            set({ seeds: [...seeds, ""] });
        }
    },
    updateSeed: (index: number, value: string) => {
        const updated = [...get().seeds];
        updated[index] = value;
        set({ seeds: updated });
    },
}));
