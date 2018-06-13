// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

class StudentSelector extends Component {
    async render() {
        return p("no group selected!");
    }
}

class StudentGroupSelector extends Component {
    async render() {
        return div(h1("hello world!"));
    }
}

export default StudentSelector;