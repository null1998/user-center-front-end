import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    id: '',
    unitId: '',
    nickname: '',
    zoneId: '',
    provinceZoneId: '',
    unitLevel: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_UNIT_ID: (state, unitId) => {
    state.unitId = unitId
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_ZONE_ID: (state, zoneId) => {
    state.zoneId = zoneId
  },
  SET_PROVINCE_ZONE_ID: (state, provinceZoneId) => {
    state.provinceZoneId = provinceZoneId
  },
  SET_UNIT_LEVEL: (state, unitLevel) => {
    state.unitLevel = unitLevel
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // 首次登录返回的token保存在本地
        if (response.head.accessToken) {
          commit('SET_TOKEN', response.head.accessToken)

          setToken(response.head.accessToken)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { body } = response

        if (!body) {
          return reject('获取用户信息失败，重新登录')
        }
        const { username, avatar, roleNameList, unitId, nickname, zoneId, provinceZoneId, id, unitLevel } = body.data

        if (roleNameList.length === 0) {
          roleNameList.push('tourist')
        }
        commit('SET_ID', id)
        commit('SET_ROLES', roleNameList)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_UNIT_ID', unitId)
        commit('SET_NICKNAME', nickname)
        commit('SET_ZONE_ID', zoneId)
        commit('SET_PROVINCE_ZONE_ID', provinceZoneId)
        commit('SET_UNIT_LEVEL', unitLevel)
        resolve(body.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  refreshToken({ commit }, accessToken) {
    return new Promise(resolve => {
      commit('SET_TOKEN', accessToken)
      setToken(accessToken)
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

