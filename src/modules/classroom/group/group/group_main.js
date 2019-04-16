// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import AssignedGLPs from './assigned_glps';
import GroupEdit from './group_edit';
import GroupStudents from './group_students';
import StudentOverview from './student_overview';

class GroupMain extends Component {
    updateHooks = {
        GroupEditClicked: this.startGroupEdit,
        EditDoneClicked: this.startGroupStudents,
        AssignedGLPsClicked: this.startAssignedGLPs,
        GroupStudentsClicked: this.startGroupStudents,
        OverviewClicked: this.startOverview,
    };

    state = {
        id: 0,
    };

    async init() {
        if (this.props.id) {
            this.state.id = this.props.id;
        }
    }

    async startGroupEdit() {
        const groupEdit = new GroupEdit();

        const groupEditEl = await groupEdit.attach(this.state);

        const el = div(
            '#pane-container.flex-column.flex-grow',
            groupEditEl,
        );

        this.updateView(el);
    }

    async startOverview(evt: any) {
        const { detail } = evt;

        const overview = new StudentOverview();
        const overviewEl = await overview.attach({
            classID: detail.id,
        });

        const el = div(
            '#pane-container.flex-column.flex-grow',
            overviewEl,
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

    async startGroupStudents() {
        const groupStudents = new GroupStudents();

        const groupStudentsEl = await groupStudents.attach(this.state);

        const el = div(
            '#pane-container.flex-column.flex-grow',
            groupStudentsEl,
        );

        this.updateView(el);
    }

    async render() {
        const groupStudents = new GroupStudents();

        const groupStudentsEl = await groupStudents.attach(this.state);

        return div(
            '#pane-container.flex-column.flex-grow',
            groupStudentsEl,
        );
    }
}

export default GroupMain;
