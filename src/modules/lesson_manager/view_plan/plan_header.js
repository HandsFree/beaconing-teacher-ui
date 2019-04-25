// @flow
import { div, a, h1, h2, nav, button, span } from '../../../core/html';

import { Component } from '../../../core/component';
import nullishCheck from '../../../core/util';

class PlanHeader extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Plan Header] GLP ID not provided');
        }

        this.state.trans = await window.beaconingAPI.getPhrases(
            'lm_unnamed_glp',
            'edit',
            'lm_library',
            'lm_plan_overview',
            'lm_play',
            'lm_assign',  
        );

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        if (sessionGLP) {
            this.state.glp = sessionGLP.glp;
        }
    }

    async render() {
        const glpName = nullishCheck(this.state.glp?.name, this.state.trans.get('lm_unnamed_glp'));
        const playUrl = nullishCheck(this.state.glp?.playUrl, `http://gameplots.beaconing.eu/game/?externs=http://core.beaconing.eu/api/gamifiedlessonpaths/${this.state.glp.id}/externconfig`);

        const readOnly = this.state.glp?.readOnly;
        
        const editButton = a(
            {
                href: `#edit?id=${encodeURIComponent(this.state.glp.id)}`,
            },
            button('.action', this.state.trans.get('edit')),
        );

        return div(
            '#plan-header',
            div(
                '.breadcrumb',
                a(
                    '.crumb',
                    {
                        href: `//${window.location.host}/lesson_manager`,
                    },
                    span(this.state.trans.get('lm_library')),
                ),
                a('.current', this.state.trans.get('lm_plan_overview')),
            ),
            div(
                '.titlebar',
                h1(glpName),
                nav(
                    '.mini',
                    a(
                        {
                            href: playUrl,
                            target: '_blank',
                        },
                        button('.action', this.state.trans.get('lm_play')),
                    ),
                    a(
                        {
                            href: `#assign?id=${this.state.glp.id}`,
                        },
                        button('.action', this.state.trans.get('lm_assign')),
                    ),
                    readOnly ? [] : editButton,
                ),
            ),
        );
    }
}

export default PlanHeader;
