// @flow

import Router from '../../../core/router';
import Home from './home';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Home(),
    },
]);

router.start();
