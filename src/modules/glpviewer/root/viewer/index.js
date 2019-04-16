// @flow
import { div, input, label } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import LoadPlan from './load_plan';

class GLPViewer extends RootComponent {
    state = {
        id: 1,
    };

    async loadPlan() {
        const loadPlan = new LoadPlan();

        const loadPlanEl = await loadPlan.attach({
            id: this.state.id,
        });

        const el = div(
            '#app',
            div(
                '.margin-bottom-20',
                label(
                    'Enter GLP ID: ',
                    {
                        style: 'margin: 0.75em;',
                    },
                    input({
                        type: 'text',
                        oninput: (event) => {
                            const { target } = event;

                            this.state.id = target.value;
                        },
                    }),
                ),
                div(
                    '.button-action',
                    {
                        onclick: () => this.loadPlan(),
                    },
                    'Get GLP',
                ),
            ),
            loadPlanEl,
        );

        this.updateView(el);
    }

    async render() {
        return div(
            '#app',
            div(
                label(
                    'Enter GLP ID: ',
                    {
                        style: 'margin: 0.75em;',
                    },
                    input({
                        type: 'text',
                        oninput: (event) => {
                            const { target } = event;

                            this.state.id = target.value;
                        },
                    }),
                ),
                div(
                    '.button-action',
                    {
                        onclick: () => this.loadPlan(),
                    },
                    'Get GLP',
                ),
            ),
        );
    }
}

export default GLPViewer;
