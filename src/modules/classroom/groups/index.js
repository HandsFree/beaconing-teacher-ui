// @flow

import Router from '../../../core/router';
import Groups from './groups';
import CreateGroup from './create';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Groups(),
    },
    {
        path: 'create',
        controller: new CreateGroup(),
    },
]);

router.start();
