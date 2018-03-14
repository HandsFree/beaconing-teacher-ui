function get(link) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', link, true);
    xhr.responseType = 'json';
    xhr.send(null);

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log('Request Link: ', link);
                console.log('Response Test: ', xhr.response);
                console.log(xhr.status, ' ', xhr.statusText);
            }
        };

        xhr.onerror = () => {
            const msg = `[API Core] Error: ${xhr.status}: ${xhr.statusText}`;

            reject(msg);
        };
    });
}

function getGLPs() {
    const glps = get(`//${window.location.host}/intent/glps`);

    glps.then(values => console.log('JSON Object: ', values));
}

function getStudents() {
    const students = get(`//${window.location.host}/intent/students`);

    students.then((values) => {
        console.log('JSON Object: ', values);

        for (const student of values) {
            console.log('ID: ', student.Id);
            console.log('Username: ', student.Username);
        }
    });
}

function getGroups() {
    const groups = get(`//${window.location.host}/intent/studentgroups`);

    groups.then(values => console.log('JSON Object: ', values));
}

function getCurrentUser() {
    const profile = get(`//${window.location.host}/intent/profile`);

    profile.then(values => console.log('JSON Object: ', values));
}

function start() {
    getStudents();
    let f = function(){};
    getCurrentUser();
}

const button = document.getElementById('apibutton');
button.onclick = start;