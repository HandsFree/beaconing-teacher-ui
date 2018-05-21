// @flow
import { div, a, i, h1, nav, span } from '../../../core/html';

import { Component } from '../../../core/component';

class PlanHeader extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Plan Header] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
    }

    async render() {
        const glpName = this.state.glp.name ?? 'Unnamed GLP';
        const playUrl = this.state.glp.playUrl ?? `http://gameplots.beaconing.eu/game/?externs=http://core.beaconing.eu/api/gamifiedlessonpaths/${this.state.glp.id}/externconfig`;

        return div(
            '#plan-header',
            div(
                '.breadcrumb',
                a(
                    '.crumb',
                    {
                        href: `//${window.location.host}/lesson_manager`,
                    },
                    span('Library'),
                ),
                a('.current', 'Plan Overview'),
            ),
            h1(glpName),
            nav(
                '.mini',
                a(
                    {
                        href: playUrl,
                        target: '_blank',
                    },
                    'Play',
                ),
                a(
                    {
                        href: `#assign?id=${this.state.glp.id}`,
                    },
                    'Assign',
                ),
            ),
        );
    }
}

export default PlanHeader;
