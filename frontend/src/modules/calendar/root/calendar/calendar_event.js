// @flow

import { p, div, a } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarEvent extends Component {
    async render() {
        const { name, id } = this.props;

        return div('.event',
            p('.event-name',
                a({
                    href: `//${window.location.host}/lesson_manager/#view?id=${id}`,
                    target: '_blank',
                }, name),
            ),
        );
    }
}

class CalendarEventList extends Component {
    async render() {
        const { events } = this.props;
        const el = await Promise.all(events).then(evts => evts);
        return div('.events', el);
    }
}

export {
    CalendarEvent,
    CalendarEventList,
};
