// @flow
import { div, main } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import StudentForm from './student_form';

class CreateStudent extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const studentForm = new StudentForm();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.beaconingAPI.getPhrase('cr'),
                innerNav: innerNav.attach(),
            }),
            studentForm.attach(),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
                studentFormEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#create-student',
                        studentFormEl,
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default CreateStudent;
