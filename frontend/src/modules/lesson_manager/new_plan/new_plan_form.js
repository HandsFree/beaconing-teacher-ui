// @flow
import { section, div, a, i, h1, form, input, select, option, p, label, span, small, textarea } from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';

class NewPlanForm extends Component {
    state = {
        planName: '',
        planCategory: 'default',
        planDescription: '',
        planAuthor: 'teacher', // TODO: add actual username from profile
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
            author: this.state.planAuthor,
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
                message: `Plan '${this.state.planName}' created`,
            });

            this.appendView(statusMessageEl);

            planButton.textContent = 'Create Plan';

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'plan not created!',
        });

        planButton.textContent = 'Create Plan';

        this.appendView(statusMessageEl);
    }

    async render() {
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
                        'Go Back',
                    ),
                    h1('Create New Plan'),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p('Enter New Plan information:'),
                    ),
                    form(
                        '.create-new-plan',
                        label(
                            span('Plan Name'),
                            input(
                                '#plan-name.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Name',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Plan Description'),
                            textarea(
                                '#plan-description',
                                {
                                    placeholder: 'Enter Description',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planDescription = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Plan Domain'),
                            input(
                                '#plan-domain.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Domain',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planDomain = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Plan Topic'),
                            input(
                                '#plan-topic.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Topic',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planTopic = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Plan Age Group'),
                            input(
                                '#plan-age-group.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Age Group',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.planAgeGroup = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Plan Year'),
                            input(
                                '#plan-year.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Year',
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
                            span('Plan Learning Objectives'),
                            textarea(
                                '#plan-learning-objectives',
                                {
                                    placeholder: 'Enter Learning Objectives (one per line)',
                                    oninput: (event) => {
                                        const { target } = event;
                                        const values = target.value.split('\n');

                                        this.state.planLearningObjectives = values;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Plan Competences'),
                            textarea(
                                '#plan-competences',
                                {
                                    placeholder: 'Enter Competences (one per line)',
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

                                        target.textContent = 'Creating...';
                                    },
                                },
                                'Create Plan',
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default NewPlanForm;
