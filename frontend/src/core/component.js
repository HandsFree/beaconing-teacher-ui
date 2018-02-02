// @flow

/* eslint-disable class-methods-use-this, no-restricted-syntax */

class RootComponent {
    containerID: string = 'app';
    view: HTMLElement | Array<HTMLElement>;
    state: { [string]: any } = {};
    params: { [string]: string } = {};

    updateView(view: HTMLElement) {
        if (document.body) {
            const app = document.getElementById(this.containerID);

            if (app) {
                document.body.removeChild(app);
            }

            this.view = view;
            document.body.insertAdjacentElement('afterbegin', this.view);
        } else {
            throw new Error('[Beaconing] Document Body not found');
        }
    }

    appendView(view: HTMLElement) {
        if (!this.view) {
            this.view = [];
        }

        if (document.body) {
            this.view.push(view);
            document.body.appendChild(view);
        } else {
            throw new Error('[Beaconing] Document Body not found');
        }
    }

    async doRender() {
        const element = await this.render();

        if (Array.isArray(element)) {
            for (const view of element) {
                this.appendView(view);
            }
        } else {
            this.updateView(element);
        }
    }

    async start(params: { [string]: string }) {
        if (params) {
            this.params = params;
        }

        if (this.init) {
            await this.init();
        }

        await this.doRender();

        if (this.afterMount) {
            await this.afterMount();
        }

        console.log('[Beaconing] Root Component Started!');
    }
}

class Component {
    state: { [string]: any } = {};
    view: HTMLElement;
    props: { [string]: any } = {};

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

    async attach(props: { [string]: any } = {}) {
        this.props = props;

        const func = this.start();

        const prom = func.next();

        return prom.then((el) => {
            func.next();
            return el.value;
        });
    }

    async doRender() {
        const element = await this.render();
        this.view = element;
        return this.view;
    }

    // not sure how to do async generators in flow
    // ALSO this is pretty hacky right now
    async* start(): AsyncGenerator<> {
        if (this.init) {
            await this.init();
        }

        yield await this.doRender();

        if (this.afterMount) {
            await this.afterMount();
        }

        return console.log(`[Beaconing] Started Component ${this.constructor.name}`);
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
