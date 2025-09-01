# playwright-docker-jenkins

### Create jenkins image
docker-compose up -d

### Open jenkins
http://localhost:8080

### Get jenkins password
docker exec jenkins-docker-example cat /var/jenkins_home/secrets/initialAdminPassword
