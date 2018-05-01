// @flow

// sorry!
import $ from 'jquery';
import 'fullcalendar';

import { h1, p, div } from '../../../../core/html';
import { Component } from '../../../../core/component';

class CalendarView extends Component {
	async afterMount() {
		const ele = div('#calendar-view');
		this.updateView(ele);
	}

	async render() {
        return div('#calendar-view');
    }
}

export default CalendarView;
