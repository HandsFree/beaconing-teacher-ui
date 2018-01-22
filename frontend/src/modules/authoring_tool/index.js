// @flow

import Router from '../../core/router';
import AuthoringTool from './root/authoring_tool';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new AuthoringTool(),
    },
]);

router.start();
