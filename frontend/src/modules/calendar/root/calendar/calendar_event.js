// @flow

import { span, i, p, div, a, button } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';
import moment from 'moment';

class CalendarDueEvent extends Component {
    async render() {
        const { name, id, due } = this.props;

        return div('.event.due-event',
            p('.event-name', {
                onclick: () => {
                    this.emit('ClearDueEvent');
                }
            }, name),
        );
    }
}

class CalendarEvent extends Component {
    async render() {
        const { name, id, due } = this.props;

        return div('.event',
            p('.event-name', name),
            div(
                a({
                    href: `//${window.location.host}/lesson_manager/#view?id=${id}`,
                    target: '_blank',
                }, 
                span({
                    'title': 'Inspect GLP',
                }, i('.icon-search'))),
                
                // don't show this option if we have no due date
                // available for the GLP.
                nullishCheck(due, false) ? 
                a('.fake-link', {
                    target: '_blank',
                    onclick: () => {
                        this.emit('WriteDueEvent', {
                            id: id,
                            name: name,

                            // for now we render the due date as today
                            due: due,
                        });
                    },
                }, span({
                    'title': 'Go to due date',
                }, i('.icon-clock')))
                : [],

            )
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
    CalendarDueEvent,
    CalendarEventList,
};
