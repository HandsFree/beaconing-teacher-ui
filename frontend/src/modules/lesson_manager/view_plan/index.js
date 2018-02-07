// @flow
import { div, main } from '../../../core/html';

import { RootComponent } from '../../../core/component';
import Header from '../../header/root';
import MainNav from '../../nav/main';
import SecondNav from '../../nav/second';
import InnerNav from '../inner_nav';
import PlanOverview from './plan_overview';

class ViewPlan extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const planOverview = new PlanOverview();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: 'Lesson Manager',
                innerNav: innerNav.attach(),
            }),
            planOverview.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                secondNavEl,
                planOverviewEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#view-plan',
                        planOverviewEl,
                    ),
                ),
            );
        });
    }
}

export default ViewPlan;
