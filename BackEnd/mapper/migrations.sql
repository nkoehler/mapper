-- would typically check to make sure the table doesn't exist in a real migration file

CREATE TABLE "location_maplocation"
(
    "id" serial NOT NULL PRIMARY KEY,
    "title" varchar(256) NOT NULL,
    "longitude" numeric(21, 9) NOT NULL,
    "latitude" numeric(21, 9) NOT NULL
);
