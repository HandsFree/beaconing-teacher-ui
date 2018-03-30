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
                    console.log(link, xhr.response);
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

    async delete(link: string): Promise<Object> {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';
        xhr.open('DELETE', link);
        xhr.send();

        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    console.log(link, xhr.response);
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
                    console.log(link, xhr.response);
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

    async put(link: string, data: string): Promise<Object> {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';
        xhr.open('PUT', link);
        xhr.send(data);

        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    console.log(link, xhr.response);
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
        const activePlans = await this.get(`//${window.location.host}/widget/active_lesson_plans`);

        return activePlans;
    }

    async getRecentActivitiesWidget() {
        const recent = await this.get(`//${window.location.host}/widget/recent_activities`);

        return recent;
    }

    async getAuthToken() {
        const { token } = await this.get(`//${window.location.host}/auth/check`);

        if (token) {
            return token;
        }

        console.log('[API Core] User not authenticated!');

        return false;
    }

    async getGLPs(sortQuery: string, orderQuery: string, minify: ?boolean) {
        const sort = sortQuery !== 'default' ? `?sort=${sortQuery}` : '';
        const order = orderQuery !== 'default' ? `&order=${orderQuery}` : '';
        const url = minify ? `//${window.location.host}/intent/glps${sort}${order}&minify=1` : `//${window.location.host}/intent/glps${sort}${order}`;
        const glps = await this.get(url);

        return glps;
    }

    async getCurrentUser() {
        const profile = await this.get(`//${window.location.host}/intent/profile`);

        return profile;
    }

    async getGLP(id: number, minify: boolean = false) {
        if (minify) {
            const glp = await this.get(`//${window.location.host}/intent/glp/${id}?minify=1`);

            return glp;
        }

        const glp = await this.get(`//${window.location.host}/intent/glp/${id}`);

        return glp;
    }

    async getStudents() {
        const students = await this.get(`//${window.location.host}/intent/students`);

        return students;
    }

    async getStudent(id: number) {
        const student = await this.get(`//${window.location.host}/intent/student/${id}`);

        return student;
    }

    async getStudentAssigned(id: number) {
        // console.log(id);
        const glps = await this.get(`//${window.location.host}/intent/student/${id}/assignedglps`);

        return glps;
    }

    async getGroupAssigned(id: number) {
        // console.log(id);
        const glps = await this.get(`//${window.location.host}/intent/studentgroup/${id}/assignedglps`);

        return glps;
    }

    async getGroups() {
        const groups = await this.get(`//${window.location.host}/intent/studentgroups`);

        return groups;
    }

    async getGroup(id: number) {
        const group = await this.get(`//${window.location.host}/intent/studentgroup/${id}`);

        return group;
    }

    async assignStudent(studentID: number, glpID: number) {
        const assignStatus = await this.get(`//${window.location.host}/intent/assign/${studentID}/to/${glpID}`);

        return assignStatus.studentId ?? false;
    }

    async assignGroup(groupID: number, glpID: number) {
        const assignStatus = await this.get(`//${window.location.host}/intent/assigngroup/${groupID}/to/${glpID}`);

        return assignStatus.studentGroupId ?? false;
    }

    async unassignStudent(studentID: number, glpID: number) {
        const assignStatus = await this.delete(`//${window.location.host}/intent/student/${studentID}/assignedglps/${glpID}`);

        return assignStatus.success === true;
    }

    async unassignGroup(groupID: number, glpID: number) {
        const assignStatus = await this.delete(`//${window.location.host}/intent/studentgroup/${groupID}/assignedglps/${glpID}`);

        return assignStatus.success === true;
    }

    async unassignStudentFromGroup(studentID: number, groupID: number) {
        const group = await this.getGroup(groupID);

        const { students } = group;

        const newStudents = students.filter((studentObj) => {
            if (studentID === studentObj.id) {
                return false;
            }

            return true;
        });

        group.students = newStudents;

        const status = await this.updateGroup(groupID, group);

        return status;
    }

    async addGroup(data: { [string]: string | Object }) {
        const groupJSON = JSON.stringify({
            id: 0,
            ...data,
        });

        let groupStatus = false;

        const group = await this.post(`//${window.location.host}/intent/studentgroup`, groupJSON);

        if (typeof group === 'object' && group.id) {
            groupStatus = true;
        }

        return groupStatus;
    }

    async updateGroup(groupID: number, data: { [string]: string | Object }) {
        const groupJSON = JSON.stringify(data);

        let groupStatus = false;

        const group = await this.put(`//${window.location.host}/intent/studentgroup/${groupID}`, groupJSON);

        if (typeof group === 'object' && group.success) {
            groupStatus = true;
        }

        return groupStatus;
    }

    async deleteGroup(groupID: number) {
        let groupStatus = false;

        const group = await this.delete(`//${window.location.host}/intent/studentgroup/${groupID}`);

        if (typeof group === 'object' && group.success) {
            groupStatus = true;
        }

        return groupStatus;
    }

    async addStudent(data: { [string]: string | Object }) {
        const studentJSON = JSON.stringify({
            id: 0,
            ...data,
        });

        let studentStatus = false;

        const student = await this.post(`//${window.location.host}/intent/student`, studentJSON);

        // console.log(student);

        if (typeof student === 'object' && student.id) {
            studentStatus = true;
        }

        return studentStatus;
    }

    async updateStudent(studentID: number, data: { [string]: string | Object }) {
        const studentJSON = JSON.stringify({
            id: studentID,
            ...data,
        });

        let studentStatus = false;

        const student = await this.put(`//${window.location.host}/intent/student/${studentID}`, studentJSON);

        // console.log(student);

        if (typeof student === 'object' && student.success) {
            studentStatus = true;
        }

        return studentStatus;
    }

    async deleteStudent(studentID: number) {
        let studentStatus = false;

        const student = await this.delete(`//${window.location.host}/intent/student/${studentID}`);

        // console.log(student);

        if (typeof student === 'object' && student.success) {
            studentStatus = true;
        }

        return studentStatus;
    }

    async getSearchResults(query: string) {
        const searchJSON = JSON.stringify({
            Query: query,
        });

        const results = await this.post(`//${window.location.host}/intent/search`, searchJSON);

        console.log(results);

        return results;
    }

    async addGLP(data: { [string]: string }) {
        const glpJSON = JSON.stringify(data);

        let glpStatus = false;

        const glp = await this.post(`//${window.location.host}/intent/glp`, glpJSON);

        console.log(glp);

        if (glp.name === data.name) {
            glpStatus = true;
        }

        return glpStatus;
    }
}

export default APICore;
