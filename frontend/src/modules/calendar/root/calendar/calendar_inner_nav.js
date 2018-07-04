// @flow
import { div, a, span } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarInnerNav extends Component {
    state = {
        path: window.location.pathname.slice(1),
    };

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
        const { path } = this.state;

        // FIXME nullish check for active items?
        return div(
            '.nav-group',
            a(
                window.sessionStorage.getItem('calendarSelectionType') === 'students' ? '.item.active-white' : '.item',
                {
                    href: '#',
                    onclick: (event) => {
                        this.showStudents();
                    },
                },
                span(await window.bcnI18n.getPhrase('students')),
            ),
            a(
                window.sessionStorage.getItem('calendarSelectionType') === 'groups' ? '.item.active-white' : '.item',
                {
                    href: '#',
                    onclick: (event) => {
                        this.showGroups();
                    },
                },
                span(await window.bcnI18n.getPhrase('groups')),
            )
        );
    }
}

export default CalendarInnerNav;
