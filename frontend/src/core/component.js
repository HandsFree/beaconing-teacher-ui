// @flow

/* eslint-disable class-methods-use-this, no-restricted-syntax */

class Component {
    model: { [string]: any } = {};
    pendingRenders: Array<Promise<string>> = [];
    bindTo: string = 'app';
    renderBind: HTMLElement;
    view: string = '';

    preparePage({ path, locals = {} }: { path: string, locals: ?any }) {
        const render: Promise<string> = new Promise((resolve) => {
            import(/* webpackMode: "eager" */ `../modules/${path}.html`).then((template) => {
                resolve(template(locals));
            });
        });

        return render;
    }

    prepareRenderState(render: Promise<string>) {
        this.pendingRenders.push(render);
    }

    updateView(view: string) {
        this.view = view;
        this.renderBind.innerHTML = view;
    }

    checkBind() {
        const element = document.getElementById(this.bindTo);

        if (!element) {
            throw new Error('[Beaconing] Element to bind not found');
        }

        this.renderBind = element;
    }

    async generateView() {
        for await (const state of this.pendingRenders) {
            this.updateView(state);
        }

        this.pendingRenders = [];
    }

    async start() {
        this.checkBind();
        this.generateView();
    }
}

export default Component;
