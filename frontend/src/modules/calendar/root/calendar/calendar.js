// @flow

import { section, h1, p, div, ul, li } from '../../../../core/html';
import { Component } from '../../../../core/component';

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

class CalendarView extends Component {
	async init() {
        this.state.eventMap = new Map();

        // write some test events
        this.writeEvent(new Date('June 5, 2018 03:24:00'), {
			name: "Foo",
			desc: "Bar",	
		});

		this.writeEvent(new Date('June 12, 2018 05:32:00'), {
			name: "Foo2",
			desc: "Bar2",	
		});

		this.writeEvent(new Date('June 19, 2018 06:12:00'), {
			name: "Foo3",
			desc: "Bar3",	
		});
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

	genCalendarData(date) {
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
				rowBuffer.push(div(".calendar-cell", [p(".calendar-day", dayNumber), []]));
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
						evt.map((evt, _) => div('.event',
							// div('.event-name', p(evt.name)),
							div('.event-desc', p(evt.desc)))
					));
				} else {
					console.log(cellDate, " not in the calendar.");
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

				// add empty divs to pad out the flex bow thing
				const remain = dateHeaderNames.length - rowBuffer.length;
				for (let i = 0; i < remain; i++) {
					rows.push(div(".calendar-cell"));
				}

				rowBuffer = []; // reset buffer
			}
		}

		const currentDay = this.getDayName(date);
		const monthName = this.getMonthName(date);
		const year = date.getFullYear();

		return [
			section('.flex-column', div('#plan-header',
				h1(`${monthName}, ${year}`)
			)), 
			section('.flex-column', div(".calendar", rows))
		];
	}

	// generates a calendar from the given
	// date specified. this calendar is a view
	// of the current month.
	genCalendar(fromDate) {
		return this.genCalendarData(fromDate);
	}

	async render() {
		const currDate = new Date();
        return this.genCalendar(currDate);
    }
}

export default CalendarView;
