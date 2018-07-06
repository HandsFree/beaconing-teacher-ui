// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import AssignedGLPs from './assigned_glps';
import StudentEdit from './student_edit';
import Analytics from './analytics';

class StudentMain extends Component {
    updateHooks = {
        StudentEditClicked: this.startStudentEdit,
        EditDoneClicked: this.startAssignedGLPs,
        AssignedGLPsClicked: this.startAssignedGLPs,
        AnalyticsClicked: this.startAnalytics,
    };

    state = {
        id: 0,
    };

    async init() {
        if (this.props.id) {
            this.state.id = this.props.id;
        }
    }

    async startStudentEdit() {
        const studentEdit = new StudentEdit();

        const studentEditEl = await studentEdit.attach(this.state);

        const el = div(
            '#pane-container.flex-column.flex-grow',
            studentEditEl,
        );

        this.updateView(el);
    }

    async startAssignedGLPs() {
        const assignedGLPs = new AssignedGLPs();

        const assignedGLPsEl = await assignedGLPs.attach(this.state);

        const el = div(
            '#pane-container.flex-column.flex-grow',
            assignedGLPsEl,
        );

        this.updateView(el);
    }

    async startAnalytics() {
        const analytics = new Analytics();

        const analyticsEl = await analytics.attach(this.state);

        const el = div(
            '#pane-container.flex-column.flex-grow',
            analyticsEl,
        );

        this.updateView(el);
    }

    async render() {
        const assignedGLPs = new AssignedGLPs();
        const assignedGLPsEl = await assignedGLPs.attach(this.state);

        return div(
            '#pane-container.flex-column.flex-grow',
            assignedGLPsEl,
        );
    }
}

export default StudentMain;
