import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      sub:"",
      isLogin: false,
      email: "",
      profile: "",
        name:"",
      setUser: ({sub,  email, profile, name }) => set({sub,  isLogin: true, email, profile, name  }),
      logout: () => set({ isLogin: false, email: "", profile: "" , name:"", sub :""}),
    }),
    {
      name: "user-storage", 
    }
  )
);

export default useUserStore;
