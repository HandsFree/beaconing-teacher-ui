// @flow

import Router from '../../../core/router';
import NewPlans from './plans';
import ViewPlans from '../view_plan';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new NewPlans(),
    },
    {
        path: 'view',
        controller: new ViewPlans(),
    },
]);

router.start();
