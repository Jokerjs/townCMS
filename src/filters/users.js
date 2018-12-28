const usersOptions = {
    userTypeOptions: [
        { key: '100', display_name: '超级管理员' },
        { key: '10', display_name: '普通管理员' }
    ],
    userStateOptions: [
        { key: '1', display_type: 'success', display_name: '启用' },
        { key: '0', display_type: 'danger', display_name: '停用' }
    ]
}

export { usersOptions }

export function userTypeFilter(val) {
    if (!val) return
    return usersOptions.userTypeOptions.filter(o => {
        return o.key === val
    })[0].display_name
}

export function userStateFilterType(val) {
    if (!val) return
    return usersOptions.userStateOptions.filter(o => {
        return o.key === val
    })[0].display_type
}

export function userStateFilterName(val) {
    if (!val) return
    return usersOptions.userStateOptions.filter(o => {
        return o.key === val
    })[0].display_name
}