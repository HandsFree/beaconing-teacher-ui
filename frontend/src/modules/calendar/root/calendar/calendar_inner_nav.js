// @flow
import { div, a, span } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarInnerNav extends Component {
    state = {
        path: window.location.pathname.slice(1),
    };

    async render() {
        const { path } = this.state;

        return div(
            '.nav-group',
            a(
                window.sessionStorage.getItem('calendarSelectionType') === 'students' ? '.item.active-white' : '.item',
                {
                    href: '#',
                    onclick: (event) => {
                        this.emit('CalendarSelectorShowStudents');
                    },
                },
                span(await window.bcnI18n.getPhrase('students')),
            ),
            a(
                window.sessionStorage.getItem('calendarSelectionType') === 'groups' ? '.item.active-white' : '.item',
                {
                    href: '#',
                    onclick: (event) => {
                        this.emit('CalendarSelectorShowGroups');
                    },
                },
                span(await window.bcnI18n.getPhrase('groups')),
            )
        );
    }
}

export default CalendarInnerNav;
