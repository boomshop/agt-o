# AGT-O

This is a server-based (PHP) application with a REACT front-end to setup and run competitions for smokedivers.

## Installation

### Webserver

* Upload the contents of the server directory to your PHP-enabled webserver. It requires GDlib, EXIF and MySQL.
* Make certificates and source writeable for your PHP user.
* Set up your database. The database definition can be found in agt-o_structure.sql.

### Front-end

* Make sure you have NPM installed on your system.
* In the agt-o subdirectory run `npm ci`.
* To build the application run `npm run build` in the agt-o subdirectory.
* Upload the contents of the `build` subdirectory to the root of your server.
