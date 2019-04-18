// @flow
import {
    section,
    div,
    form,
    input,
    label,
    span,
    select,
    option,
    textarea,
} from '../../../core/html';

import Form from '../../form';
import Status from '../../status';
import nullishCheck from '../../../core/util';

class EditGLPForm extends Form {
    stateObj = {
        planName: '',
        planCategory: 'science',
        planDescription: '',
        planDomain: '',
        planTopic: '',
        planAgeGroup: '',
        planYear: '',
        planLearningObjectives: [],
        planCompetences: {
            communicationAndCollaboration: false,
            problemSolving: false,
            informationFluency: false,
        },
        planPublic: false,
    };

    transKeys = [
        'lm_save_plan',
        'err_glp_name_exists',
        'err_required_empty',
        'err_plan_year_not_valid',
        'err_form',
        'err_plan_nc',
        'saving',
        'lm_plan_name',
        'name_for_lp_help',
        'lm_enter_plan_name',
        'lm_plan_desc',
        'lm_plan_desc_desc',
        'lm_enter_plan_desc',
        'lm_plan_cat',
        'lm_plan_cat_desc',
        'lm_science',
        'lm_tech',
        'lm_eng',
        'lm_maths',
        'lm_plan_domain',
        'lm_plan_domain_desc',
        'lm_enter_plan_domain',
        'lm_plan_topic',
        'lm_plan_topic_desc',
        'lm_enter_plan_topic',
        'lm_plan_ag',
        'lm_plan_ag_desc',
        'lm_enter_plan_ag',
        'lm_plan_year',
        'lm_plan_year_desc',
        'lm_enter_plan_year',
        'lm_plan_los',
        'lm_plan_los_desc',
        'lm_enter_plan_los',
        'lm_plan_comps',
        'lm_plan_comps_desc',
        'lm_cac',
        'lm_ps',
        'lm_if',
        'lm_vis',
        'lm_plan_vis_desc',
        'lm_public',
        'lm_private',
        'lm_save_plan',
    ];

    stateProxy = {
        set(obj, prop, value) {
            let trimmedValue = value;

            if (typeof value === 'string') {
                trimmedValue = value.trim();
            }

            if (Array.isArray(value)) {
                trimmedValue = value.map(v => v.trim())
                    .filter(v => v !== '');
            }

            // console.log(trimmedValue);

            return Reflect.set(obj, prop, trimmedValue);
        },
    };

    state = new Proxy(this.stateObj, this.stateProxy);

    glp = {};

    glps = {};

    formChanged = false;

    async init() {
        const { glp } = this.props;
        
        if (!glp) {
            throw new Error('[EditGLPForm] no glp provided!');
        }
        
        this.glp = glp;
        
        this.state = {
            planName: this.glp?.name || '',
            planCategory: this.glp?.category || '',
            planDescription: this.glp?.description || '',
            planDomain: this.glp?.domain || '',
            planTopic: this.glp?.topic || '',
            planAgeGroup: this.glp?.ageGroup || '',
            planYear: this.glp?.year || 0,
            planLearningObjectives: this.glp?.learningObjectives || [],
            planCompetences: {
                communicationAndCollaboration: this.glp?.competences?.indexOf('communicationAndCollaboration') !== -1,
                problemSolving: this.glp?.competences?.indexOf('problemSolving') !== -1,
                informationFluency: this.glp?.competences?.indexOf('informationFluency') !== -1,
            },
            planPublic: this.glp?.public,

            phrases: await window.beaconingAPI.getPhrases(...this.transKeys),
        };

        console.log(this.state);
    }

    async resetSubmit() {
        const saveButton = document.getElementById('save-plan-button');
        saveButton.textContent = this.state.phrases.get('lm_save_plan');
    }

    async checkGLPName() {
        const errMsg = this.state.phrases.get('err_glp_name_exists');

        if (this.state.planName === '') {
            this.removeAll('plan-name-status');

            return true;
        }

        if (this.state.planName !== this.glp.name) {
            const glps = await window.beaconingAPI.getGLPs('owned', 'desc', true);
            for (const glp of glps) {
                if (glp.name.toLowerCase() === this.state.planName.toLowerCase()) {
                    this.addError('plan-name-status', errMsg);
                    this.resetSubmit();

                    return false;
                }
            }
        }

        this.addSuccess('plan-name-status');
        return true;
    }

    async checkFields() {
        let success = true;
        const emptyMsg = this.state.phrases.get('err_required_empty');

        if (this.state.planName === '') {
            this.addError('plan-name-status', emptyMsg);
            success = false;
        }

        if (this.state.planName !== '' && !(await this.checkGLPName())) {
            success = false;
        }

        if (this.state.planDescription === '') {
            this.addError('plan-desc-status', emptyMsg);
            success = false;
        }

        if (this.state.planDomain === '') {
            this.addError('plan-domain-status', emptyMsg);
            success = false;
        }

        if (this.state.planTopic === '') {
            this.addError('plan-topic-status', emptyMsg);
            success = false;
        }

        if (this.state.planAgeGroup === '') {
            this.addError('plan-ag-status', emptyMsg);
            success = false;
        }

        if (this.state.planYear === '') {
            this.addError('plan-year-status', emptyMsg);
            success = false;
        }

        if (this.state.planYear !== '' && !(/^[0-9]{4}$/).test(this.state.planYear)) {
            const errMsg = this.state.phrases.get('err_plan_year_not_valid');
            this.addError('plan-year-status', errMsg);
            success = false;
        }

        if (!success) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Error',
                type: 'error',
                message: this.state.phrases.get('err_form'),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        return true;
    }

    async savePlan() {
        if (await this.checkFields() === false) {
            return;
        }

        const comps = [];
        for (const [key, value] of Object.entries(this.state.planCompetences)) {
            if (value) {
                comps.push(key);
            }
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
            competences: comps,
            public: this.state.planPublic,
        };

        // console.log(obj);

        const status = await window.beaconingAPI.updateGLP(this.props.id, obj);
        const statusMessage = new Status();

        console.log(status);

        console.log('[Edit GLP] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            this.resetSubmit();
            this.afterCreation();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: this.state.phrases.get('err_plan_nc'),
        });

        this.appendView(statusMessageEl);

        this.resetSubmit();
    }

    async afterCreation() {
        return true;
    }

    enableButton() {
        const buttonEl = document.getElementById('save-plan-button');

        if (nullishCheck(buttonEl, false)) {
            buttonEl.classList.remove('disabled');
        }
    }

    async render() {
        const savingText = this.state.phrases.get('saving');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '.flex-column',
                    form(
                        '.edit-plan',
                        {
                            oninput: () => {
                                this.formChanged = true;
                                this.enableButton();
                            },
                        },
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_name'))),
                                div('.desc-area', this.state.phrases.get('name_for_lp_help')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#plan-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: this.state.phrases.get('lm_enter_plan_name'),
                                                value: this.state.planName,
                                                oninput: (event) => {
                                                    const { target } = event;
            
                                                    this.state.planName = target.value;
                                                    this.addLoading('plan-name-status');
                                                    this.checkGLPName();
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#plan-name-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_desc'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_desc_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required.word-count',
                                        textarea(
                                            '#plan-description',
                                            {
                                                placeholder: this.state.phrases.get('lm_enter_plan_desc'),
                                                value: this.state.planDescription,
                                                oninput: (event) => {
                                                    const { target } = event;
                                                    const { value } = target;
                                                    const { length } = value.replace((/\n/g), '');
                                                    const countEl = document.querySelector('#plan-description ~ span');
            
                                                    this.state.planDescription = value;
                                                    countEl.textContent = length;
                                                },
                                                required: true,
                                            },
                                        ),
                                        span('.count', this.state.planDescription.length),
                                    ),
                                ),
                                div('#plan-desc-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_cat'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_cat_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.select.required',
                                        select(
                                            '#plan-category',
                                            {
                                                onchange: (event) => {
                                                    const { target } = event;
            
                                                    this.state.planCategory = target.value;
                                                },
                                                required: true,
                                            },
                                            option(
                                                {
                                                    value: 'science',
                                                    selected: this.state.category === 'science',
                                                },
                                                this.state.phrases.get('lm_science'),
                                            ),
                                            option(
                                                {
                                                    value: 'technology',
                                                    selected: this.state.category === 'technology',
                                                },
                                                this.state.phrases.get('lm_tech'),
                                            ),
                                            option(
                                                {
                                                    value: 'engineering',
                                                    selected: this.state.category === 'engineering',
                                                },
                                                this.state.phrases.get('lm_eng'),
                                            ),
                                            option(
                                                {
                                                    value: 'maths',
                                                    selected: this.state.category === 'maths',
                                                },
                                                this.state.phrases.get('lm_maths'),
                                            ),
                                        ),
                                    ),
                                ),
                                div('#plan-category-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_domain'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_domain_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#plan-domain.text-field',
                                            {
                                                type: 'text',
                                                placeholder: this.state.phrases.get('lm_enter_plan_domain'),
                                                value: this.state.planDomain,
                                                oninput: (event) => {
                                                    const { target } = event;
            
                                                    this.state.planDomain = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#plan-domain-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_topic'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_topic_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#plan-topic.text-field',
                                            {
                                                type: 'text',
                                                placeholder: this.state.phrases.get('lm_enter_plan_topic'),
                                                value: this.state.planTopic,
                                                oninput: (event) => {
                                                    const { target } = event;
            
                                                    this.state.planTopic = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#plan-topic-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_ag'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_ag_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#plan-age-group.text-field',
                                            {
                                                type: 'text',
                                                placeholder: this.state.phrases.get('lm_enter_plan_ag'),
                                                value: this.state.planAgeGroup,
                                                oninput: (event) => {
                                                    const { target } = event;
            
                                                    this.state.planAgeGroup = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#plan-ag-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_year'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_year_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#plan-year.text-field',
                                            {
                                                type: 'text',
                                                placeholder: this.state.phrases.get('lm_enter_plan_year'),
                                                value: this.state.planYear,
                                                pattern: '[0-9]{4}',
                                                oninput: (event) => {
                                                    const { target } = event;
            
                                                    this.state.planYear = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#plan-year-status.status-area'),
                            ),
                        ),
                        // TODO: change to more user friendly solution
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_los'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_los_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.word-count',
                                        textarea(
                                            '#plan-learning-objectives',
                                            {
                                                placeholder: this.state.phrases.get('lm_enter_plan_los'),
                                                value: this.state.planLearningObjectives.join('\n'),
                                                oninput: (event) => {
                                                    const { target } = event;
                                                    const { value } = target;
                                                    const { length } = value.replace((/\n/g), '');
                                                    const countEl = document.querySelector('#plan-learning-objectives ~ span');
                                                    const values = value.split('\n');
            
                                                    this.state.planLearningObjectives = values;
                                                    countEl.textContent = length;
                                                },
                                            },
                                        ),
                                        span('.count', this.state.planLearningObjectives.join('').length),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_plan_comps'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_comps_desc')),
                                div(
                                    '.input-area.flex-column',
                                    label(
                                        '.inline',
                                        input(
                                            '#plan-lo-cac',
                                            {
                                                type: 'checkbox',
                                                checked: this.state.planCompetences.communicationAndCollaboration,
                                                onchange: (event) => {
                                                    const { target } = event;
            
                                                    if (target.checked) {
                                                        this.state.planCompetences.communicationAndCollaboration = true;
            
                                                        return;
                                                    }
            
                                                    this.state.planCompetences.communicationAndCollaboration = false;
                                                },
                                            },
                                        ),
                                        div('.check-box'),
                                        span(this.state.phrases.get('lm_cac')),
                                    ),
                                    label(
                                        '.inline',
                                        input(
                                            '#plan-lo-ps',
                                            {
                                                type: 'checkbox',
                                                checked: this.state.planCompetences.problemSolving,
                                                onchange: (event) => {
                                                    const { target } = event;
            
                                                    if (target.checked) {
                                                        this.state.planCompetences.problemSolving = true;
            
                                                        return;
                                                    }
            
                                                    this.state.planCompetences.problemSolving = false;
                                                },
                                            },
                                        ),
                                        div('.check-box'),
                                        span(this.state.phrases.get('lm_ps')),
                                    ),
                                    label(
                                        '.inline',
                                        input(
                                            '#plan-lo-if',
                                            {
                                                type: 'checkbox',
                                                checked: this.state.planCompetences.informationFluency,
                                                onchange: (event) => {
                                                    const { target } = event;
            
                                                    if (target.checked) {
                                                        this.state.planCompetences.informationFluency = true;
            
                                                        return;
                                                    }
            
                                                    this.state.planCompetences.informationFluency = false;
                                                },
                                            },
                                        ),
                                        div('.check-box'),
                                        span(this.state.phrases.get('lm_if')),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.phrases.get('lm_vis'))),
                                div('.desc-area', this.state.phrases.get('lm_plan_vis_desc')),
                                div(
                                    '.input-area.flex-column',
                                    label(
                                        '.inline',
                                        input(
                                            '#plan-vis-public',
                                            {
                                                type: 'radio',
                                                checked: this.state.planPublic === true,
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
                                        div('.radio-box'),
                                        span(this.state.phrases.get('lm_public')),
                                    ),
                                    label(
                                        '.inline',
                                        input(
                                            '#plan-vis-private',
                                            {
                                                type: 'radio',
                                                checked: this.state.planPublic === false,
                                                onchange: (event) => {
                                                    const { target } = event;
            
                                                    if (target.checked) {
                                                        const radioEl = document.getElementById('plan-vis-public');
            
                                                        radioEl.checked = false;
            
                                                        this.state.planPublic = false;
                                                    }
                                                },
                                            },
                                        ),
                                        div('.radio-box'),
                                        span(this.state.phrases.get('lm_private')),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#save-plan-button.button-submit.disabled',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
            
                                        if (this.formChanged) {
                                            this.savePlan();
            
                                            target.textContent = `${savingText}...`;
                                        }
                                    },
                                },
                                this.state.phrases.get('lm_save_plan'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default EditGLPForm;
