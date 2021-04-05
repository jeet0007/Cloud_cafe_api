# Cloud_cafe_api for Cloud Cafe #
This is my Senior project 
- Uses Nodejs as backend and React as front-end 
  - Uses Express 
  - Working With *AWS SDK*
- Uses Microservice architecture 
- Hosted on Heroku : An hosting service [Heroku homepage](https://dashboard.heroku.com/)

*LIVE WEBSITE AT : https://cloud-cafe-webapp.herokuapp.com/library*

# About Project
## Deployment 
To install on Heroku using yarn
```bash
yarn install
```
You can either install with npm as an global package for convenience 
```bash
npm i heroku -g
```
To Create new project on heroku
```bash
heroku login
heroku create <project-name>
```
Push content to heroku
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```
