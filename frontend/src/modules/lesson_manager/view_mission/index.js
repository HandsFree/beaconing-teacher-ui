// @flow
import { div, main } from '../../../core/html';

import { RootComponent } from '../../../core/component';
import Header from '../../header/root';
import MainNav from '../../nav/main';
import SecondNav from '../../nav/second';
import InnerNav from '../inner_nav';
import MissionOverview from './mission_overview';

class ViewMission extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const missionOverview = new MissionOverview();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Lesson Manager',
                innerNav: innerNav.attach(),
            }),
            missionOverview.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                missionOverviewEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#view-mission',
                        missionOverviewEl,
                    ),
                ),
            );
        });
    }
}

export default ViewMission;