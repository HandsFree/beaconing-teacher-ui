import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

// the left pane which has the controls for the calendar
// regarding students/groups
class CalendarStudentSelector extends Component {

}

// the top menu options above the calendar
class CalendarController extends Component {    
    constructor(studentId) {
        super();
        
        this.state = {
            studentId: studentId,
        }
    }

    async render() {
        // FIXME
        const studentGreet = "hello felix";
        const monthName = "June";
        const year = "2018";

        return div('.calendar-control',
            // TODO move this somewhere else.
            h2(".calendar-date", `${studentGreet} ${monthName}, ${year}`),

            p(
                span(".fake-link", {
                    onclick: () => this.emit('PrevMonth')
                }, "prev"),

                " ",

                span(".fake-link", {
                    href: '',
                    onclick: () => this.emit('CurrMonth')
                }, "today"),

                " ",

                span(".fake-link", {
                    href: '',
                    onclick: () => this.emit('NextMonth')
                }, "next")
            )
        );
    }
}

export default CalendarController;
