import type { CurrentUserData } from "~/utils/currentUserTokenDecoder";
import { redirectToID } from "~/middleware/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as CurrentUserData | null,
    token: null as string | null,
    loadingLogin: true as boolean,
    permitUserLocation: 'prompt' as PermissionState,
    userLocation: null as [number, number] | null
  }),

  getters: {
    loggedIn: (state) => Boolean(state.user),
    getPermitUserLocation: (state) => state.permitUserLocation,
    getUserLocation: (state) => state.userLocation,
  },
  actions: {
    setUser(user: CurrentUserData | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setLoadingLogin(val: boolean) {
      this.loadingLogin = val;
    },

    setPermissionUserLocation(permission: PermissionState) {
      this.permitUserLocation = permission
    },

    setUserLocation(coords: [number, number] | null) {
      this.userLocation = coords;
    },

    async logOut() {
      try {
        console.log("🚪 Logging out...");

        // await $fetch("/api/v1/logout", {
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${this.token}`,
        //   },
        // }).catch((error) => console.warn("⚠️ Logout request failed:", error));

        // Clear user data
        this.setUser(null);
        this.setToken(null);

        // Reset session storage to anonymous mode
        sessionStorage.setItem("anonymousMode", "true");
        const config = useRuntimeConfig();
        redirectToID(config.public.siteUrl);

        console.log("✅ Successfully logged out.");
      } catch (error) {
        console.error("🚨 Error during logout:", error);
      }
    },
  }
})