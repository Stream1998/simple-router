import Vue from 'vue';
import Router from './myRouter';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';

Vue.use(Router);

const routes = [
	// {
	// 	path: '/',
	// 	redirect: '/home',	
	// },
	{
		path: '/home',
		name: 'Home',
		component: Home,
	},
	{
		path: '/about',
		name: 'About',
		component: About
	}
];

const router = new Router({
	mode: 'hash',
	routes,	
})

export default router;