// @flow
import { div, h4, span, strong, p, ul, li } from '../../../core/html';

import { Component } from '../../../core/component';

class GLPDetails extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[GLP Details] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
    }

    async render() {
        const listify = (arr) => {
            const elArr = [];
            for (const v of arr) {
                elArr.push(li(v));
            }

            return elArr;
        };

        const learningObjectives = do {
            if (this.state.glp.learningObjectives) {
                ul(listify(this.state.glp.learningObjectives));
            } else {
                p('');
            }
        };

        const competences = do {
            if (this.state.glp.competences) {
                ul(listify(this.state.glp.competences));
            } else {
                p('');
            }
        };

        return div(
            '#plan-details',
            div('.title', h4('GLP Details:')),
            div(
                '.small-details',
                div(
                    '.detail',
                    strong('Age: '),
                    span(this.state.glp.ageGroup),
                ),
                div(
                    '.detail',
                    strong('Domain: '),
                    span(this.state.glp.domain),
                ),
                div(
                    '.detail',
                    strong('Year: '),
                    span(this.state.glp.year),
                ),
            ),
            div(
                '.large-details',
                div(
                    '.detail',
                    strong('Description:'),
                    p(this.state.glp.description),
                ),
                div(
                    '.detail',
                    strong('Topic:'),
                    p(this.state.glp.topic),
                ),
                div(
                    '.detail',
                    strong('Learning Objectives:'),
                    learningObjectives,
                ),
                div(
                    '.detail',
                    strong('Competences:'),
                    competences,
                ),
            ),
        );
    }
}

export default GLPDetails;
