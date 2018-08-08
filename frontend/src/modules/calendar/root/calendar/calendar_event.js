// @flow

import { span, i, p, div, a } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';
import moment from 'moment';

class CalendarDueEvent extends Component {
    async render() {
        const { name } = this.props;

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
        const { 
            name, 
            id, 
            due, 
            avail 
        } = this.props;

        const inspectGLPTransl = await window.bcnI18n.getPhrase('cal_inspect_glp');
        const goToDueDateTransl = await window.bcnI18n.getPhrase('cal_go_to_due_date');

        const inspectGLPButtonEl = a(
            {
                href: `//${window.location.host}/lesson_manager/#view?id=${id}`,
            }, 
            span(
                {
                    'title': inspectGLPTransl,
                }, 
                i('.icon-search')
            )
        );

        const showDueDateButtonEl = do {
            // don't show this option if we have no due date
            // available for the GLP. OR if the due date
            // is the same date as the assignment.
            if (nullishCheck(due, false) && !due.isSame(avail, 'D')) {
                a(
                    '.fake-link', 
                    {
                        target: '_blank',
                        onclick: () => {
                            this.emit('WriteDueEvent', {
                                id: id,
                                name: name,
    
                                // for now we render the due date as today
                                due: due,
                            });
                        },
                    }, 
                    
                    span({
                        'title': goToDueDateTransl,
                    }, i('.icon-clock'))
                )
            } else {
                [];
            }
        };

        return div('.event',
            p('.event-name', name),
            div(
                inspectGLPButtonEl,
                showDueDateButtonEl,
            )
        );
    }
}

class CalendarEventList extends Component {
    async render() {
        const { events } = this.props;

        // we only show one event for now

        const renderList = [];
        renderList.push(await Promise.resolve(events[0]).then(el => el));
        return div('.events', renderList);
    }
}

export {
    CalendarEvent,
    CalendarDueEvent,
    CalendarEventList,
};
