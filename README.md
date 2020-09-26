# Mapper - MVP For RideCo - Nicholas Koehler
This is an application that allows you to create, edit, and delete points of interest on a map.

Live Demo: https://nkoehler-mapper-website.azurewebsites.net/

# Technology Stack
**Mapping**: OpenLayers 6, OSM

**Front end**: Angular 10, TypeScript 3.9, HTML5, CSS3

**Back end**: Django 3, Python 3.7

**Database**: PostgreSQL 10

**Cloud**: Azure App Service, Azure Database for PostgreSQL

# Limitations
This is an MVP.  As such, there were many shortcuts taken in the interest of speed.  Here are some shortcomings and how I would address them for a real production scenario.

**Code Safety**: Shortcuts were taken when calling functions/methods that may not always return success (ex. indexOf, etc.).  In production, the return values would be properly checked and verified before proceeding.

**Security**: Secret keys, passwords, and configuration data are plain text.  In production, these would be protected by a configuration vault or some other secure means of passing this data to the application.

**Scalability**: Thousands of simultaneous requests would slow down the system.  In production, the backend would use caching where possible and would only select the columns needed from the table.

**Mobile**: Resolutions below 1280x720 are not supported. In production, the use of CSS3 queries would allow the header and sidebar to react to the smaller screen size with a popover menu.

**Testability**: Unit tests are missing.  In production, the backend would feature near complete coverage for any complex logic ensuring the code is stable and performing as expected.

# Source Code
All source code, assets, and schemas are included in this repository.

# Install Locally
Download repository and extract to an accessible location. Ensure python and npm package manager is installed.

**Front end**
- cd FrontEnd
- npm install
- npm start
- Browse localhost:4200

**Back end**
- cd BackEnd\mapper
- pip install -r requirements.txt
- python manage.py runserver
- Browse localhost:8000/location/poi/

# Feature Wishlist
If there was more time, these are a few things I might add.

- Presenting and storing more location information such as full address and nearby similar locations
- Ability to search for a location based on tags and geography
- Favouriting a location, marking a location as visited, and sharing a location via invite to a friend
- Chart location distances from home address and provide routes

# Thank You
If you made it this far, thank you for taking the time to read this.
