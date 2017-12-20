// @flow
import Component from '../../core/component';

class Loading extends Component {
    async render(): Promise<string> {
        return this.preparePage('loading/templates/loading', {});
    }
}

export default Loading;
