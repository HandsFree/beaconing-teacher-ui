// @flow
// import Swappable from '@shopify/draggable/lib/swappable';

import { section, div } from '../../../../core/html';

import { Component } from '../../../../core/component';
// import QuerySearch from '../../../search/query';

class Widgets extends Component {
    // updateHooks = {
    //     EditLayoutClicked: this.editMode,
    // };

    async render() {
        return div(
            '.flex-column',
            section('.draggable-container.flex-column'),
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
