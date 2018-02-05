// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import CourseBox from './course_box';

/* eslint-disable no-restricted-syntax */

class LoadCourses extends Component {
    state = {
        courses: [
            {
                name: 'Course 1',
            },
            {
                name: 'Course 2',
            },
            {
                name: 'Course 3',
            },
        ],
    };

    async render() {
        const promArr = [];

        for (const courseObj of this.state.courses) {
            const { name } = courseObj;

            const courseBox = new CourseBox();

            const courseBoxProm = courseBox.attach({
                name,
            });

            promArr.push(courseBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.flex-container.flex-wrap.margin-20.list', elements));
    }
}

export default LoadCourses;
