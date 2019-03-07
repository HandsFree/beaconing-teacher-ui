// @flow
import { div, h3, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class GroupBox extends Component {
    async render() {
        const {
            id,
            name,
        } = this.props;

        return div(
            '.small-box',
            div(
                '.title',
                h3('.name', name),
            ),
            div(
                '.box-buttons',
                a(
                    {
                        href: `//${window.location.host}/classroom/group?id=${id}`,
                    },
                    await window.bcnI18n.getPhrase('view'),
                ),
            ),
        );
    }
}

export default GroupBox;
