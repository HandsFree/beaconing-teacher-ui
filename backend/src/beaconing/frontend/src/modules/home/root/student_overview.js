// @flow

import Component from '../../../core/component';

class StudentOverview extends Component {
    async render(): Promise<string> {
        return this.preparePage('home/root/templates/student_overview', {});
    }
}

export default StudentOverview;
