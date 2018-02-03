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

    async start() {
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
        let parent = this.view.parentElement || null;

        if (Array.isArray(this.view)) {
            parent = this.view[0].parentElement;
        }

        const func = () => {
            if (parent) {
                if (Array.isArray(this.view)) {
                    for (const el of this.view) {
                        parent.removeChild(el);
                    }
                    return;
                }
    
                if (!Array.isArray(this.view) && Array.isArray(view)) {
                    parent.removeChild(this.view);
                }
    
                if (Array.isArray(view)) {
                    const firstEl = view[0];
    
                    parent.insertAdjacentElement('afterbegin', firstEl);
    
                    for (let i = 1; i < view.length; i++) {
                        view[i - 1].insertAdjacentElement('afterend', view[i]);
                    }
    
                    this.view = view;
                    return;
                }
    
                parent.replaceChild(view, this.view);
                this.view = view;
            }
        };

        if (document.readyState !== 'complete') {
            document.body.onload = () => {
                func();
            };
            return;
        }
        
        func();
    }

    appendView(view: HTMLElement) {
        // TODO: implement arrays
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

        if (this.render) {
            yield await this.doRender();
        }

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
