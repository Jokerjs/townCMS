// import Mock from 'mockjs'
import { param2Obj } from '@/utils'


// const count = 2
const List = [
    {
        permissId: 'superAdmin',
        permissName: '超级管理员',
        permissTitle: '超级管理员',
        power: ['usersId', 'users', 'pre', 'res', 'errorId', '404Id', '401Id', 'ziyuan']
    },
    {
        permissId: 'Admin',
        permissName: '测试d管理员',
        permissTitle: '测试管理员',
        power: ['usersId', 'users', 'pre']
    }
]

export default {
    getPermissionsList: config => {
        const {  permissions, page = 1, limit = 20, sort } = param2Obj(config.url)
        let mockList = List.filter(item => {
            if (permissions && item.permissId !== permissions) return false
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
    createPermissions: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true

    }),
    delPermissions: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    }),
    updatePermissions: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    }),
    updatePower: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    })
}
