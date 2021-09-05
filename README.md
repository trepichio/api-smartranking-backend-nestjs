<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="./src/static/assets/images/LogoMakr-5TMi6r.png" alt="SmartRanking logo"></a>
</p>

<h3 align="center">SmartRanking</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/trepichio/api-smartranking-backend-nestjs)](https://github.com/trepichio/api-smartranking-backend-nestjs/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/trepichio/api-smartranking-backend-nestjs)](https://github.com/trepichio/api-smartranking-backend-nestjs/pulls)

![GitHUb Repo Views](https://visitor-badge.glitch.me/badge?page_id=api-smartranking-backend-nestjs.visitor-badge) ![GitHub Repo stars](https://badgen.net/github/stars/trepichio/api-smartranking-backend-nestjs)
![GitHub top language](https://img.shields.io/github/languages/top/trepichio/api-smartranking-backend-nestjs?style=falt)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
</div>

---

<p align="center"> It is a application that registers players and allows them to challenge each other, saves their match results and provides a leaderboard. <b>This repository is the REST API of the application.</b> </p>
    <br>
</p>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [🧐 About <a name = "about"></a>](#-about-)
- [🏁 Getting Started <a name = "getting_started"></a>](#-getting-started-)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Running](#running)
- [🎈 Usage <a name="usage"></a>](#-usage-)
- [⛏️ Built Using <a name = "built_using"></a>](#️-built-using-)
- [✍️ Author <a name = "author"></a>](#️-author-)
- [🎉 Acknowledgements <a name = "acknowledgement"></a>](#-acknowledgements-)

## 🧐 About <a name = "about"></a>

This is just a project for learning purposes. It is not intended to be used in production. The goal of this project is to provide a simple and easy to use API for registering players and challenging each other and deliver a Ranking for them. The API is built using the [NestJS](https://nestjs.com/) framework.

This API was built in two different architectures: [monolith REST API](https://github.com/trepichio/api-smartranking-backend-nestjs) and **microservices approaches**.

**This repository is ONLY the *monolith REST API* of the application.**

If you want to have a look at both the microservices architecture and the REST API, you can find them on the [GitHub Repo](https://github.com/trepichio/SmartRanking).

Along the way, building this REST API I've learned the following technologies:
- a new server framework (NestJS) and how to build both a *monolith RESTful API* and a *Microservices oriented application*.
- How to host a MongoDB server on cloud *MongoDB Atlas* and how to use it to store data.

However, I've also learned many more technologies working on the Microservices architecture of this application, [check it out here](https://github.com/trepichio/SmartRanking)

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

You need a database server installed and running on your local machine or hosted on the cloud.
I've used [MongoDB](https://www.mongodb.com/) hosted by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) on this project.

After that, it's time to setup the project.

### Installing

Clone this repository to your local machine.

```
$ git clone https://github.com/trepichio/api-smartranking-backend-nestjs.git
```


Enter the root folder of the cloned project and rename their `.env.example` file to `.env` and input values of their respectives variables on file in order to setup database.

The variables are pretty much self-explanatory.

Then, install dependecies. In your terminal, at root of project, run:

```
$ npm install
```

### Running
You are ready to go.
Open a terminal then run:

```
$ npm run start:dev
```

Now, you have the **REST API** up and running! You can use any REST Client you like and consume any of API endpoints such as

```
GET http://localhost:8080/players HTTP/1.1.
```

If you use Visual Code there is a very useful extension that works like a REST Client. See [here](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). Otherwise, you can use any REST Client you like.

In case, you decided to go and use this extension, enjoy the `request.rest` file I've already done for your usage. Enjoy! 😎


## 🎈 Usage <a name="usage"></a>

You can use the following endpoints:

- `GET http://localhost:8080/api/v1/players`: This endpoint returns a list of players.
- `GET http://localhost:8080/api/v1/players/{id}`: This endpoint returns a player by ID.
- `POST http://localhost:8080/api/v1/players`: This endpoint creates a new player.
- `PUT http://localhost:8080/api/v1/players/{id}`: This endpoint updates a player by ID.
- `DELETE http://localhost:8080/api/v1/players/{id}`: This endpoint deletes a player by ID.
- `GET http://localhost:8080/api/v1/categories`: This endpoint returns a list of categories.
- `GET http://localhost:8080/api/v1/categories/{id}`: This endpoint returns a category by ID.
- `POST http://localhost:8080/api/v1/categories`: This endpoint creates a new category.
- `PUT http://localhost:8080/api/v1/categories/{id}`: This endpoint updates a category by ID.
- `DELETE http://localhost:8080/api/v1/categories/{id}`: This endpoint deletes a category by ID.
- `POST http://localhost:8080/api/v1/categories/{id}/players/{playerId}`: This endpoint associates a player to a category.
- `POST http://localhost:8080/api/v1/challenges`: This endpoint creates a new challenge between two players.
- `GET http://localhost:8080/api/v1/challenges/`: This endpoint returns a list of challenges.
- `GET http://localhost:8080/api/v1/challenges/?playerId={id}`: This endpoint returns a list of challenges for a player.
- `GET http://localhost:8080/api/v1/challenges/{challengeId}`: This endpoint returns a challenge by ID.
- `PUT http://localhost:8080/api/v1/challenges/{challengeId}`: This endpoint updates a challenge by ID. It should be used to accept or reject a challenge.
- `DELETE http://localhost:8080/api/v1/challenges/{challengeId}`: This endpoint deletes a challenge by ID.
- `POST http://localhost:8080/api/v1/challenges/{challengeId}/match`: This endpoint adds a match for an already accepted challenge.

For more information about the endpoints have a look at the `requests.rest` file located at the root of project folders.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud-hosted MongoDB service on AWS
- [NestJS](https://nestjs.com/) - Server Framework for scalable server-side applications (microservices)
- [Typescript](https://www.typescriptlang.org//) - Typed Javascript Superset
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Author <a name = "author"></a>

| [<img alt="João Trepichio" src="https://avatars2.githubusercontent.com/u/11396817?s=460&u=085712d4f1296e6ad0a220ae7c0ea5278a9c40ed&v=4" width="100">](https://trepichio.github.io) |
|:--------------------------------------------------:|
| 🔥 [João Trepichio](https://trepichio.github.io)    |
| [<img alt="Github Profile" src="./src/static/assets/images/github-logo-thumbnail.png" width="50">](https://github.com/trepichio) [<img alt="LinkedIn Profile" src="./src/static/assets/images/linkedin-logo-thumbnail.png" width="50">](https://www.linkedin.com/in/trepichio/)    |



## 🎉 Acknowledgements <a name = "acknowledgement"></a>

  This project is result of the Udemy course called [Construa um Backend resiliente e escalável com NestJS, serviços em cloud[AWS e SAP] e padrões arquiteturais corporativos](https://www.udemy.com/course/construindo-um-backend-escalavel-com-nestjs-aws-e-pivotalws/) by [DFS Training](https://www.udemy.com/user/diego-fernandes-da-silva/)
