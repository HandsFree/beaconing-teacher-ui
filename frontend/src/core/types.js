// @flow

export interface Controller {
    render(): Promise<string>;
    preparePage({ path: string, locals: any }): Promise<string>;
    prepareRenderState(render: Promise<string>): void;
    generateView(): void;
    start(): void;
    updateView(view: string): void;
}

export type Route = {
    path: string,
    controller: Controller,
};
