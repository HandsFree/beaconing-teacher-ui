// @flow

import Component from '../../../core/component';
import Header from '../../header/root';
import MainNav from '../../nav/main';
import SecondNav from '../../nav/second';
import InnerNav from './inner_nav';
import BasicSearch from '../../search/basic';
import Sort from '../../sort';
import GLPs from './glps';

class ActivePlans extends Component {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const search = new BasicSearch();
        const sort = new Sort();
        const glps = new GLPs();

        this.prepareRenderState(Promise.all([
            header.render(),
            mainNav.render(),
            secondNav.render('Lesson Manager', innerNav.render()),
            search.render({
                type: 'width-expand',
            }),
            sort.render(),
            glps.render(),
        ]).then((values) => {
            const [
                headerHTML,
                mainNavHTML,
                secondNavHTML,
                searchHTML,
                sortHTML,
                glpsHTML,
            ] = values;

            const renderData = {
                path: 'lesson_manager/root/templates/active_plans',
                locals: {
                    headerHTML,
                    mainNavHTML,
                    secondNavHTML,
                    searchHTML,
                    sortHTML,
                    glpsHTML,
                },
            };

            return this.preparePage(renderData);
        }));
    }
}

export default ActivePlans;
