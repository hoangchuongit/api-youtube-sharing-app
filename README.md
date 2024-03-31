
# API Youtube Sharing app
API of youtube sharing app. Built from NestJS 10.

## Features

- User registration and login with JWT
- Sharing YouTube videos
- Real-time notifications for new video shares with Web socket

## Tech Feature
- API docs using Swagger UI with URL http://localhost:3001/docs with a protected route:
- Username: admin
- Password: admin
- ![N|Solid](https://github.com/hoangchuongit/api-youtube-sharing-app/assets/24239781/0df4a9e8-c0e3-4494-804c-95da422569c1)

- Also include testing modules for all: controllers, services, repositories, entities, etc... You can try with the command below after setting the environment for the application:

```sh
yarn run test
```
![N|Solid](https://github.com/hoangchuongit/api-youtube-sharing-app/assets/24239781/cc67ae99-d745-4768-9607-e76168c72acc)

- In additional, use [Husky](https://typicode.github.io/husky/) to manage git commits
- ![N|Solid](https://github.com/hoangchuongit/api-youtube-sharing-app/assets/24239781/ec00c362-f23e-47f6-b9bc-86557b4c022d)

## Tech

API Youtube Sharing app uses a number of open source projects to work properly:

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [Node.js](https://nodejs.org/) - evented I/O for the backend
- [Yarn](https://yarnpkg.com/) - package manager that doubles down as project manager
- [Android Studio](https://developer.android.com/studio) - build .apk or .aab for Android devices
- [Visual Studio Code](https://code.visualstudio.com/download) - Code editing.Redefined. Free. Built on open source. Runs everywhere.
- [Docker](https://www.docker.com/) - Accelerated Container Application Development

## Installation

API Youtube Sharing app requires [Node.js](https://nodejs.org/) v20+ and to run. Recommended to use version 20.12
In addition, also need to install [Yarn](https://yarnpkg.com/) and [Docker](https://www.docker.com/) to develop the project.

After install node you can install global packages.

```sh
npm install -g @nestjs/cli yarn
```

After clone the project, please follow the steps to run it on your local:

Step 1: install the dependencies and devDependencies:

```sh
yarn install
```

Step 2: Run on local:
```sh
yarn docker:dev
```

The above command will create a new Container as image:

![N|Solid](https://github.com/hoangchuongit/api-youtube-sharing-app/assets/24239781/4f8eced8-8592-4814-829c-5ab78f5c557c)


API we run on host: http://localhost:3001/docs
- Username: admin
- Password: admin
 
![N|Solid](https://github.com/hoangchuongit/api-youtube-sharing-app/assets/24239781/0df4a9e8-c0e3-4494-804c-95da422569c1)

Database will run on the host: http://localhost:8002/
- Username: admin
- Password: admin

![N|Solid](https://github.com/hoangchuongit/api-youtube-sharing-app/assets/24239781/c5e9757d-2b89-4f25-8c75-08a4391f26ae)

Copyright ©2024.
