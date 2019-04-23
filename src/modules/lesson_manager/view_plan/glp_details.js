// @flow
import { div, h4, span, strong, p, ul, li } from '../../../core/html';

import { Component } from '../../../core/component';

class GLPDetails extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[GLP Details] GLP ID not provided');
        }

        this.state.trans = await window.beaconingAPI.getPhrases(
            'lm_cac',
            'lm_ps',
            'lm_if',
            'lm_not_rec',
            'never',
            'lm_glp_details',
            'lm_age',
            'lm_domain',
            'lm_year',
            'lm_owner',
            'description',
            'lm_topic',
            'lm_los',
            'lm_comps',
            'lm_created',
            'lm_mod',  
        );

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

        const cac = this.state.trans.get('lm_cac');
        const ps = this.state.trans.get('lm_ps');
        const info = this.state.trans.get('lm_if');

        const competences = do {
            if (this.state.glp.competences) {
                const arr = this.state.glp.competences.map((value) => {
                    if (value === 'communicationAndCollaboration') {
                        return cac;
                    }

                    if (value === 'problemSolving') {
                        return ps;
                    }

                    if (value === 'informationFluency') {
                        return info;
                    }

                    return value;
                });
                ul(listify(arr));
            } else {
                p('');
            }
        };

        let dateCreatedText = this.state.trans.get('lm_not_rec');
        let timeCreatedText = '';
        let dateUpdatedText = this.state.trans.get('never');
        let timeUpdatedText = '';

        if (this.state.glp.createdAt && this.state.glp.createdAt !== '0001-01-01T00:00:00Z') {
            const dateObj = new Date(this.state.glp.createdAt);
            dateCreatedText = dateObj.toDateString();
            timeCreatedText = dateObj.toTimeString();
        }

        if (this.state.glp.updatedAt && this.state.glp.updatedAt !== '0001-01-01T00:00:00Z') {
            const dateObj = new Date(this.state.glp.updatedAt);
            dateUpdatedText = dateObj.toDateString();
            timeUpdatedText = dateObj.toTimeString();
        }

        return div(
            '#plan-details',
            div('.title', h4(`${this.state.trans.get('lm_glp_details')}:`)),
            div(
                '.small-details',
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_age')}: `),
                    span(this.state.glp.ageGroup),
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_domain')}: `),
                    span(this.state.glp.domain),
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_year')}: `),
                    span(this.state.glp.year),
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_owner')}: `),
                    span(this.state.glp.owner),
                ),
            ),
            div(
                '.large-details',
                div(
                    '.detail',
                    strong(`${this.state.trans.get('description')}:`),
                    p(this.state.glp.description),
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_topic')}:`),
                    p(this.state.glp.topic),
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_los')}:`),
                    learningObjectives,
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_comps')}:`),
                    competences,
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_created')}:`),
                    p(
                        {
                            title: timeCreatedText,
                        },
                        dateCreatedText,
                    ),
                ),
                div(
                    '.detail',
                    strong(`${this.state.trans.get('lm_mod')}:`),
                    p(
                        {
                            title: timeUpdatedText,
                        },
                        dateUpdatedText,
                    ),
                ),
            ),
        );
    }
}

export default GLPDetails;
