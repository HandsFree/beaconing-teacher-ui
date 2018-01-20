// @flow

/* eslint-disable class-methods-use-this, no-restricted-syntax */

// use hyperscript to make elements, link components to elements

class RootComponent {
    containerID: string = 'app';
    view: HTMLElement;
    state: { [string]: any } = {};

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

    updateView(view: HTMLElement) {
        if (document.readyState !== 'complete') {
            document.body.onload = () => {
                if (this.view.parentElement) {
                    this.view.parentElement.replaceChild(view, this.view);
                    this.view = view;
                }
            };
        } else if (this.view.parentElement) {
            this.view.parentElement.replaceChild(view, this.view);
            this.view = view;
        }
    }

    appendView(view: HTMLElement) {
        this.view.appendChild(view);
    }

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
