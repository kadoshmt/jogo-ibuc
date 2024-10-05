import { create } from 'zustand';

interface LoaderState {
  loader: boolean;
  setLoader: (value: boolean) => void;
  isLoaderActive: () => boolean;
}

const loaderStore = create<LoaderState>((set, get) => ({
  loader: false,
  setLoader: (value: boolean) => set({ loader: value }),
  isLoaderActive: () => get().loader,
}));

export default loaderStore;
