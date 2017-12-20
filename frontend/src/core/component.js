// @flow

/* eslint-disable class-methods-use-this, no-restricted-syntax */

class Component {
    model: { [string]: any } = {};

    async* preparePage(templatePath: string, locals: { [string]: string} = {}, furtherStates: ?Array<AsyncIterable<string>> = null): AsyncIterable<Promise<string>> {
        yield import(/* webpackMode: "eager" */ `../modules/${templatePath}.html`);

        if (furtherStates) {
            for await (const state of furtherStates) {
                yield state;
            }
        }
    }
}

export default Component;
