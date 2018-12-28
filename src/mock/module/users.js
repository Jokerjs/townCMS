// import Mock from 'mockjs'
import { param2Obj } from '@/utils'

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
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
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
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
]

export default {
    getUsersList: config => {
        const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

        let mockList = userMap.filter(item => {
            if (importance && item.importance !== +importance) return false
            if (type && item.type !== type) return false
            if (title && item.title.indexOf(title) < 0) return false
            return true
        })

        if (sort === '-id') {
            mockList = mockList.reverse()
        }

        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

        return {
            'code': 1,
            'data': pageList,
            'total': mockList.length,
            'message': '操作成功',
            'success': true
        }
    },
    createUsers: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true

    }),
    delUsers: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    }),
    updateUsers: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    })
}
