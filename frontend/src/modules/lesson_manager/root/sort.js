// @flow
import { div, aside, span, a } from '../../../core/html';

import { Component } from '../../../core/component';

class Sort extends Component {
    async render() {
        return aside(
            '.sort.flex-column',
            div(
                '.header',
                span('Sort By:'),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span('STEM Subject'),
                ),
                div(
                    '.content',
                    a('.sort-option', 'Science'),
                    a('.sort-option', 'Technology'),
                    a('.sort-option', 'Engineering'),
                    a('.sort-option', 'Maths'),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span('Recent'),
                ),
                div(
                    '.content',
                    a('.sort-option', 'Ascending'),
                    a('.sort-option.active', 'Descending'),
                ),
            ),
        );
    }
}

export default Sort;
