const getters = {
  sidebar: state => state.app.sidebar,
  // language: state => state.app.language,
  // size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userName,
  introduction: state => state.user.introduction,
  status: state => state.user.userState,
  permissions: state => state.user.permissions,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  userPermissions: state => state.app.userPermissions
}
export default getters
