import { section, div, p, h3, a } from '../../../core/html';
import { Component } from "../../../core/component";

class AssignedStudentBox extends Component {
    constructor() {
        super();
        this.unassign = this.unassign.bind(this);
    }

    async unassign(studentId, glpId) {
        if (confirm('### Are you sure you wish to unassign this student?')) {
            const resp = await window.beaconingAPI.unassignStudent(studentId, glpId);
            console.log(resp);
        }
    }

    async render() {
        const { assigned, glpId } = this.props;
        const { studentId, name } = assigned;
        const card = div(
            '.small-box',
            div(
                '.title flex-column',
                h3('.name', name),
            )
        );
        return a(
            '.fake-link',
            {
                onclick: () => { this.unassign(studentId, glpId); },
            },
            card,
        );
    }
}

class AssignedGroupBox extends Component {
    constructor() {
        super();
        this.unassign = this.unassign.bind(this);
    }

    async unassign(groupId, glpId) {
        if (confirm('### Are you sure you wish to unassign this group?')) {
            const resp = await window.beaconingAPI.unassignGroup(groupId, glpId);
            console.log(resp);
        }
    }

    async render() {
        const { assigned, glpId } = this.props;
        const { studentGroupId, name } = assigned;
        const card = div(
            '.small-box',
            div(
                '.title flex-column',
                h3('.name', name),
            )
        );
        return a(
            '.fake-link',
            {
                onclick: () => { this.unassign(studentGroupId, glpId); },
            },
            card,
        );
    }
}

class EditGLPAssignees extends Component {
    state = {};

    async render() {
        const { id } = this.props;

        const assignedSet = await window.beaconingAPI.getAssignedStudentsOf(id);
        console.log('assigned students are', assignedSet);

        let assignedProm = [];
        for (const assigned of assignedSet) {
            // if this is set, then the object is a group
            if (assigned.studentGroupId) {
                assignedProm.push(new AssignedGroupBox().attach({
                    glpId: id,
                    assigned,
                }));
            } 
            // otherwise, it's not set and out
            // studentId is set, then it's likely a student
            else if (assigned.studentId) {
                assignedProm.push(new AssignedStudentBox().attach({
                    glpId: id,
                    assigned
                }));
            }
        }

        console.log('prom', assignedProm);
        const assignedListEl = await Promise.all(assignedProm).then((el) => el);
        console.log('promised', assignedListEl);
        
        return div(
            '.flex-column',
            div(
                '.flex-column',
                section(
                    '#glp-assignees-container',
                    assignedListEl,
                )
            )
        );
    }
}

export default EditGLPAssignees;