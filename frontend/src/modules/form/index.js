// @flow
import {
    div,
    i,
    span,
} from '../../core/html';

import { Component } from '../../core/component';
import nullishCheck from '../../core/util';

class Form extends Component {
    stateObj = {};

    stateProxy = {};

    state = new Proxy(this.stateObj, this.stateProxy);

    enabledErrors = [];

    removeErrors() {
        for (const v of this.enabledErrors) {
            this.removeError(v);
        }
    }

    addError(elementID: string, errMsg: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;
        const errEl = div(
            '.flex-align-center',
            i('.icon-cancel', { attrs: { 'aria-hidden': true } }),
            span(errMsg),
        );

        if (this.enabledErrors.indexOf(elementID) === -1) {
            this.enabledErrors.push(elementID);
        }

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            labelGroup.classList.remove('loading');
            labelGroup.classList.remove('success');
            labelGroup.classList.add('error');
            // console.log(el);
            if (el.childElementCount > 0) {
                el.replaceChild(errEl, el.firstElementChild);
            }

            el.appendChild(errEl);
        }
    }

    addLoading(elementID: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;
        const loadingEl = i('.icon-load', { attrs: { 'aria-hidden': true } });

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            labelGroup.classList.remove('error');
            labelGroup.classList.remove('success');
            labelGroup.classList.add('loading');
            if (el.childElementCount > 0) {
                el.replaceChild(loadingEl, el.firstElementChild);
            }

            el.appendChild(loadingEl);
        }
    }

    addSuccess(elementID: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;
        const successEl = i('.icon-ok', { attrs: { 'aria-hidden': true } });

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            if (this.enabledErrors.indexOf(elementID) !== -1) {
                delete this.enabledErrors[elementID];
                labelGroup.classList.remove('error');
            }

            labelGroup.classList.remove('loading');
            labelGroup.classList.add('success');
            if (el.childElementCount > 0) {
                el.replaceChild(successEl, el.firstElementChild);
            }

            el.appendChild(successEl);
        }
    }

    removeError(elementID: string) {
        if (this.enabledErrors.indexOf(elementID) !== -1) {
            const el = document.getElementById(elementID);
            const labelGroup = el?.parentElement?.parentElement;

            if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
                labelGroup.classList.remove('error');
                el.innerHTML = '';
            }

            delete this.enabledErrors[elementID];
        }
    }

    removeAll(elementID: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            labelGroup.classList.remove('loading');
            labelGroup.classList.remove('success');

            if (this.enabledErrors.indexOf(elementID) !== -1) {
                delete this.enabledErrors[elementID];
                labelGroup.classList.remove('error');
            }

            el.innerHTML = '';
        }
    }
}

export default Form;
