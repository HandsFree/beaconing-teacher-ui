// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadStudents from './load_students';

class StudentsContainer extends Component {
    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach({
            msg: await window.bcnI18n.getPhrase('ld_students'),
        });

        return section('.flex-column', loadingEl);
    }

    async afterMount() {
        const loadStudents = new LoadStudents();

        const loadStudentsEl = await loadStudents.attach();

        // console.log(loadStudentsEl);

        const element = section('.flex-column', loadStudentsEl);

        this.updateView(element);
    }
}

export default StudentsContainer;
