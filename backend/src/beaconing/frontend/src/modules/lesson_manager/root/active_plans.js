// @flow

import Component from '../../../core/component';
import Header from '../../header/root';
import MainNav from '../../nav/main';
import SecondNav from '../../nav/second';
import InnerNav from './inner_nav';
import BasicSearch from '../../search/basic';

class ActivePlans extends Component {
    async render(): Promise<string> {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new BasicSearch();

        return Promise.all([
            header.render(),
            mainNav.render(),
            secondNav.render('Lesson Manager', innerNav.render()),
            search.render({
                type: 'width-expand',
            }),
        ]).then((values) => {
            const [
                headerHTML,
                mainNavHTML,
                secondNavHTML,
                searchHTML,
            ] = values;

            return this.preparePage('lesson_manager/root/templates/active_plans', {
                headerHTML,
                mainNavHTML,
                secondNavHTML,
                searchHTML,
            });
        });
    }
}

export default ActivePlans;
