import { param2Obj } from '@/utils'

/*const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}*/
const userMap = [
    {
        userId: 'admin',
        userName: 'admin',
        token: 'admin',
        userType: '100',
        userPhone: '156784857589',
        userState: 'true',
        permissions: 'superAdmin',
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    },
    {
        userId: 'editor',
        userName: 'editor',
        token: 'editor',
        userType: '10',
        userPhone: '15689547412',
        userState: 'true',
        permissions: 'Admin',
        introduction: '我是测试',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
]

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
      let mockList = userMap.filter(item => {
          if (username && item.userName !== username) return false
          return true
      })
    return mockList
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
      let mockList = userMap.filter(item => {
          if (token && item.token !== token) return false
          return true
      })
    if (mockList) {
      return {
            'code': 1,
            'data': mockList,
            'message': '操作成功',
            'success': true
        }
    } else {
      return false
    }
  },
  logout: () => 'success'
}
