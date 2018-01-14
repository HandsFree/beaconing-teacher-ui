// @flow

import Component from '../../../core/component';

class StudentOverview extends Component {
    async render(): Promise<string> {
        const renderData = {
            path: 'home/root/templates/student_overview',
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default StudentOverview;
