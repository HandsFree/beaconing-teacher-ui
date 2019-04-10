# CONTRIBUTING
A rough guide for the backend is as follows:

    backend/
        api/            contains all of the api routes used in the teacher ui.
        cfg/            configuration parsing and file is contained here.
        entity/         entity contains all of the json structures for api requests.
        parse/          contains parse methods for some api routes
        req/            contains the get/post/etc. methods for pages.
        serv/           serv is contains the gin gonic server, routing, etc. 
        util/           misc utility files/tools

