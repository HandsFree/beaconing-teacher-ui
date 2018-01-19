// @flow

export interface Component {
    render(): HTMLElement;
    startLifecycle(): void;
    start(): void;
    updateView(view: HTMLElement): void;
}

export type Route = {
    path: string,
    controller: Component,
};
