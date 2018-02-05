// @flow

import Router from '../../../core/router';
import Courses from './courses';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Courses(),
    },
]);

router.start();
