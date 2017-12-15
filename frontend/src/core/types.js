// @flow

export interface Controller {
    render(): Promise<string>;
}

export type Route = {
    path: string,
    controller: Controller,
};
