// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import LoadProfile from './load_profile';

class Profile extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const loadProfile = new LoadProfile();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            loadProfile.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                loadProfileEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        '#teacher-profile.flex-column',
                        loadProfileEl,
                    ),
                ),
            );
        });
    }
}

export default Profile;
