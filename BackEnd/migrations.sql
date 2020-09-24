-- This is specific to SQLite but would be fairly similar for any other relational db

CREATE TABLE "location_maplocation"(
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, 
    "title" varchar(256) NOT NULL, 
    "longitude" decimal NOT NULL, 
    "latitude" decimal NOT NULL);
