import { GetRoleList } from '@/api/role'

export default {
  namespaced: true,
  state: () => ({ roleList: [] }),
  mutations: {
    SETROLELIST(state, list) {
      state.roleList = list
    }
  },
  actions: {
    async GETROLELIST({ commit }) {
      const res = await GetRoleList()
      commit('SETROLELIST', res)
    }
  }
}
