// @flow

import Router from '../../../core/router';
import Group from './group';
import AnalyticsOverview from './analytics';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Group(),
    },
    {
        path: 'analytics',
        controller: new AnalyticsOverview(),
    },
]);

router.start();
