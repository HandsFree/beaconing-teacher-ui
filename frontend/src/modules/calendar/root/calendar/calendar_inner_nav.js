// @flow
import { div, a, span } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarInnerNav extends Component {
    async init() {
        // hack! so that we can
        // trick the menu into using students
        // by default since we pre-load students at first.
        window.sessionStorage.setItem('calendarSelectionType', 'students');
    }

    async showStudents() {
        window.sessionStorage.setItem('calendarSelectionType', 'students');
        this.emit('RefreshPanel');
        this.updateView(await this.render());
    }

    async showGroups() {
        window.sessionStorage.setItem('calendarSelectionType', 'groups');
        this.emit('RefreshPanel');
        this.updateView(await this.render());
    }

    async render() {
        return div(
            '.nav-group',
            a(
                window.sessionStorage.getItem('calendarSelectionType') === 'students' ? '.item.active-white' : '.item',
                {
                    onclick: () => {
                        this.showStudents();
                    },
                },
                span(await window.bcnI18n.getPhrase('students')),
            ),
            a(
                window.sessionStorage.getItem('calendarSelectionType') === 'groups' ? '.item.active-white' : '.item',
                {
                    onclick: () => {
                        this.showGroups();
                    },
                },
                span(await window.bcnI18n.getPhrase('groups')),
            ),
        );
    }
}

export default CalendarInnerNav;