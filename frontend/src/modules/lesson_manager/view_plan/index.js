// @flow

import Router from '../../../core/router';
import ViewPlan from './view_plan';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new ViewPlan(),
    },
]);

router.start();
