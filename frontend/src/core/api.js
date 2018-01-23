// @flow

class APICore {
    constructor() {
        console.log('[API Core] Loaded!');
    }

    async get(link: string): Promise<Object> {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';
        xhr.open('GET', link);
        xhr.send();

        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            };

            xhr.onerror = () => {
                const msg: string = `[API Core] Error: ${xhr.status}: ${xhr.statusText}`;

                if (window.rollbar) {
                    window.rollbar.error(msg);
                }

                reject(msg);
            };
        });
    }

    async checkAuth() {
        const { status } = await this.get('./auth/check');

        return status;
    }

    async getGLPs() {
        const auth = await this.checkAuth();

        if (auth) {
            const glps = await this.get('./intent/glps');
            return glps;
        }

        return false;
    }

    async getStudents() {
        const auth = await this.checkAuth();

        if (auth) {
            const students = await this.get('./intent/students');
            return students;
        }

        return false;
    }
}

export default APICore;
