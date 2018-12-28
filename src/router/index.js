import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
//import usersRouter from './modules/users'
export const constantRouterMap = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/users/usersTable'),
                name: 'dashboard',
                meta: { title: '首页', icon: 'v-icon v-icon-biaoge', noCache: true }
            }
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
]

export const asyncRouterMap = [
    {
        path: '/error',
        component: Layout,
        redirect: '/error/404',
        name: 'ErrorPages',
        meta: {
            title: '错误',
            icon: 'v-icon v-icon-biaoge'
        },
        children: [
            {
                path: '401',
                component: () => import('@/views/errorPage/401'),
                name: 'Page401',
                meta: { title: 'page401', noCache: true }
            },
            {
                path: '404',
                component: () => import('@/views/errorPage/404'),
                name: 'Page404',
                meta: { title: 'page404', noCache: true }
            }
        ]
    }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})