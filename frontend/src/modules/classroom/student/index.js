// @flow

import Router from '../../../core/router';
import Student from './student';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Student(),
    },
]);

router.start();
