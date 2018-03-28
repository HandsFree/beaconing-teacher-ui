// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import BasicSearch from '../../../search/basic';
import Sort from './sort';
import GLPHandle from './glp_handle';

class Library extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new BasicSearch();
        const sort = new Sort();
        const glpHandle = new GLPHandle();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Lesson Manager',
                innerNav: innerNav.attach(),
            }),
            search.attach({
                searchType: 'width-expand',
            }),
            sort.attach(),
            glpHandle.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                searchEl,
                sortEl,
                glpHandleEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#new-plans',
                        section('.flex-column', searchEl),
                        section(
                            '.flex-spacebetween',
                            glpHandleEl,
                            sortEl,
                        ),
                    ),
                ),
            );
        });
    }
}

export default Library;
