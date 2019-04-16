// @flow

import Router from '../../../core/router';
import Search from './search';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Search(),
    },
]);

router.start();
