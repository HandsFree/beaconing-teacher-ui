// @flow

import Router from '../../../core/router';
import ActivePlans from './active_plans';
import ViewPlan from '../view_plan';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new ActivePlans(),
    },
    {
        path: 'view',
        controller: new ViewPlan(),
    },
]);

router.start();
