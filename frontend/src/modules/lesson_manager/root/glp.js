// @flow

import Component from '../../../core/component';

class GLP extends Component {
    async render(data: { [string]: any }): AsyncIterable<string> {
        const { name } = data;

        return this.preparePage('lesson_manager/root/templates/glp', {
            name,
        });
    }
}

export default GLP;
