// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import ProfileEditForm from './edit_profile_form';

class ProfileEdit extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const profileEditForm = new ProfileEditForm();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            profileEditForm.attach(),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                profileEditFormEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        '#teacher-profile-edit.flex-column',
                        profileEditFormEl,
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default ProfileEdit;
