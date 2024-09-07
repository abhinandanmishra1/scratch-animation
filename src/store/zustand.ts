import { create } from "zustand";
import { createRef } from "react";

type Store = {
  ref: React.RefObject<HTMLDivElement>;
};

export const useScratchStore = create<Store>()(() => ({
  ref: createRef<HTMLDivElement>(),
}));
