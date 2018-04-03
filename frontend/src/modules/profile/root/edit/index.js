// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import ProfileEditForm from './edit_profile_form';

class ProfileEdit extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const profileEditForm = new ProfileEditForm();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            profileEditForm.attach(),
        ]).then((values) => {
            const [
                headerEl,
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
            );
        });
    }
}

export default ProfileEdit;
