// @flow

import { section, h1, p, div, table, tr, th, td, ul, li } from '../../../../core/html';
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
        this.writeEvent(new Date('June 5, 2018 03:24:00'),
			{
				name: "Foo",
				desc: "Bar",	
			});

		this.writeEvent(new Date('June 12, 2018 05:32:00'),
			{
				name: "Foo2",
				desc: "Bar2",	
			});

		this.writeEvent(new Date('June 19, 2018 06:12:00'),
			{
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

    	const newDate = eventDate.withoutTime().getTime();
    	console.log("writing ", event, " as date ", eventDate, " is ", newDate);

    	let events = this.state.eventMap.get(newDate);
    	if (events) {
    		events.push(event);
    		// re-write into hashmap
    		this.state.eventMap.set(newDate, events);
    	} else {
    		this.state.eventMap.set(newDate, [event]);
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

		const firstDay = new Date(date.getFullYear(), date.getMonth(), 0);

		// all the dates this month

		let rows = [];

		{
			let rowBuffer = [];

			const offset = firstDay.getDay();

			// previous month
			const prevMonth = new Date(firstDay - 1);
			const prevMonthDays = this.daysInMonth(prevMonth);
			const startDay = prevMonthDays - offset;

			for (let i = 0; i < offset; i++) {
				// TODO this should be greyed out
				// events will not be fetched for previous month days
				const dayNumber = (startDay + i)+1;
				rowBuffer.push([p(dayNumber), []]);
			}

			for (var i = offset; i < offset + this.daysInMonth(date); i++) {

				// every 7 days.
				if (i % 7 == 0 && i > 0) {
					rows.push(tr(rowBuffer.map((row, _) => td(row))));
					rowBuffer = []; // reset
				}

				const cellDate = new Date(firstDay.getYear(), firstDay.getMonth()+1, i);
				let eventList = div('.events');

				if (eventMap.has(cellDate.getTime())) {
					const evt = eventMap.get(cellDate.getTime());
					eventList = div('.events', 
						evt.map((evt, _) => div('.event',
							// div('.event-name', p(evt.name)),
							div('.event-desc', p(evt.desc)))
					));
				} else {
					console.log(cellDate, " is not in evetn map");
				}

				const dayNumber = (i - offset)+1;
				rowBuffer.push([p(dayNumber), eventList]);
			}
		}

		const currentDay = this.getDayName(date);
		const monthName = this.getMonthName(date);
		const year = date.getFullYear();

		const dateHeaderNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
		const header = tr(dateHeaderNames.map((name, _) => th(name)));

		return [
			section('.flex-column', div('#plan-header',
				h1(`${monthName}, ${year}`)
			)), 
			section('.flex-column', table(header, rows))
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
