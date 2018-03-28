// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import BasicSearch from '../../../search/basic';
import GroupsContainer from './groups_container';
import CreateGroupButton from './create_group_button';

class Groups extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new BasicSearch();
        const groups = new GroupsContainer();
        const createGroupButton = new CreateGroupButton();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Classroom',
                innerNav: innerNav.attach(),
            }),
            search.attach({
                searchType: 'width-expand',
            }),
            groups.attach(),
            createGroupButton.attach(),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                searchEl,
                groupsEL,
                createGroupButtonEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#groups',
                        section(
                            createGroupButtonEl,
                            searchEl,
                        ),
                        groupsEL,
                    ),
                ),
            );
        });
    }
}

export default Groups;
