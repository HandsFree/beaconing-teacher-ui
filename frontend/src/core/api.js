// @flow
import nullishCheck from './util';

class APICore {
    reqBase = {
        mode: 'same-origin',
        redirect: 'follow',
        credentials: 'include',
    };

    constructor() {
        console.log('[API Core] Loaded!');
    }

    async doRequest(link: string, req: Object) {
        return fetch(link, req).catch((err) => {
            console.log('[API Core] Error: ', err);
        });
    }

    async handleRequest(link: string, req: Object) {
        const res = await this.doRequest(link, req);

        const jsonObj = res.json();

        console.log(link, jsonObj);

        return jsonObj;
    }

    async get(link: string): Promise<Object> {
        const req = {
            method: 'GET',
            ...this.reqBase,
        };

        return this.handleRequest(link, req);
    }

    async getWithAuth(link: string, token: string): Promise<Object> {
        const req = {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                Authorization: `Bearer ${token}`,
            }),
        };

        return this.handleRequest(link, req);
    }

    async delete(link: string): Promise<Object> {
        const req = {
            method: 'DELETE',
            ...this.reqBase,
        };

        return this.handleRequest(link, req);
    }

    async postCORS(link: string, data: string): Promise<Object> {
        const req = {
            body: data,
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        };

        return this.handleRequest(link, req);
    }

    async post(link: string, data: string): Promise<Object> {
        const req = {
            body: data,
            method: 'POST',
            ...this.reqBase,
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        };

        return this.handleRequest(link, req);
    }

    async put(link: string, data: string): Promise<Object> {
        const req = {
            body: data,
            method: 'PUT',
            ...this.reqBase,
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        };

        return this.handleRequest(link, req);
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
        const { token } = await this.get(`//${window.location.host}/api/v1/auth/gettoken`);

        if (token) {
            return token;
        }

        console.log('[API Core] User not authenticated!');

        return false;
    }

    async getGLPs(sortQuery: string, orderQuery: string, minify: ?boolean, indexNumber: ?number, stepNumber: ?number) {        
        // FIXME this is sloppy
        // too many ternary operators! kind of hard to read.

        const sort = sortQuery !== 'default' ? `?sort=${sortQuery}` : '';
        const order = orderQuery !== 'default' ? `&order=${orderQuery}` : '';

        const index = indexNumber >= 0 ? `&index=${indexNumber}` : '';
        const step = stepNumber && stepNumber > 0 ? `&step=${stepNumber}` : '';

        const minifyFlag = minify ? '1' : '0';
        const url = `//${window.location.host}/api/v1/glps${sort}${order}${index}${step}&minify=${minifyFlag}`;

        const glps = await this.get(url);
        return glps;
    }

    async getCurrentUser() {
        const profile = await this.get(`//${window.location.host}/api/v1/profile`);

        return profile;
    }

    async editUser(data: { [string]: string | Object }) {
        let editStatus = false;

        const editJSON = JSON.stringify(data);

        const status = await this.put(`//${window.location.host}/api/v1/profile`, editJSON);

        // console.log(student);

        if (typeof status === 'object' && status.success) {
            editStatus = true;
        }

        return editStatus;
    }

    async getGLP(id: number, minify: boolean = false) {
        if (minify) {
            const glp = await this.get(`//${window.location.host}/api/v1/glp/${id}?minify=1`);

            return glp;
        }

        const glp = await this.get(`//${window.location.host}/api/v1/glp/${id}`);

        return glp;
    }

    async deleteGLP(id: number) {
        let glpStatus = false;
        const msg = await this.delete(`//${window.location.host}/api/v1/glp/${id}`);

        if (typeof msg === 'object' && msg.success) {
            glpStatus = true;
        }

        return glpStatus;
    }

    async updateGLP(glpID: number, data: { [string]: string | Object }) {
        const glpJSON = JSON.stringify(data);

        let glpStatus = false;

        const glp = await this.put(`//${window.location.host}/api/v1/glp/${glpID}`, glpJSON);

        console.log(glp);

        if (typeof glp === 'object' && glp.success) {
            glpStatus = true;
        }

        return glpStatus;
    }

    async getStudents() {
        const students = await this.get(`//${window.location.host}/api/v1/students`);

        return students;
    }

    async getStudent(id: number) {
        const student = await this.get(`//${window.location.host}/api/v1/student/${id}`);

        return student;
    }

    async getStudentAssigned(id: number) {
        // console.log(id);
        const glps = await this.get(`//${window.location.host}/api/v1/student/${id}/assignedglps`);

        return glps;
    }

    async getGroupAssigned(id: number) {
        // console.log(id);
        const glps = await this.get(`//${window.location.host}/api/v1/studentgroup/${id}/assignedglps`);

        return glps;
    }

    async getGroups() {
        const groups = await this.get(`//${window.location.host}/api/v1/studentgroups`);

        return groups;
    }

    async getGroup(id: number) {
        const group = await this.get(`//${window.location.host}/api/v1/studentgroup/${id}`);

        return group;
    }

    async assignStudent(studentID: number, glpID: number) {
        const assignStatus = await this.get(`//${window.location.host}/api/v1/assign/${studentID}/to/${glpID}`);

        return nullishCheck(assignStatus?.studentId, false);
    }

    async assignGroup(groupID: number, glpID: number) {
        const assignStatus = await this.get(`//${window.location.host}/api/v1/assigngroup/${groupID}/to/${glpID}`);

        return nullishCheck(assignStatus?.studentGroupId, false);
    }

    async unassignStudent(studentID: number, glpID: number) {
        const assignStatus = await this.delete(`//${window.location.host}/api/v1/student/${studentID}/assignedglps/${glpID}`);

        return assignStatus.success === true;
    }

    async unassignGroup(groupID: number, glpID: number) {
        const assignStatus = await this.delete(`//${window.location.host}/api/v1/studentgroup/${groupID}/assignedglps/${glpID}`);

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

        const group = await this.post(`//${window.location.host}/api/v1/studentgroup`, groupJSON);

        if (typeof group === 'object' && group.id) {
            groupStatus = group;
        }

        return groupStatus;
    }

    async updateGroup(groupID: number, data: { [string]: string | Object }) {
        const groupJSON = JSON.stringify(data);

        let groupStatus = false;

        const group = await this.put(`//${window.location.host}/api/v1/studentgroup/${groupID}`, groupJSON);

        if (typeof group === 'object' && group.success) {
            groupStatus = true;
        }

        return groupStatus;
    }

    async deleteGroup(groupID: number) {
        let groupStatus = false;

        const group = await this.delete(`//${window.location.host}/api/v1/studentgroup/${groupID}`);

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

        const student = await this.post(`//${window.location.host}/api/v1/student`, studentJSON);

        // console.log(student);

        if (typeof student === 'object' && student.id) {
            studentStatus = student;
        }

        return studentStatus;
    }

    async updateStudent(studentID: number, data: { [string]: string | Object }) {
        const studentJSON = JSON.stringify({
            id: studentID,
            ...data,
        });

        let studentStatus = false;

        const student = await this.put(`//${window.location.host}/api/v1/student/${studentID}`, studentJSON);

        // console.log(student);

        if (typeof student === 'object' && student.success) {
            studentStatus = true;
        }

        return studentStatus;
    }

    async deleteStudent(studentID: number) {
        let studentStatus = false;

        const student = await this.delete(`//${window.location.host}/api/v1/student/${studentID}`);

        // console.log(student);

        if (typeof student === 'object' && student.success) {
            studentStatus = true;
        }

        return studentStatus;
    }

    async getSearchResults(queryObj: Object) {
        const searchJSON = JSON.stringify(queryObj);

        const results = await this.post(`//${window.location.host}/api/v1/search`, searchJSON);

        // console.log(results);

        return results;
    }

    async addGLP(data: { [string]: string }) {
        const glpJSON = JSON.stringify(data);

        let glpStatus = false;

        const glp = await this.post(`//${window.location.host}/api/v1/glp`, glpJSON);

        console.log('[API Core] addGLP result: ', glp);

        if (glp.name === data.name) {
            glpStatus = glp;
        }

        return glpStatus;
    }

    async getAnalyticsToken() {
        const token = await this.getAuthToken();

        // console.log(token);

        if (token) {
            const postJSON = JSON.stringify({
                accessToken: token,
            });

            const analyticsToken = await this.postCORS('https://analytics.beaconing.eu/api/login/beaconing', postJSON);

            return nullishCheck(analyticsToken?.user?.token, false);
        }

        return false;
    }

    async getStudentAnalytics(studentID: number) {
        const token = await this.getAnalyticsToken();

        // console.log(token);

        if (token) {
            const studentData = await this.getWithAuth(`https://analytics.beaconing.eu/api/proxy/gleaner/data/overall/${studentID}`, token);
            // console.log(studentData);
            return nullishCheck(studentData, false);
        }

        return false;
    }

    async getStudentOverviewAnalytics(classID: number, scale: string) {
        const token = await this.getAnalyticsToken();

        // console.log(token);

        if (token) {
            const overviewData = await this.getWithAuth(`https://analytics.beaconing.eu/api/proxy/gleaner/data/performance/${classID}?scale=${scale}`, token);
            // console.log(studentData);
            return nullishCheck(overviewData, false);
        }

        return false;
    }
}

export default APICore;
