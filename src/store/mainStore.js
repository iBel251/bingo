import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useMainStore = create(
  devtools(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      activeGameSessions: null,
      completedGameSessions: null,
      setIsAuthenticated: (state) => set({ isAuthenticated: state }),
      setCurrentUser: (data) => set({ currentUser: data }),
      setActiveGameSessions: (data) => set({ activeGameSessions: data }),
      setCompletedGameSessions: (data) => set({ completedGameSessions: data }),
      logout: () => set({ isAuthenticated: false, currentUser: null }),
      updateUserBalance: (balance) =>
        set((state) => ({
          currentUser: { ...state.currentUser, balance: balance },
        })),
    }),
    "MainStore"
  )
);

const persistData = (store) => {
  const { name } = store;

  const persistedData = localStorage.getItem(name);

  if (persistedData) {
    store.setState(JSON.parse(persistedData));
  }

  store.subscribe((snapshot) => {
    localStorage.setItem(name, JSON.stringify(snapshot));
  });
};

persistData(useMainStore);

export default useMainStore;
