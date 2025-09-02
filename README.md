# Playwright Docker Jenkins
[GitHub Repository](https://github.com/A-Makeyev/playwright-docker-jenkins)

## Run commands
```
    run all tests -> bunx playwright test
    run api sanity test -> bunx playwright test tests/api/home/sanity.spec.ts
    run ui signup test -> bunx playwright test tests/ui/auth/signup.spec.ts --project=chromium
```

## Open allure report
```
bunx allure generate allure-results --clean -o allure-report
bunx allure open allure-report
```

### Create jenkins image
docker-compose up -d

### Open jenkins
http://localhost:8080

### Get jenkins password
docker exec jenkins-docker-example cat /var/jenkins_home/secrets/initialAdminPassword

## Setting up Webhooks
### ngrok
1) Download ngrok and sign up
2) Configure -> ngrok config add-authtoken $YOUR_AUTHTOKEN
3) Update ngrok.yml to:
    version: 3
    agent:
    authtoken: $YOUR_AUTHTOKEN
    endpoints:
    - name: APP_NAME
        url: nominally-probable-rat.ngrok-free.app
        upstream:
        url: 8080

4) Open cmd and run -> ngrok start APP_NAME
5) ngrok will create a url which redirects to your localhost (https://nominally-probable-rat.ngrok-free.app -> http://localhost:8080)

### Github
1) Go to your github repo -> Settings -> Webhooks
2) Set payload url to the url we got from ngrok and add github-webhook -> https://nominally-probable-rat.ngrok-free.app/github-webhook/
3) Content type -> application/x-www-form-urlencoded

## Quick commands (cmd)
docker-compose up -d && ngrok start jenkins
git add . && git commit -m "update <%DATE% %TIME:~0,8%>" && git push
