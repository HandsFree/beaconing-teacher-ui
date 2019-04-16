// @flow

import Router from '../../../core/router';
import GLPViewer from './viewer';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new GLPViewer(),
    },
]);

router.start();
