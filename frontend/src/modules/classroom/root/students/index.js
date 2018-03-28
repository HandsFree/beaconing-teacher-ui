// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import BasicSearch from '../../../search/basic';
import StudentsContainer from './students_container';
import CreateStudentButton from './create_student_button';

class Students extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new BasicSearch();
        const students = new StudentsContainer();
        const createStudentButton = new CreateStudentButton();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Classroom',
                innerNav: innerNav.attach(),
            }),
            search.attach({
                searchType: 'width-expand',
            }),
            students.attach(),
            createStudentButton.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                searchEl,
                studentsEL,
                createStudentButtonEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#students',
                        section(
                            createStudentButtonEl,
                            searchEl,
                        ),
                        studentsEL,
                    ),
                ),
            );
        });
    }
}

export default Students;
