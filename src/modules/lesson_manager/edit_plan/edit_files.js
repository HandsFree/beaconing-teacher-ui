import { h2, h3, a, div, section, input, p, i } from '../../../core/html';
import { Component } from "../../../core/component";
import tippy from 'tippy.js';

class FileBox extends Component {
    tooltipsActive = false;

    constructor() {
        super();
        this.deleteGLPFile = this.deleteGLPFile.bind(this);
        this.downloadGLPFile = this.downloadGLPFile.bind(this);
    }

    async deleteGLPFile(glpId, resourceId) {
        if (!confirm('are you sure you want to delete this file?')) {
            return;
        }

        const resp = await window.beaconingAPI.deleteLinkedResource(glpId, resourceId);
        // TODO check the resp
        console.log(resp);
        this.emit('refreshEditFiles');
    }

    async downloadGLPFile(resourceId) {
        const resp = await window.beaconingAPI.getResourceContent(resourceId);
        console.log('download content is', resp);
    }

    async render() {
        const { glpId, loadedResource } = this.props;
        const { fileName, contentType, id } = loadedResource;

        // hack! fixme.
        const fileType = contentType.split("/")[1];

        // TODO show when the resource was created, etc.

        const smallest = Math.min(18, fileName.length);
        let shortenedFileName = fileName.slice(0, smallest);
        if (smallest != fileName.length) {
            shortenedFileName += '...';
        }

        return div(
            '.file-box',
            h2(
                a(`.fake-link.underline.file-name#glp-${id}`, 
                    {
                        // FIXME this link is hardcoded.
                        href: `https://core.beaconing.eu/api/resources/${id}/content`,
                        download: fileName,
                        onmouseover: () => {
                            if (!this.tooltipsActive) {
                                tippy(`#glp-${id}`, {
                                    content: fileName,
                                    arrow: true,
                                });
                                this.tooltipsActive = true;
                            }
                        },
                    },
                    shortenedFileName
                ),
            ),

            h3('.file-type', fileType),
            
            p('.file-delete',
                a(
                    '.fake-link',
                    {
                        onclick: async () => {
                            await this.deleteGLPFile(glpId, id);
                        },
                        onmouseover: () => {
                            if (!this.tooltipsActive) {
                                tippy('.file-delete', {
                                    content: '###Delete resource',
                                    arrow: true,
                                });
                                this.tooltipsActive = true;
                            }
                        }
                    },
                    i('.icon-trash-empty')
                ),
            ),
        );
    }
}

class EditGLPFiles extends Component {
    state = {};
    updateHooks = {
        refreshEditFiles: this.refreshEditFiles,
    }

    constructor() {
        super();
        this.uploadGLPFile = this.uploadGLPFile.bind(this);
    }

    async refreshEditFiles() {
        this.updateView(await this.render());
    }

    async uploadGLPFile(file) {
        const glpID = this.props.id;

        console.log('le file est', file);

        const resource = await window.beaconingAPI.createResourceHandle('', '', file, false);
        console.log('resp was', resource);

        if (resource.id) {
            // step 2. set the content
            const resp = await window.beaconingAPI.setResourceContent(resource.id, file);
            console.log('set content: ', resp);

            // step 3. link to the current GLP.
            const linkResp = await window.beaconingAPI.glpLinkResource(glpID, resource.id);
            console.log('linked resp is', linkResp);
        }

        // re-render the page with the new files.
        this.updateView(await this.render());
    }

    async render() {
        const { id } = this.props;
        this.state.glpId = id;

        let resources = await window.beaconingAPI.getGLPFiles(id);

        let fileProm = [];
        for (const resource of resources) {
            const loadedResource = await window.beaconingAPI.getResource(resource.resourceId);
            if (loadedResource) {
                fileProm.push(new FileBox().attach({
                    glpId: id,
                    loadedResource
                }));
            }
        }

        // TODO style this so it's filled grey
        // and the plus button is (bigger?) green.
        const addFileButton = a(
            '.fake-link',
            {
                onclick: () => {
                    const loadFile = document.querySelector('#file-input');
                    loadFile.click();
                },
            },
            div(
                '.file-box',
                h2(
                    '.file-name', 
                    '+',
                ),

                input(
                    '#file-input',
                    {
                        type: 'file',
                        onchange: async (e) => {
                            const file = e.target.files[0];
                            // clear the file immediately so
                            // that we don't resend it.
                            e.target.value = null;
                            if (file) {
                                await this.uploadGLPFile(file);
                            }
                        },
                    }
                )
            )
        );

        const filesEl = await Promise.all(fileProm).then((el) => el);

        return div(
            '.flex-column',
            div(
                '.flex-column',
                section(
                    '#glp-files-container',
                    addFileButton,
                    filesEl,
                )
            )
        );
    }
}

export default EditGLPFiles;