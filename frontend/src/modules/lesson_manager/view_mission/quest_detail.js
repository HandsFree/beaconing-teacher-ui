// @flow
import { div, strong, a } from '../../../core/html';

import { Component } from '../../../core/component';

class QuestDetail extends Component {
    async init() {
        if (!this.props.quest) {
            // console.log(this.props);
            throw new Error('[Quest Detail] Quest not provided');
        }

        // console.log(this.props.quest);
    }

    async render() {
        return div(
            '.detail',
            div(
                '.title',
                strong(this.props.quest.name),
                a('View'),
            ),
        );
    }
}

export default QuestDetail;
