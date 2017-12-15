// @flow

/* eslint-disable class-methods-use-this */

class Component {
    model: { [string]: any } = {};

    async preparePage(templatePath: string, locals: { [string]: string}): Promise<string> {
        const template: ({ [string]: string }) => string = await import(/* webpackMode: "eager" */ `../modules/${templatePath}.html`);

        return template(locals);
    }
}

export default Component;
