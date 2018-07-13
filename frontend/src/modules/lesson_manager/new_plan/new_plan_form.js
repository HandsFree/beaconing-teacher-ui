// @flow
import {
    section,
    div,
    a,
    i,
    h1,
    form,
    input,
    p,
    label,
    span,
    textarea,
} from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';
import PostCreation from './post_creation';
import nullishCheck from '../../../core/util';

class NewPlanForm extends Component {
    state = {
        planName: '',
        planCategory: 'default',
        planDescription: '',
        planDomain: '',
        planTopic: '',
        planAgeGroup: '',
        planYear: '',
        planLearningObjectives: [''],
        planCompetences: [''],
        planPublic: false,
    };

    updateHooks = {
        ResetForm: this.resetForm,
    };

    async resetForm() {
        this.state = {
            planName: '',
            planCategory: 'default',
            planDescription: '',
            planDomain: '',
            planTopic: '',
            planAgeGroup: '',
            planYear: '',
            planLearningObjectives: [''],
            planCompetences: [''],
            planPublic: false,
        };

        this.updateView(await this.render());
    }

    async resetSubmit() {
        const planButton = document.getElementById('create-plan-button');
        planButton.textContent = await window.bcnI18n.getPhrase('lm_create_plan');
    }

    async checkFields() {
        // TODO: reduce duped code
        if (this.state.planName === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-name',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('lm_plan_name')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        const glps = await window.beaconingAPI.getGLPs('owned', 'desc', true);

        if (nullishCheck(glps, false)) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-name',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('glp_name_exists')),
            });

            for (const glp of glps) {
                if (glp.name.toLowerCase() === this.state.planName.toLowerCase()) {
                    this.appendView(statusMessageEl);

                    this.resetSubmit();

                    return false;
                }
            }
        }

        if (this.state.planDescription === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-description',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('lm_plan_desc')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        if (this.state.planDomain === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-domain',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('lm_plan_domain')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        if (this.state.planTopic === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-topic',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('lm_plan_topic')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        if (this.state.planAgeGroup === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-age-group',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('lm_plan_ag')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        if (this.state.planYear === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'plan-year',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('lm_plan_year')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        return true;
    }

    async createPlan() {
        if (await this.checkFields() === false) {
            return;
        }

        const obj = {
            name: this.state.planName,
            category: this.state.planCategory,
            description: this.state.planDescription,
            domain: this.state.planDomain,
            topic: this.state.planTopic,
            ageGroup: this.state.planAgeGroup,
            year: parseInt(this.state.planYear, 10),
            learningObjectives: this.state.planLearningObjectives,
            competences: this.state.planCompetences,
            public: this.state.planPublic,
        };

        const status = await window.beaconingAPI.addGLP(obj);
        const statusMessage = new Status();

        console.log('[Create GLP] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            this.resetSubmit();
            this.afterCreation(status);

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('plan_nc'),
        });

        this.appendView(statusMessageEl);

        this.resetSubmit();
    }

    async afterCreation(glp: Object) {
        const pcEL = new PostCreation().attach({
            title: await window.bcnI18n.getPhrase('glp_cre'),
            id: glp.id,
        });

        this.updateView(await pcEL);
    }

    async render() {
        const creatingText = await window.bcnI18n.getPhrase('creating');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '#section-header',
                    a(
                        '.back',
                        {
                            href: `//${window.location.host}/lesson_manager`,
                        },
                        i('.icon-angle-left'),
                        await window.bcnI18n.getPhrase('go_back'),
                    ),
                    h1(await window.bcnI18n.getPhrase('lm_create_new_plan')),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(await window.bcnI18n.getPhrase('lm_enter_plan_info')),
                    ),
                    form(
                        '.create-new-plan',
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_name')),
                            input(
                                '#plan-name.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_name'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planName = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_desc')),
                            textarea(
                                '#plan-description',
                                {
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_desc'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planDescription = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_domain')),
                            input(
                                '#plan-domain.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_domain'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planDomain = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_topic')),
                            input(
                                '#plan-topic.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_topic'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planTopic = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_ag')),
                            input(
                                '#plan-age-group.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_ag'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planAgeGroup = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_year')),
                            input(
                                '#plan-year.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_year'),
                                    pattern: '[0-9]{4}',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planYear = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        // TODO: change to more user friendly solution
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_los')),
                            textarea(
                                '#plan-learning-objectives',
                                {
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_los'),
                                    oninput: (event) => {
                                        const { target } = event;
                                        const values = target.value.split('\n');

                                        this.state.planLearningObjectives = values;
                                    },
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_plan_comps')),
                            textarea(
                                '#plan-competences',
                                {
                                    placeholder: await window.bcnI18n.getPhrase('lm_enter_plan_comps'),
                                    oninput: (event) => {
                                        const { target } = event;
                                        const values = target.value.split('\n');

                                        this.state.planCompetences = values;
                                    },
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('lm_vis')),
                            div(
                                '.radio',
                                span('Public'),
                                input(
                                    '#plan-vis-public',
                                    {
                                        type: 'radio',
                                        onchange: (event) => {
                                            const { target } = event;

                                            if (target.checked) {
                                                const radioEl = document.getElementById('plan-vis-private');

                                                radioEl.checked = false;

                                                this.state.planPublic = true;
                                            }
                                        },
                                    },
                                ),
                            ),
                            div(
                                '.radio',
                                span('Private'),
                                input(
                                    '#plan-vis-private',
                                    {
                                        type: 'radio',
                                        onchange: (event) => {
                                            const { target } = event;

                                            if (target.checked) {
                                                const radioEl = document.getElementById('plan-vis-public');

                                                radioEl.checked = false;

                                                this.state.planPublic = false;
                                            }
                                        },
                                        checked: true,
                                    },
                                ),
                            ),
                        ),
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#create-plan-button.button-action',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.createPlan();

                                        target.textContent = `${creatingText}...`;
                                    },
                                },
                                await window.bcnI18n.getPhrase('lm_create_plan'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default NewPlanForm;
