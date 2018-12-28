import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

import usersAPI from './module/users'
import permissionsAPI from './module/permissions'
import resourcesAPI from './module/resources'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 用户管理
Mock.mock(/\/users\/getList/, 'get', usersAPI.getUsersList)
Mock.mock(/\/users\/createOne/, 'post', usersAPI.createUsers)
Mock.mock(/\/users\/delUsers/, 'get', usersAPI.delUsers)
Mock.mock(/\/users\/updateOne/, 'post', usersAPI.updateUsers)

// 角色管理
Mock.mock(/\/permissions\/getList/, 'get', permissionsAPI.getPermissionsList)
Mock.mock(/\/permissions\/createOne/, 'post', permissionsAPI.createPermissions)
Mock.mock(/\/permissions\/delPermissions/, 'get', permissionsAPI.delPermissions)
Mock.mock(/\/permissions\/updateOne/, 'post', permissionsAPI.updatePermissions)
Mock.mock(/\/permissions\/updatePower/, 'post', permissionsAPI.updatePower)

// 资源管理
Mock.mock(/\/resources\/getAllList/, 'get', resourcesAPI.getAllResources)
Mock.mock(/\/resources\/getRouter/, 'post', resourcesAPI.getResourcesRouter)
Mock.mock(/\/resources\/getList/, 'post', resourcesAPI.getResourcesList)
Mock.mock(/\/resources\/createOne/, 'post', resourcesAPI.createResources)
Mock.mock(/\/resources\/delResources/, 'get', resourcesAPI.delResources)
Mock.mock(/\/resources\/updateOne/, 'post', resourcesAPI.updateResources)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock
