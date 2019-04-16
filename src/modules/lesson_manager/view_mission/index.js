// @flow
import { div, main } from '../../../core/html';

import { RootComponent } from '../../../core/component';
import Header from '../../header/root';
import Footer from '../../footer/root';
import MainNav from '../../nav/main';
import SecondNav from '../../nav/second';
import InnerNav from '../inner_nav';
import MissionOverview from './mission_overview';

class ViewMission extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const missionOverview = new MissionOverview();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.beaconingAPI.getPhrase('lm'),
                innerNav: innerNav.attach(),
            }),
            missionOverview.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
                missionOverviewEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#view-mission',
                        missionOverviewEl,
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default ViewMission;
