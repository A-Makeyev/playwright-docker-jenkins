# playwright-docker-jenkins

### Create jenkins image
docker-compose up -d

### Open jenkins
http://localhost:8080

### Get jenkins password
docker exec jenkins-docker-example cat /var/jenkins_home/secrets/initialAdminPassword



## Setting up Webhooks
### ngrok
1) Download ngrok and sign up
2) Open cmd and run ngrok http 8080
3) ngrok will create a url which redirects to your localhost (https://6a3924934cf7.ngrok-free.app -> http://localhost:8080)


### Github
1) Go to your github repo -> Settings -> Webhooks
2) Set payload url to the url we got from ngrok and add github-webhook -> https://6a3924934cf7.ngrok-free.app/github-webhook/
3) Content type -> application/x-www-form-urlencoded

