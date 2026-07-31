const snapPoints = {
  collapsed: 0.15,
  partial: 0.4,
  full: 0.6
}

export const useDrawerStore = defineStore("drawer", {
    state: () => ({
        activeSnapPoint: snapPoints.collapsed,
    }),
    getters: {
        getActiveSnapPoint: (state) => state.activeSnapPoint
    },
    actions: {
        setCollapsed(){
            this.activeSnapPoint = snapPoints.collapsed
        },
        setPartial(){
            this.activeSnapPoint = snapPoints.partial
        },
        setFull(){
            this.activeSnapPoint = snapPoints.full
        },
    }
})