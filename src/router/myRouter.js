let Vue = null;

// 用来存储当前路由
class HistoryRoute {
	constructor() {
		this.current = null;
	}
}

class Router {
	constructor(options) {
		// 路由模式, 默认为 hash
		this.mode = options.mode || 'hash';
		// 路由表
		this.routes = options.routes || [];
		// 将路由表转换为 k-v 形式
		this.routeMap = this.createMap(this.routes);

		this.history = new HistoryRoute();
		
		this.init();

	}

	createMap(routes){
		return routes.reduce((a, c) => {
			const { path, component } = c;
			a[path] = component;
			return a;
		}, {});
	}

	init() {
		const { mode } = this;
		if(mode === 'hash') {
			location.hash ? '' : location.hash = '/';
			window.addEventListener('load', () => {
				this.history.current = location.hash.slice(1);
			});
			window.addEventListener('hashchange', () => {
				this.history.current = location.hash.slice(1);
			});
		} else if(mode === 'history') {
			location.pathname ? '' : location.pathname = '/';
			window.addEventListener('load', () => {
				this.history.current = location.pathname;
			});
			window.addEventListener('popstate', () => {
				this.history.current = location.pathname;
			});
		}
	}

	// 插件方法
	static install(vue){
		Vue = vue;
		// 为每个组件分发 router
		Vue.mixin({
			beforeCreate() {
				if(this.$options && this.$options.router) { // 如果是根组件
					this._root = this;
					this._router = this.$options.router;
					// 监听 this._router.history。
					// [依赖收集] router-view 的组件依赖的 watcher 将 this._router.history 收集到 dep 收集器中。
					// [触发依赖] 只要该对象发生变化，this._router.history 对应的 dep 收集器就会通知 router-view 
					// 的组件依赖的 watcher 执行 update()，就会使得 router-view 重新渲染。
					Vue.util.defineReactive(this, '_route', this._router.history);
				} else { // 如果是子组件
					this._root = this.$parent && this.$parent._root;
				}
				// 代理 $router
				Object.defineProperty(this, '$router', {
					get() {
						return this._root._router;
					}
				});
				// 代理 $route
				Object.defineProperty(this, '$route', {
					get() {
						return this._root._router.history.current;
					}
				});
			}
		})
		// 挂载 router-link/router-view 组件
		Vue.component('router-link', {
			props: {
				to: String,
			},
			render(h){
				const mode = this._self._root._router.mode;
				const to = mode === 'hash' ? '#' + this.to : this.to;
				return h('a', {
					attrs:{href: to},
					on:{
						click: (e) => {
							if(mode === 'history') {
								// 拦截<a>标签默认跳转
								e.preventDefault();
								history.pushState(null, '', to);
								// 手动触发
								this._self._root._router.history.current = to;
							}
						}
					}
				}, this.$slots.default);
			}
		});
		Vue.component('router-view', {
			render(h) {
				// this 为 Vue 代理的对象Proxy，实际值为 this._self
				const current = this._self._root._router.history.current;
				const routeMap = this._self._root._router.routeMap;
				return h(routeMap[current]);
			}
		})
	}
}



export default Router;