import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from "../index";

const user = {
  state: {
      userName: '',
      userType: '',
      userPhone: '',
      token: getToken(),
      userState: '',
      permissions: '',
      introduction: '',
      avatar: ''
  },

  mutations: {
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_USERTYPE: (state, userType) => {
      state.userType = userType
    },
    SET_USERPHONE: (state, userPhone) => {
      state.userPhone = userPhone
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERSTATE: (state, userState) => {
      state.userState = userState
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
            if(  response.data.code ===1 ){
                const data = response.data.data
                commit('SET_TOKEN', data[0].token)
                setToken(data[0].token)
                resolve(response)
            } else if( response.data.code ===2) {
                resolve(response)
            } else if(response.data.code ===3){
                resolve(response)
            }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (response.data.code === 1) { // 由于mockjs 不支持自定义状态码只能这样hack
              const data = response.data.data
              if(data.permissions !== ''){
                  commit('SET_USERNAME', data.userName)
                  commit('SET_AVATAR', data.avatar)
                  commit('SET_INTRODUCTION', data.introduction)
                  commit('SET_PERMISSIONS', data.permissions)
                  resolve(store.getters)
              }else {
                  console.log('定义permissions为0')
                  commit('SET_PERMISSIONS', '0')
                  resolve(store.getters)
              }
          }else {
              console.log('拉取用户信息失败')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
