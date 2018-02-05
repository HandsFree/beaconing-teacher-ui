// @flow
import { div, span, input } from '../../../../core/html';

import { Component } from '../../../../core/component';

class CreateGroup extends Component {
    async handleInput(name: string) {
        if (name.length < 1) {
            return;
        }

        const status = await window.beaconingAPI.addGroup(name);
        console.log(`[Create Group] status: ${status}`);
    }

    async openInput() {
        const element = div(
            '.input-box',
            input({
                type: 'text',
                onkeypress: (event) => {
                    const {
                        key,
                        target,
                    } = event;

                    if (key === 'Enter') {
                        this.handleInput(target.value);
                        this.updateView(this.normalView());
                    }
                },
            }),
        );

        this.updateView(element);
    }

    normalView() {
        return div(
            '.outline-button',
            {
                onclick: () => {
                    this.openInput();
                },
            },
            span('Create Group'),
        );
    }

    async render() {
        return this.normalView();
    }
}

export default CreateGroup;
