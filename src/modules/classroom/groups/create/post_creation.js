// @flow
import {
    div,
    section,
    h1,
    p,
    button,
    a,
} from '../../../../core/html';

import { Component } from '../../../../core/component';

class PostCreation extends Component {
    async render() {
        const {
            title,
            id,
        } = this.props;

        return div(
            '.flex-column.flex-align-center.margin-top-50',
            section(
                '#post-create-title',
                h1(title),
            ),
            section(
                '#post-create-steps.flex-column.no-margin',
                p(`${await window.beaconingAPI.getPhrase('pc_next')}:`),
                div(
                    '#post-create-buttons',
                    a(
                        {
                            onclick: () => {
                                this.emit('ResetForm');
                            },
                        },
                        button('.button-action', await window.beaconingAPI.getPhrase('pc_create_another')),
                    ),
                    a(
                        {
                            href: `//${window.location.host}/classroom/groups`,
                        },
                        button('.button-action', await window.beaconingAPI.getPhrase('pc_go_classroom')),
                    ),
                    a(
                        {
                            href: `//${window.location.host}/classroom/group?id=${encodeURIComponent(id)}`,
                        },
                        button('.button-action', await window.beaconingAPI.getPhrase('cr_view_group')),
                    ),
                ),
            ),
        );
    }
}

export default PostCreation;
