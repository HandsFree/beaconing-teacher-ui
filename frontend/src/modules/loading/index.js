// @flow
import Component from '../../core/component';

class Loading extends Component {
    async render(): Promise<string> {
        const renderData = {
            path: 'loading/templates/loading',
        };
        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default Loading;
