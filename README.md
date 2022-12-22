# GiftTo ADMIN

### Folder Structure
Basic strucrue is created by Angular, Here's requirements set as per app.

    .
    ├── .firebase            # This contains deployment info of deployed app to firebase
    ├── dist                 # This is auto generated folder when we run `ng buid` command
    ├── e2e                  # This module is used for app testing.
    ├── node_modules         # This contains project dependencies(Auto generated after npm install)
    ├── srs                  # All app's code exist here
        ├── app              # App Modules
            ├── authentication   # Authentication process for loggin in
            ├── core             # Main wrapper of app
            ├── guard            # Auth Guards.
            ├── layout           # App global used layouts
            ├── routes           # All views & pages of app
                ├── components   # All view components
                ├── elements     # Basic reusable components
                ├── pages        # Global defined pages
                ├── services     # Data Setters & getters for components
            ├── shared           # Shared files to be used by any app's components
        ├── assets               # Assets used in app.
        ├── environments         # Env configuration - DEV/PROD
    ├── firebase.json            # Contains info of firebase project set (To Deploy)
    ├── package.json             # Project dependencies
    └── ...Other files created by Angular framework
