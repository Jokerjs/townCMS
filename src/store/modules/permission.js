import { asyncRouterMap, constantRouterMap } from '@/router'
import API from '@/api'
import AsyncRouter from '@/utils/treeAndRouter'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
          const permissions = data
          let accessedRouters
        if (permissions.permissions !== '0') {
              API.getResourcesRouter(permissions).then(response => {
                  if(response.data.code === 1){
                      const routerArr = response.data.data
                      const RouterMap = AsyncRouter.AsyncRouter(routerArr)
                      commit('SET_ROUTERS', RouterMap)
                      resolve()
                  }else {
                      console.log('获取路由资源404')
                  }
              })
            /*API.getPermissionsList(permissions).then(response => {
              if(response.data.code === 1){
                  const power = response.data.data[0].power
                  API.getResourcesRouter(power).then(response => {
                      if(response.data.code === 1){
                          console.log(response)
                          const routerArr = response.data.data
                          console.log(routerArr)
                          const RouterMap = AsyncRouter.AsyncRouter(routerArr)
                          commit('SET_ROUTERS', RouterMap)
                          resolve()
                      }else {
                        console.log('获取路由资源404')
                      }
                  })
              }else {
                  console.log('获取角色资源404')
              }
            })*/
          } else {
            console.log('走默认路由')
            accessedRouters = asyncRouterMap
            commit('SET_ROUTERS', accessedRouters)
            resolve()
          }
      })
    }
  }
}

export default permission
