function get(link) {
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'text';
    xhr.open('GET', link);
    xhr.send();

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log(xhr.response);
                console.log(link);
                resolve(JSON.parse(xhr.response));
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

    glps.then(values => console.log(values));
}

function getStudents() {
    const students = get(`//${window.location.host}/intent/students`);

    students.then(values => console.log(values));
}

function start() {
    getGLPs();
    getStudents();
    getGLPs();
}

const button = document.getElementById('apibutton');

button.onclick = start;
