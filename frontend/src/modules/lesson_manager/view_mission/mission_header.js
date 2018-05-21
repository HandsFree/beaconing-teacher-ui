// @flow
import { div, a, i, h1, nav, h2, span } from '../../../core/html';

import { Component } from '../../../core/component';

class MissionHeader extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Mission Header] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
        this.state.mission = this.state.glp.content.missions[this.props.index];
    }

    async render() {
        const glpName = this.state.glp.name ?? 'Unnamed GLP';
        const playUrl = this.state.glp.playUrl ?? `http://gameplots.beaconing.eu/game/?externs=http://core.beaconing.eu/api/gamifiedlessonpaths/${this.state.glp.id}/externconfig`;

        return div(
            '#mission-header',
            div(
                '.breadcrumb',
                a(
                    '.crumb',
                    {
                        href: `//${window.location.host}/lesson_manager`,
                    },
                    span('Library'),
                ),
                a(
                    '.crumb',
                    {
                       href: `//${window.location.host}/lesson_manager#view?id=${this.state.glp.id}`,
                    },
                    span('Plan Overview'),
                ),
                a('.current', 'Mission'),
            ),
            div(
                '.name-group',
                h1(glpName),
                h2(this.state.mission.name),
            ),
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

export default MissionHeader;
