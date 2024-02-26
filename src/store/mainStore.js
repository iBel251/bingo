import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useMainStore = create(
  devtools(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      activeGameSessions: null,
      setIsAuthenticated: (state) => set({ isAuthenticated: state }),
      setCurrentUser: (data) => set({ currentUser: data }),
      setActiveGameSessions: (data) => set({ activeGameSessions: data }),
      logout: () => set({ isAuthenticated: false, currentUser: null }),
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
