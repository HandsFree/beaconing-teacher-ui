// @flow
import { section, div, a, i, h1, form, input, select, option, p, label, span, small, textarea } from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';

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
        planPublic: true, // TODO: allow teacher to decide visibility
    };

    async createPlan(planButton: EventTarget) {
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

        console.log(obj);

        const status = await window.beaconingAPI.addGLP(obj);
        const statusMessage = new Status();

        console.log('[Create GLP] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: (await window.bcnI18n.getPhrase('plan_created')).replace('%s', this.state.planName),
            });

            this.appendView(statusMessageEl);

            planButton.textContent = await window.bcnI18n.getPhrase('lm_create_plan');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('plan_nc'),
        });

        planButton.textContent = await window.bcnI18n.getPhrase('lm_create_plan');

        this.appendView(statusMessageEl);
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
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#create-plan-button.button-action',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.createPlan(target);

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
