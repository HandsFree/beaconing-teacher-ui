// @flow

import Router from '../../../core/router';
import ActivePlans from './active_plans';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new ActivePlans(),
    },
]);

router.start();
