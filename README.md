# Horizons Compendium

(this readme was intended for my Web Development teacher too properly review my final as this is what I turned in. it may be updated at a later point in time. but this may also pertain to anyone who wants to try it out and take it for a spin)

### my mission
my goal with Horizons Compendium is to create the ultimate Animal Crossing: New Horizons Wiki
and general knowledge base of collective information. In addition to this, I hope to expose
a flexible and powerful JSON based Web API to developers that wish to utilize the collected
information in their own projects.

### usage
as of right now, the only developed part of the database is the Animal Crossing clothing
catalog which can both be written to and read from.  

for testing purposes, you need to make sure that you have a valid token. which I have already included
in the `/api/auth.json` file (your token is testtoken)  

additionally, you need to make sure that a web server is running (written in node.js)  

to do this simply execute the start.bat file in the root directory which will use the node executable to start the server.
(if you're on a non windows platform you may need to manually install node to get this to work)  

and please note that you may see a server.crt file and a server.key file in the root directory. these are there merely for
testing purposes to test SSL functional code, but those are just dummy files and SHOULD NOT be used in a production environment.  

once you have the server up and running, you can navigate to http://localhost:8080/ and test out the website.  

for testing image functionality, I've included some clothing catalog images in the tests/images folder
