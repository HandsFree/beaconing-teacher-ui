// @flow
import type { RootComponentInterface } from './component';

type Route = {
    path: string,
    controller: RootComponentInterface,
};

class Router {
    routes: Map<string, RootComponentInterface> = new Map();
    params: { [string]: string } = {};

    initRoute(path: string, controller: RootComponentInterface) {
        this.routes.set(path, controller);
    }

    setRoutes(routes: Array<Route>) {
        routes.forEach((routeObj) => {
            this.initRoute(routeObj.path, routeObj.controller);
        });
    }

    getParams() {
        const path = window.location.href;

        if (/\?/g.test(path)) {
            const index: number = path.search(/\?/g);
            const query: string = path.substr(index + 1);
            const vars: string[] = query.split('&');
            const params: { [string]: string } = {};

            vars.forEach((value) => {
                const [first, second] = value.split('=').filter(v => v !== '=');

                params[first] = second;
            });

            this.params = params;
        }
    }

    start() {
        this.getParams();
        this.initEvents();
        this.findController();
    }

    initEvents() {
        window.addEventListener('hashchange', this);
    }

    handleEvent() {
        this.getParams();
        this.findController();
    }

    async findController() {
        const { hash } = window.location;
        let path: string = hash.slice(1).split('?')[0];

        if (path === '') {
            path = '/';
        }

        // console.log(this.routes);

        if (this.routes.has(path)) {
            const controller = this.routes.get(path);

            if (controller) {
                controller.params = this.params;
                controller.start();
            }
        } else {
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `<p>${await window.bcnI18n.getPhrase('err_404')}</p>`;
            }
        }
    }
}

export default Router;
