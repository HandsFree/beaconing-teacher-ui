# Config
Configuration files are stored in TOML.

### Authorisation
In the configuration file, make sure to append/edit the `[auth]` section with the 
id and secret as follows:

client.toml
```toml
[auth]
id = "teacherui"
secret = "UrqTSjfnaWsaJHCTfGeU6YyEVNa3c2QzE8GrTLcoK1kljsNB3HrG6jXAGI6q8wKR"
```

### [https://git.juddus.com/HFC/beaconing/issues/9](API Stuff)
API Links:

* [Core API](https://core.beaconing.eu/api-docs/)
* [Auth System Docs](https://www.dropbox.com/s/rtfu6th747et23s/Beaconing%20Auth.docx?dl=0)
* [Statistics API](https://rage.e-ucm.es/api/proxy/gleaner/data/overall/student_id_here_link_follower)

Here is a document on the authentification system:

https://www.dropbox.com/s/rtfu6th747et23s/Beaconing%20Auth.docx?dl=0

It was this https://rage.e-ucm.es/api/proxy/gleaner/data/overall/**student_id**

But it requires auth now, and not sure what the auth process is.