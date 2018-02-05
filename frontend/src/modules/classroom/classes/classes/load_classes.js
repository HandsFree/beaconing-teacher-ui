// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import ClassBox from './class_box';

/* eslint-disable no-restricted-syntax */

class LoadClasses extends Component {
    state = {
        classes: [
            {
                name: 'Class 1',
            },
            {
                name: 'Class 2',
            },
            {
                name: 'Class 3',
            },
        ],
    };

    async render() {
        const promArr = [];

        for (const classObj of this.state.classes) {
            const { name } = classObj;

            const classBox = new ClassBox();

            const classBoxProm = classBox.attach({
                name,
            });

            promArr.push(classBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.flex-container.flex-wrap.margin-20.list', elements));
    }
}

export default LoadClasses;
