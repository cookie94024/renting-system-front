import create from "zustand";

const useUserStore = create((set) => ({
  token: undefined,
  setToken: (token) => set({ token }),
  removeToken: (token) => set({ token: undefined }),
}));

export default useUserStore;
