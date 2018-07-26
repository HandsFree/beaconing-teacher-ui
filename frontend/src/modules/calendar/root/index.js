// @flow

import Router from '../../../core/router';
import Calendar from './calendar';
import CalendarDay from './day';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Calendar(),
    },
    {
        path: 'day',
        controller: new CalendarDay(),
    },
]);

router.start();
