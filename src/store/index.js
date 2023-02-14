import { createStore } from 'vuex'
import app from './modules/app'
import role from './modules/role'
import getters from './getters'
export default createStore({
  modules: {
    app,
    role
  },
  getters
})
