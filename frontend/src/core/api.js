// @flow

class APICore {
    constructor() {
        console.log('[API Core] Loaded!');
    }

    async get(link: string): Promise<Object> {
        const xhr = new XMLHttpRequest();

        console.log("api_get_req : " + link);

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

    async post(link: string, data: string): Promise<Object> {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';
        xhr.open('POST', link);
        xhr.send(data);

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

    async getActivePlansWidget() {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const activePlans = await this.get(`//${window.location.host}/widget/active_lesson_plans`);
        return activePlans;
    }
    async getActivePlans() {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const activePlans = await this.get(`//${window.location.host}/intent/active_lesson_plans`);
        return activePlans;
    }

    async checkAuth() {
        const { token } = await this.get(`//${window.location.host}/auth/check`);

        // needs more verification
        if (token) {
            return true;
        }

        console.log('[API Core] User not authenticated!');

        return false;
    }

    async getGLPs() {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const glps = await this.get(`//${window.location.host}/intent/glps`);
        return glps;
    }

    async getCurrentUser() {
        const auth = await this.checkAuth();
        if (!auth) {
            return false;
        }
        const profile = await this.get(`//${window.location.host}/intent/profile`);
        return profile;
    }

    async getGLP(id: number) {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const glp = await this.get(`//${window.location.host}/intent/glp/${id}`);
        return glp;
    }

    async getStudents() {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const students = await this.get(`//${window.location.host}/intent/students`);
        return students;
    }

    async getGroups() {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const groups = await this.get(`//${window.location.host}/intent/studentgroups`);
        return groups;
    }

    async assignStudent(studentID: number, glpID: number) {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const assignStatus = await this.get(`//${window.location.host}/intent/assign/${studentID}/to/${glpID}`);

        return assignStatus.studentId || false;
    }

    async addGroup(name: string) {
        const groupJSON = JSON.stringify({
            id: 0,
            name,
        });

        const groupStatus = await this.post(`//${window.location.host}/intent/studentgroups`, groupJSON);

        return groupStatus;
    }

    async getSearchResults(query: string) {
        const auth = await this.checkAuth();

        if (!auth) {
            return false;
        }

        const searchJSON = JSON.stringify({
            Query: query,
        });

        const results = await this.post(`//${window.location.host}/intent/search`, searchJSON);

        return results;
    }
}

export default APICore;
