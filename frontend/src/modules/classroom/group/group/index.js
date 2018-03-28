// @flow
import { div, main, strong } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import GroupMain from './group_main';
import GroupAside from './group_aside';

class Group extends RootComponent {
    updateHooks = {
        GroupDeleted: this.handleGroupDelete,
    };

    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const groupMain = new GroupMain();
        const groupAside = new GroupAside();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Classroom',
                innerNav: innerNav.attach(),
            }),
            groupMain.attach(this.params),
            groupAside.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                groupMainEl,
                groupAsideEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#group.no-padding',
                        div(
                            '.flex-spacebetween.flex-align-stretch.flex-grow',
                            groupMainEl,
                            groupAsideEl,
                        ),
                    ),
                ),
            );
        });
    }

    async handleGroupDelete() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();

        const el = await Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Classroom',
                innerNav: innerNav.attach(),
            }),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#group.no-padding',
                        div(
                            '.flex-justify-center.flex-align-center.flex-grow',
                            strong('Group Deleted!'),
                        ),
                    ),
                ),
            );
        });

        this.updateView(el);
    }
}

export default Group;
