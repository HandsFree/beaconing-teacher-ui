// @flow

import Router from '../../../core/router';
import Profile from './profile';
import ProfileEdit from './edit';

const router = new Router();

router.setRoutes([
    {
        path: '/',
        controller: new Profile(),
    },
    {
        path: 'edit',
        controller: new ProfileEdit(),
    },
]);

router.start();
