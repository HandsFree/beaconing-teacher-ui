// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import LoadProfile from './load_profile';

class Profile extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const loadProfile = new LoadProfile();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            loadProfile.attach(),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                loadProfileEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    main(
                        '#teacher-profile.flex-column',
                        loadProfileEl,
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default Profile;
