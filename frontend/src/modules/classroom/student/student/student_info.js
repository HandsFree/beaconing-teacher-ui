// @flow
import { p, ul, li, h2, section, div } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentInfo extends Component {
    async render() {
        return section('.flex-container.flex-wrap',
            div('#student-header', h2(await window.bcnI18n.getPhrase('student_name'))),

            div('#student-details',
                p(
                    ul(
                        li(p(await window.bcnI18n.getPhrase('username'))),
                        li(p(await window.bcnI18n.getPhrase('name'))),
                        li(p(await window.bcnI18n.getPhrase('dob'))),
                        li(p(await window.bcnI18n.getPhrase('pf_teacher_email'))),
                    ),
                )
            ),
        );
    }
}

export default StudentInfo;