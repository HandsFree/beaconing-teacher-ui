// @flow
import nullishCheck from './util';

export interface RootComponentInterface {
    // render(): Promise<HTMLElement>;
    start(): void;
    emit(name: string): void;
    doRender(): Promise<void>;
    triggerLoadedEvent(): void;
    appendView(view: HTMLElement): void;
    handleHooks(): Promise<void>;
    updateView(view: HTMLElement): void;
    params: { [string]: string };
    containerID: string;
    view: HTMLElement | Array<HTMLElement>;
    state: { [string]: any };
    loadEvent: Event;
    loadDone: boolean;
    updateHooks: { [string]: Function };
}

export interface ComponentInterface {
    // render(): Promise<HTMLElement>;
    start(): AsyncGenerator<>;
    attach(props: { [string]: any }): Promise<HTMLElement>;
    handleAfterLoad(): Promise<void>;
    removeSelf(): void;
    emit(name: string): void;
    doRender(): Promise<void>;
    appendView(view: HTMLElement): void;
    handleHooks(): Promise<void>;
    updateView(view: HTMLElement): void;
    state: { [string]: any };
    view: HTMLElement;
    props: { [string]: any };
    updateHooks: { [string]: Function };
}

class RootComponent implements RootComponentInterface {
    containerID: string = 'app';

    view: HTMLElement | Array<HTMLElement>;

    state: { [string]: any } = {};

    params: { [string]: string } = {};

    loadEvent: Event = new Event('UILoaded');

    loadDone: boolean = false;

    updateHooks: { [string]: Function } = {};

    updateView(view: HTMLElement) {
        if (document.body) {
            const app = document.getElementById(this.containerID);

            if (app) {
                document.body.removeChild(app);
            }

            this.view = view;

            if (nullishCheck(document.body?.insertAdjacentElement, false)) {
                document.body.insertAdjacentElement('afterbegin', this.view);
                return;
            }

            const { firstChild } = document.body;

            document.body.insertBefore(view, firstChild);
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

    triggerLoadedEvent() {
        // console.log(document.readyState);
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            window.dispatchEvent(this.loadEvent);

            this.loadDone = true;
            return;
        }

        // console.log('not complete');

        const func = () => {
            window.dispatchEvent(this.loadEvent);
            this.loadDone = true;
        };

        document.addEventListener('DOMContentLoaded', func.bind(this));
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

    emit(name: string, data: ?Object = null) {
        if (data) {
            const ev = new CustomEvent(name, { detail: data });
            window.dispatchEvent(ev);

            return;
        }

        const ev = new Event(name);
        window.dispatchEvent(ev);
    }

    async handleHooks() {
        for (const [ev, func] of Object.entries(this.updateHooks)) {
            window.addEventListener(ev, func.bind(this));
        }
    }

    async start() {
        window.beaconingMainController = new Proxy(this, {});

        if (this.updateHooks) {
            this.handleHooks();
        }

        if (this.init) {
            await this.init();
        }

        await this.doRender();

        if (this.afterMount) {
            await this.afterMount();
        }

        this.triggerLoadedEvent();

        console.log('[Beaconing] Root Component Started!');
    }
}

class Component implements ComponentInterface {
    state: { [string]: any } = {};

    view: HTMLElement;

    props: { [string]: any } = {};

    updateHooks: { [string]: Function } = {};

    // TODO Reduce complexity
    updateView(view: HTMLElement) {
        const func = () => {
            let parent = nullishCheck(this.view?.parentElement, false);

            if (Array.isArray(this.view)) {
                parent = this.view[0].parentElement;
            }

            if (parent) {
                if (Array.isArray(this.view)) {
                    for (const el of this.view) {
                        parent.removeChild(el);
                    }
                }

                if (!Array.isArray(this.view) && Array.isArray(view)) {
                    parent.removeChild(this.view);
                }

                if (Array.isArray(view)) {
                    const firstEl = view[0];

                    if (nullishCheck(parent.insertAdjacentElement, false)) {
                        parent.insertAdjacentElement('afterbegin', firstEl);

                        for (let i = 1; i < view.length; i++) {
                            view[i - 1].insertAdjacentElement('afterend', view[i]);
                        }
                    } else {
                        const { firstChild } = parent;

                        parent.insertBefore(firstEl, firstChild);

                        for (let i = 1; i < view.length; i++) {
                            parent.insertBefore(view[i], view[i - 1]);
                        }
                    }

                    this.view = view;
                    return;
                }

                if (!Array.isArray(view) && Array.isArray(this.view)) {
                    if (nullishCheck(parent.insertAdjacentElement, false)) {
                        parent.insertAdjacentElement('afterbegin', view);
                    } else {
                        const { firstChild } = parent;

                        parent.insertBefore(view, firstChild);
                    }

                    this.view = view;
                }

                parent.replaceChild(view, this.view);
                this.view = view;
            }
        };

        if (window.beaconingMainController.loadDone) {
            func();
            if (this.afterViewUpdate) {
                this.afterViewUpdate();
            }

            return;
        }

        window.addEventListener('UILoaded', () => {
            func();
            if (this.afterViewUpdate) {
                this.afterViewUpdate();
            }
        });
    }

    appendView(view: HTMLElement) {
        let parent = this.view;

        if (Array.isArray(this.view)) {
            parent = this.view[0].parentElement;
        }

        if (Array.isArray(view)) {
            for (const v of view) {
                parent.appendChild(v);
            }

            return;
        }

        parent.appendChild(view);
    }

    removeSelf() {
        let parent = nullishCheck(this.view.parentElement, false);

        if (Array.isArray(this.view)) {
            parent = this.view[0].parentElement;

            if (parent !== null) {
                for (const view of this.view) {
                    parent.removeChild(view);
                }
            }
        }

        if (parent !== null) {
            parent.removeChild(this.view);
        }
    }

    emit(name: string, data: ?Object = null) {
        if (data) {
            const ev = new CustomEvent(name, { detail: data });
            window.dispatchEvent(ev);
            return;
        }

        const ev = new Event(name);
        window.dispatchEvent(ev);
    }

    async handleAfterLoad() {
        if (window.beaconingMainController.loadDone) {
            await this.afterLoad();
            return;
        }

        const func = () => {
            Promise.resolve(this.afterLoad());
        };

        window.addEventListener('UILoaded', func);
    }

    async attach(props: { [string]: any } = {}): Promise<HTMLElement> {
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

    async handleHooks() {
        for (const [ev, func] of Object.entries(this.updateHooks)) {
            window.addEventListener(ev, func.bind(this));
        }
    }

    // TODO: refine
    async* start(): AsyncGenerator<> {
        if (this.updateHooks) {
            this.handleHooks();
        }

        if (this.init) {
            await this.init();
        }

        if (this.render) {
            yield await this.doRender();
        }

        if (this.afterMount) {
            await this.afterMount();
        }

        if (this.afterLoad) {
            this.handleAfterLoad();
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
