const Layout = () => import('@/layout/index.vue')
export default {
	path: '/error',
	redirect: '/error/403',
	component: Layout,
	meta: {
		title: '异常页面',
		isShow: false,
		icon: 'error',
		rank: 2,
		permission: 'all'
	},
	children: [
		{
			path: '/error/403',
			name: '403',
			component: () => import('@/views/error/403.vue'),
			meta: {
				title: '403'
			}
		},
		{
			// path: '/error/404',
			// 这里将不存在的路径进行跳转到404页面
			path: '/:pathMatch(.*)*',
			name: '404',
			component: () => import('@/views/error/404.vue'),
			meta: {
				title: '404'
			}
		},
		{
			path: '/error/500',
			name: '500',
			component: () => import('@/views/error/500.vue'),
			meta: {
				title: '500'
			}
		}
	]
} as RouteConfigsTable
