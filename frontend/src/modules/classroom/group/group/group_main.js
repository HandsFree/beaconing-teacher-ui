// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import AssignedGLPs from './assigned_glps';
import GroupEdit from './group_edit';
import GroupStudents from './group_students';

class GroupMain extends Component {
    updateHooks = {
        GroupEditClicked: this.startGroupEdit,
        EditDoneClicked: this.startGroupStudents,
        AssignedGLPsClicked: this.startAssignedGLPs,
        GroupStudentsClicked: this.startGroupStudents,
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
