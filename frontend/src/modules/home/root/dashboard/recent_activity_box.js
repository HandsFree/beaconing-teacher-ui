// @flow
import { div, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class RecentActivityBox extends Component {
    async render() {
        const {
            Message,
            ExecutionTime,
            GroupName,
        } = this.props;

        const text = GroupName ? `${Message}: ${GroupName}` : Message;

        const time = new Date(ExecutionTime);

        return div(
            '.activity',
            div(
                '.time',
                p(
                    {
                        title: time.toTimeString(),
                    },
                    time.toDateString(),
                ),
            ),
            div(
                '.info',
                p(text),
            ),
        );
    }
}

export default RecentActivityBox;
