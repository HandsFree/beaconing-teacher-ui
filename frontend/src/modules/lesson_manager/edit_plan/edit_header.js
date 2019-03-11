// @flow
import tippy from 'tippy.js';

import {
    div,
    h1,
    a,
    span,
    button,
    nav,
} from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';

class EditHeader extends Component {
    tooltipsActive = false;

    async deleteGLP() {
        const status = await window.beaconingAPI.deleteGLP(this.props.id);
        const statusMessage = new Status();

        console.log('[Delete GLP] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.beaconingAPI.getPhrase('sc_glp_del'),
            });

            document.body.appendChild(statusMessageEl);

            this.emit('GLPDeleted');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.beaconingAPI.getPhrase('err_glp_nd'),
        });

        document.body.appendChild(statusMessageEl);
    }

    async render() {
        const {
            glp,
            id,
            currentUser,
        } = this.props;

        let fromLibrary = true;

        if (window.sessionStorage && window.sessionStorage.getItem('edit_glp_from')) {
            const { editFrom } = JSON.parse(window.sessionStorage.getItem('edit_glp_from'));

            fromLibrary = editFrom === 'library' || false;
        }

        const breadcrumb = do {
            if (fromLibrary) {
                div(
                    '.breadcrumb',
                    a(
                        '.crumb',
                        {
                            href: `//${window.location.host}/lesson_manager`,
                        },
                        span(await window.beaconingAPI.getPhrase('lm_library')),
                    ),
                    a('.current', await window.beaconingAPI.getPhrase('pc_edit_glp')),
                );
            } else {
                div(
                    '.breadcrumb',
                    a(
                        '.crumb',
                        {
                            href: `//${window.location.host}/lesson_manager`,
                        },
                        span(await window.beaconingAPI.getPhrase('lm_library')),
                    ),
                    a(
                        '.crumb',
                        {
                            href: `//${window.location.host}/lesson_manager#view?id=${id}`,
                        },
                        span(await window.beaconingAPI.getPhrase('lm_plan_overview')),
                    ),
                    a('.current', await window.beaconingAPI.getPhrase('pc_edit_glp')),
                );
            }
        };

        return div(
            '#edit-plan-header.flex-column',
            breadcrumb,
            div(
                '.flex-align-center.flex-spacebetween',
                h1(glp.name),
                div(
                    '#edit-plan-header-menu',
                    a(
                        {
                            href: `//${window.location.host}/authoring_tool?id=${encodeURIComponent(glp.id)}`,
                        },
                        button('.action', await window.beaconingAPI.getPhrase('open_in_at')),
                    ),
                    currentUser === glp.owner ? button(
                        '.delete',
                        {
                            onclick: async () => {
                                const confirmDelGLPTranslation = await window.beaconingAPI.getPhrase('con_delete_glp');

                                const doDelete = confirm(confirmDelGLPTranslation);
                                if (doDelete) {
                                    this.deleteGLP();
                                }
                            },
                        },
                        await window.beaconingAPI.getPhrase('delete'),
                    ) : [],
                ),
            ),
            nav(
                '#edit-plan-header-tabs',
                div(
                    '.tab-container',
                    {
                        onmouseover: () => {
                            if (!this.tooltipsActive) {
                                tippy('.disabled-tab', {
                                    content: 'Disabled',
                                    arrow: true,
                                });

                                this.tooltipsActive = true;
                            }
                        },
                    },
                    a('.tab.active', await window.beaconingAPI.getPhrase('lm_details')),
                    a('.tab.disabled-tab', await window.beaconingAPI.getPhrase('lm_assignees')),
                    a('.tab.disabled-tab', await window.beaconingAPI.getPhrase('lm_files')),
                ),
            ),
        );
    }
}

export default EditHeader;
