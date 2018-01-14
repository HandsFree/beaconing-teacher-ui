// @flow

import type { Controller, Route } from './types';

/* eslint-disable no-restricted-syntax */

class Router {
    routes: Map<string, Controller> = new Map();

    initRoute(path: string, controller: Controller) {
        this.routes.set(path, controller);
    }

    setRoutes(routes: Array<Route>) {
        routes.forEach((routeObj) => {
            this.initRoute(routeObj.path, routeObj.controller);
        });
    }

    start() {
        this.initEvents();
        this.findController();
    }

    initEvents() {
        window.addEventListener('hashchange', this);
    }

    handleEvent() {
        this.findController();
    }

    async findController() {
        const { hash } = window.location;
        let path: string = hash.slice(1).split('?')[0];

        if (path === '') {
            path = '/';
        }

        // console.log(path);

        if (this.routes.has(path)) {
            const controller = this.routes.get(path);

            if (controller) {
                controller.start();
            }
        } else {
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = '<p>Error (404): Page not found</p>';
            }
        }
    }
}

export default Router;
