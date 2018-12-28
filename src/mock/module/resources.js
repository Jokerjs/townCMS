// import Mock from 'mockjs'
// import { param2Obj, param } from '@/utils'
const preList = [
    {
        permissId: 'superAdmin',
        permissName: '超级管理员',
        permissTitle: '超级管理员',
        power: ['usersId', 'users', 'pre', 'res', 'errorId', '404Id', '401Id', 'ziyuan']
    },
    {
        permissId: 'Admin',
        permissName: '测试管理员',
        permissTitle: '测试管理员',
        power: ['usersId', 'users', 'pre']
    }
]
const List = [
    {
        resourcesId: 'usersId',
        label: '管理员菜单',
        describe: '管理员',
        type: '0',
        sortId: '0',
        parentId: '0',
        componentPath: 'users/usersTable',
        routePath: 'users',
        api: '',
        icon: 'v-icon v-icon-guanliyuan'
    },
    {
        resourcesId: 'users',
        label: '用户管理',
        describe: '用户管理',
        type: '0',
        sortId: '0',
        parentId: 'usersId',
        componentPath: 'users/usersTable',
        routePath: 'UsersTable',
        api: '',
        icon: ''
    },
    {
        resourcesId: 'pre',
        label: '用户权限',
        describe: '用户权限',
        type: '0',
        sortId: '0',
        parentId: 'usersId',
        componentPath: 'users/usersPermissions',
        routePath: 'UsersPermissions',
        api: '',
        icon: ''
    },
    {
        resourcesId: 'res',
        label: '资源管理',
        describe: '资源管理',
        type: '0',
        sortId: '0',
        parentId: 'usersId',
        componentPath: 'users/usersResources',
        routePath: 'UsersResources',
        api: '',
        icon: ''
    },
    {
        resourcesId: 'errorId',
        label: '错误',
        describe: '错误错误',
        type: '0',
        sortId: '0',
        parentId: '0',
        componentPath: 'error',
        routePath: 'error',
        api: '',
        icon: 'v-icon v-icon-biaoge'
    },
    {
        resourcesId: '404Id',
        label: '404',
        describe: '404',
        type: '0',
        sortId: '0',
        parentId: 'errorId',
        componentPath: 'errorPage/404',
        routePath: 'Page404',
        api: '',
        icon: ''
    },
    {
        resourcesId: '401Id',
        label: '401',
        describe: '401',
        type: '0',
        sortId: '0',
        parentId: 'errorId',
        componentPath: 'errorPage/401',
        routePath: 'Page401',
        api: '',
        icon: ''
    },
    {
        resourcesId: "ziyuan",
        label: '资源描述',
        describe: '资源描述资源描述',
        type: '1',
        sortId: '0',
        parentId: 'res',
        componentPath: '',
        routePath: '',
        api: '/ziyuan/ziyuan',
        icon: ''
    }
]

export default {
    getAllResources: () => {
        return {
            'code': 1,
            'data': List,
            'message': '操作成功',
            'success': true
        }
    },
    getResourcesRouter: data => {
        const permissions = eval('(' + data.body + ')')
        const treeList = []
        let filterList = preList.filter(item => {
            if (permissions.permissions && item.permissId !== permissions.permissions) return false
            return true
        })
        const powerArr = filterList[0].power
        for(let i = 0; i < powerArr.length; i++){
            let routerList = List.filter(item => {
                if (powerArr[i] && item.resourcesId !== powerArr[i]) return false
                return true
            })
            treeList.push(routerList[0])
        }
        return {
            'code': 1,
            'data': treeList,
            'message': '操作成功',
            'success': true
        }
    },
    getResourcesList: data => {
        // const powerArr = ['usersId', 'users', 'pre', 'res', 'errorId', '407Id', '401Id', 'ziyuan']
        const powerArr = eval('(' + data.body + ')')
        const treeList = []
        for(let i = 0; i < powerArr.length; i++){
            let filterList = List.filter(item => {
                if (powerArr[i] && item.resourcesId !== powerArr[i]) return false
                return true
            })
            treeList.push(filterList[0])
        }
        return {
            'code': 1,
            'data': treeList,
            'message': '操作成功',
            'success': true
        }
    },
    createResources: data => {
        const newData = eval('(' + data.body + ')')
        return {
            'code': 1,
            'data': newData,
            'message': '操作成功',
            'success': true
        }
    },
    delResources: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    }),
    updateResources: () => ({
        'code': 1,
        'data': 'success',
        'message': '操作成功',
        'success': true
    })
}
