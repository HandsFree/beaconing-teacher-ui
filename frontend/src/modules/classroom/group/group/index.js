// @flow
import { div, main, strong } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import GroupMain from './group_main';
import GroupAside from './group_aside';

class Group extends RootComponent {
    groupExists = true;
    updateHooks = {
        GroupDeleted: this.handleGroupDelete,
    };

    async init() {
        const id = this.params.id;

        if (!id) {
            console.log('[View Group] No Group ID provided!');
            this.groupExists = false;
            return;
        }

        const group = await window.beaconingAPI.getGroup(id);

        if (!group || Object.keys(group).indexOf('error') !== -1) {
            this.groupExists = false;
            return;
        }
    }

    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const groupMain = new GroupMain();
        const groupAside = new GroupAside();

        const noGroupMsg = await window.bcnI18n.getPhrase('no_group');

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('classroom'),
                innerNav: innerNav.attach(),
            }),
            groupMain.attach(this.params),
            groupAside.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
                groupMainEl,
                groupAsideEl,
            ] = values;

            return this.groupExists ? div(
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
                footerEl,
            ) : div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#group.no-padding',
                        div(
                            '.flex-grow.flex-align-center.flex-justify-center',
                            strong(noGroupMsg),
                        ),
                    ),
                ),
                footerEl,
            );
        });
    }

    async handleGroupDelete() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();

        const groupDelMsg = await window.bcnI18n.getPhrase('group_del');

        const el = await Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('classroom'),
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
                            strong(groupDelMsg),
                        ),
                    ),
                ),
            );
        });

        this.updateView(el);
    }
}

export default Group;
