// @flow
import { div, strong, a, p } from '../../../core/html';

import { Component } from '../../../core/component';

class MissionDetail extends Component {
    async init() {
        if (!this.props.mission) {
            // console.log(this.props);
            throw new Error('[Mission Detail] Mission not provided');
        }
    }

    async render() {
        let desc = this.props.mission.description.trim();

        if (desc.length > 100) {
            desc = `${desc.substr(0, 100)}...`;
        }

        return div(
            '.detail',
            div(
                '.title',
                strong(this.props.mission.name),
                a(
                    {
                        href: `#mission?id=${this.props.id}&index=${this.props.index}&prev=${this.props.prev}`,
                    },
                    'View',
                ),
            ),
            div(
                '.description',
                p(desc),
            ),
        );
    }
}

export default MissionDetail;
