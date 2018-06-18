// @flow

import { div, a } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

class CalendarEvent extends Component {
    async render() {
        const { name, desc, id } = this.props;

        return div('.event',
            a({
                href: `//${window.location.host}/lesson_manager/#view?id=${id}&prev=calendar`
            },
                div('.event-name', name)));
    }
}

class CalendarEventList extends Component {
    async render() {
        const { events } = this.props;
        return Promise.all(events).then((el) => {
            return div('.events', el);
        });
    }
}

export {
    CalendarEvent, 
    CalendarEventList,
};