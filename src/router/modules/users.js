/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const usersRouter = {
  path: '/users',
  component: Layout,
  redirect: '/users',
  name: 'users',
  meta: {
    title: '管理员',
    icon: 'v-icon v-icon-guanliyuan'
  },
  children: [
    {
      path: 'admin',
      component: () => import('@/views/users/usersTable'),
      name: 'admin',
      meta: { title: '用户管理', noCache: true }
    },
    {
        path: 'permissions',
        component: () => import('@/views/users/usersPermissions'),
        name: 'permissions',
        meta: { title: '用户权限', noCache: true }
    },
    {
        path: 'resources',
        component: () => import('@/views/users/usersResources'),
        name: 'resources',
        meta: { title: '资源管理', noCache: true }
    }
  ]
}

export default usersRouter
