// @flow

import Router from '../../../core/router';
import Classes from './classes';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Classes(),
    },
]);

router.start();
