// @flow
import { iframe } from '../../../../core/html';

import { Component } from '../../../../core/component';

class IFrame extends Component {
    async render() {
        return iframe(
            '#authoring-tool',
            {
                src: `https://authoring.beaconing.eu/glp/${decodeURIComponent(this.props.id)}`,
            },
        );
    }
}

export default IFrame;
