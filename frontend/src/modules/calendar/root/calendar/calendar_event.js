// @flow

import { div, a } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarEvent extends Component {
    async render() {
        const { name, id } = this.props;

        return div(
            '.event',
            a(
                {
                    href: `//${window.location.host}/lesson_manager/#view?id=${id}`,
                },
                div('.event-name', name),
            ),
        );
    }
}

class CalendarEventList extends Component {
    async render() {
        const { events } = this.props;
        const el = await Promise.all(events);
        return div('.events', el);
    }
}

export {
    CalendarEvent,
    CalendarEventList,
};
