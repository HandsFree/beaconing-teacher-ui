// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import BasicSearch from '../../../search/basic';
import Sort from './sort';
import ActiveGLPs from './active_glps';

class ActivePlans extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new BasicSearch();
        const sort = new Sort();
        const activeGLPs = new ActiveGLPs();

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
            activeGLPs.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                searchEl,
                sortEl,
                activeGLPsEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#active-glps',
                        section('.flex-column', searchEl),
                        section(
                            '.flex-spacebetween',
                            activeGLPsEl,
                            sortEl,
                        ),
                    ),
                ),
            );
        });
    }
}

export default ActivePlans;
