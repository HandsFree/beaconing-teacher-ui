// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import { Component } from '../../../../core/component';

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

class CalendarCell extends Component {
	async init() {

	}

	async render() {

	}
}

class CalendarView extends Component {
	state = {
		fromDate: new Date(),
		eventMap: new Map(),
		id: 0,
	};

    updateHooks = {
		PrevClicked: this.prevCalendarMonth,
		TodayClicked: this.currCalendarMonth,
		NextClicked: this.nextCalendarMonth,
		SetGroup: this.updateGroup,
		UpdateCalendar: this.updateCalendar,
	};
	
	async updateCalendar() {
		this.updateView(await this.genCalendar());
	}

	async updateGroup() {
		if (!this.state.groupId) {
			return;
		}

		// FIXME
		this.updateView(await this.genCalendar());
	}

	async currCalendarMonth() {
		// today!
		this.state.fromDate = new Date();
    	this.updateView(await this.genCalendar());
	}

    async prevCalendarMonth() {
    	const date = this.state.fromDate;
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    	this.state.fromDate = new Date(firstDay - 1);
    	console.log("prev ", this.state.fromDate);
    	this.updateView(await this.genCalendar());
    }

    async nextCalendarMonth() {
    	const date = this.state.fromDate;
		const lastDay = new Date(date.getFullYear(), date.getMonth(), this.daysInMonth(date)+1);
		console.log("last day ", lastDay);
    	this.state.fromDate = new Date(lastDay + 1);
    	console.log("next ", this.state.fromDate);
    	this.updateView(await this.genCalendar());
    }

	async getStudentGLPS(id) {
		const assigned = await window.beaconingAPI.getStudentAssigned(id);

        if (assigned) {
            const glps = [];

            for (const glp of assigned) {
                const glpObj = await window.beaconingAPI.getGLP(glp.gamifiedLessonPathId, true);

                glps.push({
                    glp: glpObj,
                    assignedGLPID: glp.id,
                    availableFrom: glp.availableFrom,
                });
            }

            return glps;
        }

        return [];
	}

	async writeStudentGLPS(studentId) {
		// clear out all the old events
		if (this.state.eventMap) {
			this.state.eventMap = new Map();
		}

		const glps = await this.getStudentGLPS(studentId);

        for (const glpBox of glps) {
        	const glp = glpBox.glp;

        	if (glpBox.availableFrom) {
	        	this.writeEvent(new Date(glpBox.availableFrom), {
	        		name: glp.name,
	        		desc: glp.description,
	        	});
        	}
        }
	}

	async init() {
		if (this.props.id) {
			this.state.id = this.props.id;
		}
    }

    // the event map stores key => value
    // where the key is the date the event is set
    // specifically the MM/DD/YYYY, 
    // the value is an array of events. we append to this
    // array or we insert an array when writing an event.
    // note that we strip the time from the date given
    // so that we can index the hashmap just from mm/dd/yyyy
    writeEvent(eventDate, event) {
    	// store the date in the event object
    	// WITH the time included.
    	event.date = eventDate;

    	const newDate = eventDate.withoutTime();
    	console.log("writing ", event, " time ", newDate.getTime());

    	let events = this.state.eventMap.get(newDate.getTime());
    	if (events) {
    		events.push(event);
    		// re-write into hashmap
    		this.state.eventMap.set(newDate.getTime(), events);
    	} else {
    		this.state.eventMap.set(newDate.getTime(), [event]);
    	}
    }

	// returns how many days there are in the
	// month d
	daysInMonth(d) {
		return new Date(d.getYear(), d.getMonth()+1, 0).getDate();
	}

	/*
		<table>
			<tr>
				<th></th>
			</tr>
			<tr>
				<td></td>
			</tr>
		</table>
	*/

	getDayName(date) {
		const dayNames = [
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		];
		return dayNames[date.getDay()];
	}

	getMonthName(date) {
		const monthNames = [
			"January", "February", "March", "April", "May", "June", "July", "August",
			"September", "October", "November", "December"
		];
		return monthNames[date.getMonth()];
	}

	async renderStudentList() {
		const studentLinks = [];

		const groupId = this.state.groupId;

		// this is a superflous api req. if we
		// re-architect the calendar... but it works for now
		const group = await window.beaconingAPI.getGroup(groupId);

		console.log("the group is ", group);

		// oh boy what is this.
		const students = [];
		for (const studentObj of group.students) {
			const studentId = studentObj.id;
			students.push(await window.beaconingAPI.getStudent(studentId));
		}

		// loop thru students AGAIN
		for (const student of students) {
			console.log("student is ", student);

			studentLinks.push(
				li(span(".fake-link",
					{
						onclick: () => {
							this.state.id = student.id;
							this.emit('UpdateCalendar');
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
			h2("inspect student:"),
			studentSet);
	}

	async renderGroupList() {
		const options = [];

		const groups = Object.values(await window.beaconingAPI.getGroups()) ?? [];
		for (const group of groups) {
			let isSelected = "";
			if (this.state.groupId == group.id) {
				isSelected = "selected";
			}

			options.push(
				option(isSelected, {
					value:`${group.id}`,
				}, `${group.name}`)
			);
		}

		// no group set so we wait for group selection
		// before we can render the student list.
		let studentList = [];

		// group id is set, so we render the student list
		if (this.state.groupId) {
			const groupId = this.state.currGroupId;
			studentList = await this.renderStudentList(groupId);
		}

		return div(".full-width",
			select({onchange: (event) => {
				const self = event.target;

				const selectedOption = self.options[self.selectedIndex];
				this.state.groupId = selectedOption.value;
				this.emit('SetGroup');
			}}, options),
			studentList,
		);
	}
	async genCalendarData() {		
		// write the glps for the student if
		// we have one selected.
		if (this.state.id) {
			await this.writeStudentGLPS(this.state.id);
		}
		
		let date = this.state.fromDate;
		const eventMap = this.state.eventMap;

		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		console.log("gen calendar date for ", date);
		console.log("first day is ", firstDay);

		// all the dates this month

		let rows = [];

		// add the first rows for the dates.
		const dateHeaderNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
		dateHeaderNames.forEach(function(name) {
			rows.push(div(".calendar-heading-cell", p(name)));
		});

		{
			let rowBuffer = [];

			const offset = firstDay.getDay()-1;

			// previous month
			const prevMonth = new Date(firstDay - 1);
			const prevMonthDays = this.daysInMonth(prevMonth);

			console.log("previous month is ", prevMonth, " has ", prevMonthDays, " days");

			const startDay = prevMonthDays - offset;

			for (let i = 0; i < offset; i++) {
				// TODO this should be greyed out
				// events will not be fetched for previous month days
				const dayNumber = (startDay + i)+1;
				rowBuffer.push(div(".calendar-cell .prev-month", [p(".calendar-day", dayNumber), []]));
			}

			const numDays = this.daysInMonth(date);
			console.log(`day offset is ${offset}, num days is ${numDays}`);

			for (var i = offset; i < offset + numDays; i++) {
				const dayNumber = (i - offset) + 1;

				// every 7 days. 
				// TODO also flush the buffer if we have any remaining
				// at the end of this for loop?
				// i do this manually at the bottom but it can probably
				// be handled here too?
				if ((i % 7 == 0 && i > 0)) {
					rowBuffer.forEach(function(row) {
						rows.push(row);
					});
					rowBuffer = []; // reset buffer
				}

				const cellDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), dayNumber).withoutTime();
				let eventList = div('.events');

				if (eventMap.has(cellDate.getTime())) {
					const evt = eventMap.get(cellDate.getTime());
					eventList = div('.events', 
						evt.map((evt, _) => 
							div('.event', div('.event-name', evt.name))
					));
				}

				// better way to do this?
				let classList = ".calendar-cell";
				if (new Date().withoutTime().getTime() === cellDate.getTime()) {
					classList += " .current-day";
				}	

				rowBuffer.push(div(classList, [p(".calendar-day", dayNumber), eventList]));
			}

			// flush any remaining rowbuffer bits.
			if (rowBuffer.length > 0) {
				rowBuffer.forEach(function(row) {
					rows.push(row);
				});

				// pad out the month with some more cells...
				const remain = 7 - rowBuffer.length;
				for (let i = 0; i < remain; i++) {
					rows.push(div(".calendar-cell .next-month", [p(".calendar-day", (i + 1))]));
				}

				rowBuffer = []; // reset buffer
			}

		}

		const currentDay = this.getDayName(date);
		const monthName = this.getMonthName(date);
		const year = date.getFullYear();

		const groupList = await this.renderGroupList();

		let studentGreet = "";
		if (this.state.id) {
			const student = await window.beaconingAPI.getStudent(this.state.id);
			if (student) {
				studentGreet = `${student.username}'s calendar, `;
			}
		}

		return section('.outer-col',
			section(".full-width", 
				div(".group-select", 
					groupList),
			),

			section('.calendar-col', 
				div('.calendar-control',
					h2(".calendar-date", `${studentGreet} ${monthName}, ${year}`),

					p(
						span(".fake-link", {
							onclick: () => this.emit('PrevClicked')
						}, "prev"),

						" ",

						span(".fake-link", {
							href: '',
							onclick: () => this.emit('TodayClicked')
						}, "today"),

						" ",

						span(".fake-link", {
							href: '',
							onclick: () => this.emit('NextClicked')
						}, "next")
					)
				),
				div(".calendar", rows)
			)
		);
	}

	// generates a calendar from the given
	// date specified. this calendar is a view
	// of the current month.
	async genCalendar() {
		return this.genCalendarData(this.state.fromDate);
	}

	async render() {
        return this.genCalendar();
    }
}

export default CalendarView;
