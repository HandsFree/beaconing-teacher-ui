// @flow
import { div, h4, h3 } from '../../../../core/html';

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
            MatchedGroups,
        } = this.state.results;
        const resultGroups = [];

        if (MatchedStudents.length > 0) {
            const promArr = [];

            const studentUsernameStr = await window.beaconingAPI.getPhrase('username');
            for (const student of MatchedStudents) {
                const resultBox = new ResultBox();
                const { profile } = student;

                const studentName = do {
                    if (profile.firstName && profile.lastName) {
                        div(
                            '.flex-column',
                            h3('.name', `${profile.firstName} ${profile.lastName}`),
                            h4(
                                '.username',
                                {
                                    title: studentUsernameStr,
                                },
                                student.username,
                            ),
                        );
                    } else {
                        h3('.username', student.username);
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
                    h4(`${await window.beaconingAPI.getPhrase('cr_students')}:`),
                ),
                div(
                    '.flex-container.flex-wrap.result-container',
                    boxes,
                ),
            );

            resultGroups.push(studentsEl);
        }

        if (MatchedGLPS.length > 0) {
            const promArr = [];

            for (const glp of MatchedGLPS) {
                const resultBox = new ResultBox();

                const glpNameEl = h3(glp.name);

                const resultBoxEl = resultBox.attach({
                    title: glpNameEl,
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
                    '.flex-container.flex-wrap.result-container',
                    boxes,
                ),
            );

            resultGroups.push(glpsEl);
        }

        if (MatchedGroups.length > 0) {
            const promArr = [];

            for (const group of MatchedGroups) {
                const resultBox = new ResultBox();

                const groupNameEl = h3(group.name);

                const resultBoxEl = resultBox.attach({
                    title: groupNameEl,
                    link: `//${window.location.host}/classroom/group?id=${group.id}&prev=search`,
                });

                promArr.push(resultBoxEl);
            }

            const boxes = await Promise.all(promArr).then(elements => elements);

            const groupsEl = div(
                '.result-group',
                div(
                    '.title',
                    h4('Groups:'),
                ),
                div(
                    '.flex-container.flex-wrap.result-container',
                    boxes,
                ),
            );

            resultGroups.push(groupsEl);
        }

        return resultGroups;
    }
}

export default SearchResults;
