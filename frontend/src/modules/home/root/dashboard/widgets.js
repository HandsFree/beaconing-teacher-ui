// @flow
// import Swappable from '@shopify/draggable/lib/swappable';

import { section, div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentOverview from './student_overview';
// import QuerySearch from '../../../search/query';

class Widgets extends Component {
    // updateHooks = {
    //     EditLayoutClicked: this.editMode,
    // };

    async render() {
        const studentOverview = new StudentOverview();
        // const search = new QuerySearch();

        const studentOverviewEl = await studentOverview.attach();
        // const searchEl = await search.attach({ searchType: 'width-expand' });

        return div(
            '.flex-column',
            // section('.draggable-container.flex-column', searchEl),
            section('.draggable-container.flex-column', studentOverviewEl),
        );
    }

    // async editMode() {
    //     const containers = document.querySelectorAll('.draggable-container');
    //     const swap = new Swappable(containers, {
    //         draggable: '.draggable',
    //     });
    // }
}

export default Widgets;
