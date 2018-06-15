// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

class StudentSelector extends Component {
    constructor(calendarView) {
        super();
        this.state = {
            calendarView: calendarView,
        };
    }

    async refresh(groupId, studentsList) {
        const oldCalendarView = this.state.calendarView;
        this.state = {
            groupId: groupId,
            studentsList: studentsList ?? [],
            calendarView: oldCalendarView, // set this again.
        };
        this.updateView(await this.render());
    }

    async setStudent(id) {
        console.log("setting student to", id);
        const calendarView = this.state.calendarView;
        calendarView.state.studentId = id;

        // refresh glps in teh calendar view
        calendarView.refreshGLPS();

        // set the current month on the calendar
        // comtroller, this updates the student greeting too
        // the fact that we have to do this feels kind of messy
        // like there is a flaw in how i implement the architecture
        // for the calendar.. but hey ho. this will update
        // the calendar controller view.
        this.emit('RefreshCalendarController');

        // refresh the calendar view with the updated
        // student id set.
        calendarView.updateView(await calendarView.render());
    }

    async render() {
        const { groupId } = this.state;
        if (!groupId) {
            return p("no group selected");
        }

        const studentsList = this.state.studentsList;

        const students = [];
        for (const student of studentsList) {
            const studentId = student.id;

            // cache this in local storage or something?
            students.push(await window.beaconingAPI.getStudent(studentId));
        }

        const studentLinks = [];
        for (const student of students) {
            studentLinks.push(
                li(span(".fake-link",
                    {
                        onclick: () => {
                            this.setStudent(student.id);
                        },
                    },
                    student.username
                )),
            );
        }

        let studentSet = p("no students for this group.");
        if (studentLinks.length > 0) {
            studentSet = ul(studentLinks);
        }

        return div(".full-width",
            h2("Inspect student:"),
            studentSet);
    }
}

class StudentGroupSelector extends Component {
    constructor(calendarView) {
        super();
        this.state = {
            groupId: 0,
            calendarView: calendarView,
        };
    }
    
    async render() {
        let options = [];
        
        const groups = Object.values(await window.beaconingAPI.getGroups()) ?? [];
        console.log("hi we're just debugging ", groups);

        for (const group of groups) {
            let isSelected = "";
            if (this.state.groupId == group.id) {
                isSelected = "selected";
            }
            
            options.push(
                option(isSelected, {
                    value: `${group.id}`,
                    students: group.students,
                }, `${group.name}`)
            );
        }

        const studentSel = new StudentSelector(this.state.calendarView);

        return Promise.all([
            studentSel.attach(this.state),
        ]).then((values) => {
            const [
                studentSelEl
            ] = values;

            return div(".group-select", 
                h2("Select group:"),
                select({
                    onchange: (event) => {
                        const self = event.target;
                        const selectedOption = self.options[self.selectedIndex];
                        const groupId = selectedOption.value;
                        studentSel.refresh(groupId, selectedOption.students);
                    },
                }, options), 
                studentSelEl);
        });
    }
}

export class SelectorPanel extends Component {
    constructor(view) {
        super();
        this.state = {
            view: view,
        }
    }

    async render() {
        const studentGroupSelector = new StudentGroupSelector(this.state.view);

        return Promise.all([
            studentGroupSelector.attach(),
        ]).then(((values) => {
            const [
                studentGroupSelEl
            ] = values;
            return section(".full-width", studentGroupSelEl);
        }));
    }
}