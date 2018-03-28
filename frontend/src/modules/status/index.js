// @flow
import { label, span, strong, i } from '../../core/html';

import { Component } from '../../core/component';

class Status extends Component {
    timeout = false;

    async render() {
        const {
            elementID,
            heading,
            message,
            type,
        } = this.props;
        let typeClass = '';

        switch (type) {
        case 'status':
            typeClass = '.info';
            break;
        case 'error':
            typeClass = '.error';
            break;
        case 'success':
            typeClass = '.success';
            break;
        default:
            typeClass = '.info';
            break;
        }

        return label(
            `.status-message${typeClass}`,
            elementID === false ? {} : {
                for: elementID,
            },
            strong(`${heading}: `),
            span(message),
            i(
                '.icon-cancel',
                {
                    onclick: () => {
                        this.handleRemove();
                    },
                },
            ),
        );
    }

    handleRemove() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.removeSelf();
            return;
        }

        this.timeout = setTimeout(this.removeSelf.bind(this), 15000);
    }

    async afterMount() {
        this.handleRemove();
    }
}

export default Status;
