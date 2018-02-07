// @flow

import Router from '../../../core/router';
import Groups from './groups';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Groups(),
    },
]);

router.start();
