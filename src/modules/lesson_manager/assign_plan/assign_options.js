// @flow
import { div, nav, h4, a } from '../../../core/html';

import { Component } from '../../../core/component';
import StudentBox from './student_box';
import GroupBox from './group_box';

class TabControlPane extends Component {
    updateHooks = {
        RefreshGroups: this.refreshGroups,
        RefreshStudents: this.refreshStudents,
    };

    async init() {
        this.selectionType = 'students';
    }

    async refreshGroups() {
        this.selectionType = 'groups';
        this.updateView(await this.render());
    }

    async refreshStudents() {
        this.selectionType = 'students';
        this.updateView(await this.render());
    }
    
    async render() {
        return nav('#assign-tabs',
            div(
                '.tab-container',
                a(
                    `.tab ${this.selectionType == 'students' ? '.active' : ''}`, 
                    {
                        onclick: (evt) => {
                            this.emit('RefreshStudents');
                        },
                    },
                    `${await window.beaconingAPI.getPhrase('cr_students')}`
                ),
                a(
                    `.tab ${this.selectionType == 'groups' ? '.active' : ''}`, 
                    {
                        onclick: () => {
                            this.emit('RefreshGroups');
                        },
                    },
                    `${await window.beaconingAPI.getPhrase('cr_groups')}`
                ),
            ),
        );
    }
}

class TabView extends Component {
    state = {};
    updateHooks = {
        RefreshGroups: this.refreshGroups,
        RefreshStudents: this.refreshStudents,
    };

    async init() {
        const students = await window.beaconingAPI.getStudents();
        const groups = await window.beaconingAPI.getGroups();

        this.state = {
            students: students,
            groups: groups,
        };
    }

    async refreshGroups() {
        this.updateView(await this.renderGroups());
    }

    async refreshStudents() {
        this.updateView(await this.renderStudents());
    }
    
    async afterMount() {
        this.updateView(await this.renderStudents());
    }

    async renderGroups() {
        const { groups } = this.state;
        if (!groups) {
            return h4('failed');
        }

        const groupsProm = [];
        for (const group of this.state.groups) {
            const groupBox = new GroupBox();
            const groupBoxEl = groupBox.attach({
                group,
                glpID: this.props.id,
            });

            groupsProm.push(groupBoxEl);
        }

        const groupsEl = await Promise.all(groupsProm).then(elements => elements);

        return div(
            '.groups-container',
            groupsEl,
        );
    }

    async renderStudents() {
        const { students } = this.state;
        if (!students) {
            return h4('failed');
        }

        const studentsProm = [];

        const usernameTrans = await window.beaconingAPI.getPhrase('username');
        for (const student of students) {
            const studentBox = new StudentBox();
            const studentBoxEl = studentBox.attach({
                student,
                glpID: this.props.id,
                usernameTrans,
            });

            studentsProm.push(studentBoxEl);
        }
        const studentsEl = await Promise.all(studentsProm).then(elements => elements);

        return div(
            '.students-container',
            studentsEl,
        );
    }

    async render() {
        return div(
            '.groups-container',
        );
    }
}

class AssignOptions extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Assign Options] GLP ID not provided');
        }
    }

    async render() {
        const { id } = this.props.id;

        const tabControl = new TabControlPane();
        const tabView = new TabView();

        return Promise.all([
            tabControl.attach(),
            tabView.attach(),
        ]).then((values) => {
            const [
                tabControlEl,
                tabViewEl,
            ] = values;

            return div(
                '#assign-options',
                tabControlEl,
                div('.margin-top-20',
                    tabViewEl,
                ),
            );
        });
    }
}

export default AssignOptions;
