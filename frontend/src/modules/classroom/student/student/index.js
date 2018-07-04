// @flow
import { div, main, strong } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import StudentMain from './student_main';
import StudentAside from './student_aside';
import StudentInfo from './student_info';

class Student extends RootComponent {
    studentExists = true;
    updateHooks = {
        StudentDeleted: this.handleStudentDelete,
    };

    async init() {
        const id = this.params.id;

        if (!id) {
            console.log('[View Student] No Student ID provided!');
            this.studentExists = false;
            return;
        }

        const student = await window.beaconingAPI.getStudent(id);

        console.log(student);

        if (!student || student.id === 0) {
            this.studentExists = false;
            return;
        }
    }

    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const studentInfo = new StudentInfo();
        const studentMain = new StudentMain();
        const studentAside = new StudentAside();

        const noStudentMsg = await window.bcnI18n.getPhrase('no_student');

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('classroom'),
                innerNav: innerNav.attach(),
            }),
            studentInfo.attach(this.params),
            studentMain.attach(this.params),
            studentAside.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
                studentInfoEl,
                studentMainEl,
                studentAsideEl,
            ] = values;

            return this.studentExists ? div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#student.no-padding',
                        div(
                            '.flex-spacebetween.flex-align-stretch.flex-grow',
                            studentInfoEl,
                            studentMainEl,
                            studentAsideEl,
                        ),
                    ),
                ),
                footerEl,
            ) : div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#student.no-padding',
                        div(
                            '.flex-grow.flex-align-center.flex-justify-center',
                            strong(noStudentMsg),
                        ),
                    ),
                ),
                footerEl,
            );
        });
    }

    async handleStudentDelete() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();

        const studentDelMsg = await window.bcnI18n.getPhrase('student_del');

        const el = await Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('classroom'),
                innerNav: innerNav.attach(),
            }),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#student.no-padding',
                        div(
                            '.flex-justify-center.flex-align-center.flex-grow',
                            strong(studentDelMsg),
                        ),
                    ),
                ),
                footerEl,
            );
        });

        this.updateView(el);
    }
}

export default Student;
