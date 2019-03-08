// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import APISearch from '../../../search/api';
import GroupsContainer from './groups_container';
import CreateGroupButton from './create_group_button';

class Groups extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new APISearch();
        const groups = new GroupsContainer();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('cr'),
                innerNav: innerNav.attach(),
            }),
            search.attach({
                searchType: 'width-expand',
                filterOptions: {
                    filter: 'group',
                    sort: {},
                },
            }),
            groups.attach(),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
                searchEl,
                groupsEL,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#groups',
                        section(
                            searchEl,
                        ),
                        groupsEL,
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default Groups;
