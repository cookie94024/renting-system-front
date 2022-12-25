import create from "zustand";

export type User = {
  id: number;
  member_addr: string;
  member_birth: string;
  member_name: string;
  member_sex: string;
  member_phone: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

const useUserStore = create<{
  user?: User;
  token?: string;
  setToken: (token: string) => void;
  removeToken: (token: string) => void;
  setUser;
}>((set) => ({
  token: undefined,
  user: undefined,
  setToken: (token) => set({ token }),
  removeToken: () => set({ token: undefined }),
  setUser: (user: User) => set({ user }),
}));

export default useUserStore;
