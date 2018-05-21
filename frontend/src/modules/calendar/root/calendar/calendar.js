// @flow

import { section, h1, p, div, table, tr, th, td, ul, li } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarView extends Component {

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
		// TODO load all of the event thingies
		// key (date) => event list?
		let eventMap = new Map();

		// all the dates this month
		const cells = [];
		for (var i = 0; i < this.daysInMonth(date); i++) {
			const cellDate = new Date(date.getFullYear(), date.getMonth(), i);

			if (i == 3) {
				// testing!
				eventMap.set(cellDate, [
					{
						name: "clean toilets",
						desc: "clean the toilets you dumb dumb",
					},
					{
						name: "unclean toilets",
						desc: "clean the toilets you dumb dumb",
					}
				]);
			}

			cells[i] = cellDate;
		}

		let rows = [];

		{
			let rowBuffer = [];
			for (var i = 0; i < cells.length; i++) {

				// every 7 days.
				if (i % 7 == 0 && i > 0) {
					rows.push(tr(rowBuffer.map((row, _) => td(row))));
					rowBuffer = []; // reset
				}

				const cellDate = cells[i];
				let eventList = div('.events');

				if (eventMap.has(cellDate)) {
					const evt = eventMap.get(cellDate);
					eventList = div('.events', 
						evt.map((evt, _) => div('.event',
							// div('.event-name', p(evt.name)),
							div('.event-desc', p(evt.desc)))
					));
				}

				rowBuffer.push([p(cellDate.getDay()), eventList]);
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
