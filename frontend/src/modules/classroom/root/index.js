// @flow

import Router from '../../../core/router';
import Students from './students';
import CreateStudent from './create';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Students(),
    },
    {
        path: 'create',
        controller: new CreateStudent(),
    }
]);

router.start();
