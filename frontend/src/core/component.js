// @flow

/* eslint-disable class-methods-use-this, no-restricted-syntax */

// use hyperscript to make elements, link components to elements

class RootComponent {
    containerID: string = 'app';
    view: HTMLElement;
    state: { [string]: any } = {};

    // preparePage({ path, locals = {} }: { path: string, locals: ?any }) {
    //     const render: Promise<string> = new Promise((resolve) => {
    //         import(/* webpackMode: "eager" */ `../modules/${path}.html`).then((template) => {
    //             resolve(template(locals));
    //         });
    //     });

    //     return render;
    // }

    updateView(view: HTMLElement) {
        if (document.body) {
            this.view = view;
            document.body.insertAdjacentElement('afterbegin', this.view);
        } else {
            throw new Error('[Beaconing] Document Body not found');
        }
    }

    async startLifecycle() {
        const element = await this.render();

        this.updateView(element);

        if (this.afterMount) {
            this.afterMount();
        }
    }

    async start() {
        this.startLifecycle();
        console.log('[Beaconing] Root Component Started!');
    }
}

class Component {
    state: { [string]: any } = {};
    view: HTMLElement;

    // preparePage({ path, locals = {} }: { path: string, locals: ?any }) {
    //     const render: Promise<string> = new Promise((resolve) => {
    //         import(/* webpackMode: "eager" */ `../modules/${path}.html`).then((template) => {
    //             resolve(template(locals));
    //         });
    //     });

    //     return render;
    // }

    // calls start function, binds updates, handles functions after mount, follow state
    async attach(data: { [string]: any } = {}) {
        this.start();

        const element = await this.render(data);

        this.view = element;

        return this.view;
    }

    async startLifecycle() {
        if (this.afterMount) {
            this.afterMount();
        }
    }

    async start() {
        this.startLifecycle();
        console.log(`[Beaconing] Started Component ${this.constructor.name}`);
    }
}

export default {
    Component,
    RootComponent,
};

export {
    Component,
    RootComponent,
};
