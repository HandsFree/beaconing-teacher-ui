// @flow
import { div, h4 } from '../../../../core/html';

import { Component } from '../../../../core/component';
import ResultBox from './result_box';

class SearchResults extends Component {
    async init() {
        const query = decodeURIComponent(this.props.query);

        this.state.results = await window.beaconingAPI.getSearchResults({ query });
    }

    async render() {
        const {
            MatchedGLPS,
            MatchedStudents,
        } = this.state.results;
        const resultGroups = [];

        if (MatchedStudents.length > 0) {
            const promArr = [];

            for (const student of MatchedStudents) {
                const resultBox = new ResultBox();
                const { profile } = student;
                const studentName = do {
                    if (profile.firstName && profile.lastName) {
                        `${profile.firstName} ${profile.lastName}`;
                    } else {
                        student.username;
                    }
                };

                const resultBoxEl = resultBox.attach({
                    title: studentName,
                    link: `//${window.location.host}/classroom/student?id=${student.id}`,
                });

                promArr.push(resultBoxEl);
            }

            const boxes = await Promise.all(promArr).then(elements => elements);

            const studentsEl = div(
                '.result-group',
                div(
                    '.title',
                    h4(`${await window.bcnI18n.getPhrase('students')}:`),
                ),
                div(
                    '.flex-container.flex-wrap',
                    boxes,
                ),
            );

            resultGroups.push(studentsEl);
        }

        if (MatchedGLPS.length > 0) {
            const promArr = [];

            for (const glp of MatchedGLPS) {
                const resultBox = new ResultBox();

                const resultBoxEl = resultBox.attach({
                    title: glp.name,
                    link: `//${window.location.host}/lesson_manager#view?id=${glp.id}&prev=search`,
                });

                promArr.push(resultBoxEl);
            }

            const boxes = await Promise.all(promArr).then(elements => elements);

            const glpsEl = div(
                '.result-group',
                div(
                    '.title',
                    h4('GLP\'s:'),
                ),
                div(
                    '.flex-container.flex-wrap',
                    boxes,
                ),
            );

            resultGroups.push(glpsEl);
        }

        return resultGroups;
    }
}

export default SearchResults;
