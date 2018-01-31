// @flow
import { iframe } from '../../../../core/html';

import { Component } from '../../../../core/component';

class IFrame extends Component {
    async render(params: { [string]: string }) {
        return iframe(
            '#authoring-tool',
            {
                src: `https://authoring.beaconing.eu/glp/${decodeURIComponent(params.id)}`,
            },
        );
    }
}

export default IFrame;
