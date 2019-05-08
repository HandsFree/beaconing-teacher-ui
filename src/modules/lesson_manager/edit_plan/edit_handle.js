// @flow
import { section, div } from '../../../core/html';

import { Component } from '../../../core/component';
import Loading from '../../loading';
import nullishCheck from '../../../core/util';
import EditHeader from './edit_header';
import EditGLPForm from './edit_form';
import EditGLPAssignees from './edit_assignees';
import EditGLPFiles from './edit_files';

class LoadEdit extends Component {
    glp = {};

    state = {
        selected: 'details',
    };

    currentUser = {};

    updateHooks = {
        GLPDeleted: this.handleGLPDelete,
        EditGLP_Details: this.editDetails,
        EditGLP_Files: this.editFiles,
        EditGLP_Assignee: this.editAssignee,
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

    async editDetails() {
        this.state.selected = 'details';
        this.updateView(await this.render());
    }

    async editFiles() {
        this.state.selected = 'files';
        this.updateView(await this.render());
    }

    async editAssignee() {
        this.state.selected = 'assignee';
        this.updateView(await this.render());
    }

    async render() {
        const { id } = this.props;

        const editHeaderEl = await new EditHeader().attach({
            id,
            glp: this.glp,
            currentUser: this.currentUser.username,
            selectedTab: this.state.selected,
        });

        const currentView = async () => {
            const { selected } = this.state;
            if (!selected) {
                return [];
            }

            switch (selected) {
            case 'details':
                const editFormEl = await new EditGLPForm().attach({
                    id,
                    glp: this.glp,
                });
                return editFormEl;
            case 'files':
                const editFilesEl = await new EditGLPFiles().attach({
                    id,
                    glp: this.glp,
                });
                return editFilesEl;
            case 'assignee':
                const editAssignEl = await new EditGLPAssignees().attach({
                    id,
                    glp: this.glp,
                });
                return editAssignEl;
            }

            return div(selected);
        };

        const currViewEl = await currentView();
        return div(
            '.flex-column',
            editHeaderEl,
            currViewEl,
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
