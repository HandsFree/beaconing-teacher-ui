// @flow
import { p, ul, li, h2, section, div } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentInfo extends Component {
    async init() {

    }

    async render() {
        return section('.flex-container.flex-wrap.margin-20',
            div('#student-header', h2('Student Name')),

            div('#student-details',
                p(
                    ul(
                        li(p('Username')),
                        li(p('First Last')),
                        li(p('Date of Birth')),
                        li(p('Email')),
                    ),
                )
            ),
        );
    }
}

export default StudentInfo;