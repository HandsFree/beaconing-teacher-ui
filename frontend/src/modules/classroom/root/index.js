// @flow

import Router from '../../../core/router';
import Students from './students';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Students(),
    },
]);

router.start();
