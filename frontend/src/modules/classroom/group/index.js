// @flow

import Router from '../../../core/router';
import Group from './group';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Group(),
    },
]);

router.start();
