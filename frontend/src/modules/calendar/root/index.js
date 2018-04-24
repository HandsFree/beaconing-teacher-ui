// @flow

import Router from '../../../core/router';
import Calendar from './calendar';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Calendar(),
    },
]);

router.start();
