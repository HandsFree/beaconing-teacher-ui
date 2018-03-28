// @flow
import { div, main, strong } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import StudentMain from './student_main';
import StudentAside from './student_aside';

class Student extends RootComponent {
    updateHooks = {
        StudentDeleted: this.handleStudentDelete,
    };

    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const studentMain = new StudentMain();
        const studentAside = new StudentAside();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Classroom',
                innerNav: innerNav.attach(),
            }),
            studentMain.attach(this.params),
            studentAside.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                studentMainEl,
                studentAsideEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#student.no-padding',
                        div(
                            '.flex-spacebetween.flex-align-stretch.flex-grow',
                            studentMainEl,
                            studentAsideEl,
                        ),
                    ),
                ),
            );
        });
    }

    async handleStudentDelete() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();

        const el = await Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Classroom',
                innerNav: innerNav.attach(),
            }),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#student.no-padding',
                        div(
                            '.flex-justify-center.flex-align-center.flex-grow',
                            strong('Student Deleted!'),
                        ),
                    ),
                ),
            );
        });

        this.updateView(el);
    }
}

export default Student;
