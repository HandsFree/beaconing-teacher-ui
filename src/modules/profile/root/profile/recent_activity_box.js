// @flow
import { div, h3, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

function getTransForActivityType(type: string) {
    // TRANSLATION swap these for translation keys.
    switch (type) {
    case 'student_created':
        return 'Student Created';
    case 'student_deleted':
        return 'Student Deleted';
    case 'student_updated':
        return 'Student Updated';

    case 'assignedglp_created':
        return 'Assigned GLP';
    case 'assignedglp_deleted':
        return 'Un-assigned GLP';
    case 'assignedglp_updated':
        return 'Assigned GLP Updated';

    case 'glp_created':
        return 'GLP Created';
    case 'glp_deleted':
        return 'GLP Deleted';
    case 'glp_updated':
        return 'GLP Updated';

    case 'group_created':
        return 'Student Group Created';
    case 'group_deleted':
        return 'Student Group Deleted';
    case 'group_updated':
        return 'Student Group Updated';

    default:
        return type;
    }
}

// maps the action to the given css class for styling.
function getActionClass(type) {
    const parts = type.split("_");
    const action = parts[1];
    switch (action) {
    case 'deleted':
        return '.delete';
    case 'updated':
        return '.update';
    case 'created':
        return '.create';
    default:
        return type;
    }
}

class StudentActivityBox extends Component {
    async render() {
        const {
            type,
            createdAt,
            context,
        } = this.props;

        const time = new Date(createdAt);

        const { id, name } = context;

        const trans = getTransForActivityType(type);

        return div(
            `.activity.flex-column${getActionClass(type)}`,
            div(
                '.info',
                div(`.action`, 
                    h3('.action-name', trans),
                    h3(' — '),
                    h3(a(
                        {
                            href: `//${window.location.host}/classroom/student?id=${id}`,
                            title: 'Go to student',
                        },
                        name,
                    )),
                ),
                div(
                    '.time',
                    p(
                        {
                            title: time.toTimeString(),
                        },
                        time.toDateString(),
                    ),
                ),
            ),
        );
    }
}

class GLPActivityBox extends Component {
    async render() {
        const {
            type,
            createdAt,
            context,
        } = this.props;

        const time = new Date(createdAt);

        const { id, name } = context;

        const trans = getTransForActivityType(type);

        return div(
            `.activity.flex-column${getActionClass(type)}`,
            div(
                '.info',
                div('.action', 
                    h3('.action-name', trans),
                    h3(' — '),
                    h3(a(
                        {
                            href: `//${window.location.host}/lesson_manager/#view?id=${id}`,
                            title: 'Go to GLP',
                        },
                        name,
                    )),
                ),
                div(
                    '.time',
                    p(
                        {
                            title: time.toTimeString(),
                        },
                        time.toDateString(),
                    ),
                ),
            ),
        );
    } 
}

class AssignedGLPActivityBox extends Component {
    async render() {
        const {
            type,
            createdAt,
            context,
        } = this.props;

        const time = new Date(createdAt);

        const { id, name } = context;

        const trans = getTransForActivityType(type);

        return div(
            `.activity.flex-column${getActionClass(type)}`,
            div(
                '.info',
                div('.action.flex-row', 
                    h3('.action-name', trans),
                    h3(' — '),
                    h3(a(
                        {
                            href: `//${window.location.host}/#`,
                            title: 'TODO',
                        },
                        `'${name}'`,
                    )),
                ),
                div(
                    '.time',
                    p(
                        {
                            title: time.toTimeString(),
                        },
                        time.toDateString(),
                    ),
                ),
            ),
        );
    }
}

export {
    StudentActivityBox,
    GLPActivityBox,
    AssignedGLPActivityBox,
};
