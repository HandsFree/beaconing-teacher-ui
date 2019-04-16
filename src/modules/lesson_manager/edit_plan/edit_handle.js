// @flow
import { section, div } from '../../../core/html';

import { Component } from '../../../core/component';
import Loading from '../../loading';
import nullishCheck from '../../../core/util';
import EditHeader from './edit_header';
import EditGLPForm from './edit_form';

class LoadEdit extends Component {
    glp = {};

    currentUser = {};

    updateHooks = {
        GLPDeleted: this.handleGLPDelete,
    };

    async init() {
        const { id } = this.props;

        if (!nullishCheck(id, false)) {
            throw new Error('[LoadEdit] No glp id provided!');
        }

        const glp = await window.beaconingAPI.getGLP(id, true);
        const currentUser = await window.beaconingAPI.getCurrentUser();

        if (glp && currentUser) {
            this.glp = glp;
            this.currentUser = currentUser;

            return;
        }

        throw new Error('[LoadEdit] No glp or user returned from API');
    }

    handleGLPDelete() {
        window.location.href = `//${window.location.host}/lesson_manager`;
    }

    async render() {
        const { id } = this.props;

        const editHeaderEl = await new EditHeader().attach({
            id,
            glp: this.glp,
            currentUser: this.currentUser.username,
        });

        const editFormEl = await new EditGLPForm().attach({
            id,
            glp: this.glp,
        });

        return div(
            '.flex-column',
            editHeaderEl,
            editFormEl,
        );
    }
}

class EditHandle extends Component {
    async init() {
        const { id } = this.props;

        if (!nullishCheck(id, false)) {
            throw new Error('[Edit Handle] no plan id provided');
        }
    }

    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            div(loadingEl),
        );
    }

    async afterMount() {
        const loadEditEl = await new LoadEdit().attach(this.props);

        this.updateView(loadEditEl);
    }
}

export default EditHandle;
