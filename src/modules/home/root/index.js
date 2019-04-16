// @flow

import Router from '../../../core/router';
import Dashboard from './dashboard';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Dashboard(),
    },
]);

router.start();
