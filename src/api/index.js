import request from '@/utils/request'

export default {

    /*用户管理*/
    getUsersList: (query) => {
        return request({ url: '/users/getList', method: 'get', params: query })
    },
    createUsers: (data) => {
        return request({url: '/users/createOne', method: 'post', data})
    },
    delUsers: (query) => {
        return request({ url: '/users/delUsers', method: 'get', params: query })
    },
    updateUsers: (data) => {
        return request({url: '/users/updateOne', method: 'post', data})
    },

    /*角色管理*/
    getPermissionsList: (query) => {
        return request({ url: '/permissions/getList', method: 'get', params: query })
    },
    createPermissions: (data) => {
        return request({ url: '/permissions/createOne', method: 'post', data })
    },
    delPermissions: (query) => {
        return request({url: '/permissions/delPermissions', method: 'get', params: query})
    },
    updatePermissions: (data) => {
        return request({ url: '/permissions/updateOne', method: 'post', data })
    },
    updatePower: (data) => {
        return request({ url: '/permissions/updatePower', method: 'post', data })
    },

    /*资源管理*/
    getAllResources: (query) => {
        return request({ url: '/resources/getAllList', method: 'get', params: query })
    },
    getResourcesRouter: (data) => {
        return request({ url: '/resources/getRouter', method: 'post', data })
    },
    getResourcesList: (data) => {
        return request({ url: '/resources/getList', method: 'post', data })
    },
    createResources: (data) => {
        return request({url: '/resources/createOne', method: 'post', data})
    },
    delResources: (query) => {
        return request({ url: '/resources/delResources', method: 'get', params: query })
    },
    updateResources: (data) => {
        return request({ url: '/resources/updateOne', method: 'post', data })
    }

}