// @flow

export interface Component {
    render(): HTMLElement;
    startLifecycle(): void;
    start(): void;
    updateView(view: HTMLElement): void;
    params: { [string]: string };
}

export type Route = {
    path: string,
    controller: Component,
};
