// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import APISearch from '../../../search/api';
import Sort from './sort';
import GLPHandle from './glp_handle';

class Library extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new APISearch();
        const sort = new Sort();
        const glpHandle = new GLPHandle();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('lm'),
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
                footerEl,
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
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#new-plans',
                        section(
                            searchEl,
                        ),
                        section(
                            '.flex-spacebetween',
                            glpHandleEl,
                            sortEl,
                        ),
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default Library;
