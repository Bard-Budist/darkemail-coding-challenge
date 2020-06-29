# DarkEmail - Coding Challenge

DarkEmail is an email service in which you sign up, confirm your email and that's it! You have send the emails!

## Usage
***Remember to check your email in order to use the email service!***
You can test!!
[http://darkemail.me:3000/](http://darkemail.me:3000/)

## Description

### Problem
Create a service that accepts the necessary information and sends emails. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.

### Solution

Initially, I have divided the problem into parts like ***handling the change of provider***, ***sending email*** and finally ***the information***. Then for the part of handling the change of provider what I did was to focus on one [API SendGrid](https://sendgrid.com/docs/API_Reference/Web_API/mail.html) and handle all the requests through it, as if this was the main one. On the other hand as a backup provider I used [MailGun API](http://documentation.mailgun.com/quickstart.html#sending-messages) that unfortunately the sandbox I have is a bit limited in the sense of the amount of requests I can make and so I took it as a secondary.

So the way I did it was fortunately SendGrid API handles an endpoint that checks the status of it, so I used it handling the status and disable it in the endpoint **(/status)** of my API in case it is ***orange*** or  ***critical*** and use the other provider.

In the case of sending email and information is strongly related because to send a message through the provider SendGrid you need a creation and confirmation of the sender (The mail that will send emails). So what I did was to implement a login and registration through **AWS Cognito** and at the same time register the sender in SendGrid through a single endpoint of my API **(/user/create)** and using SendGrid and MailGun libraries send the respective emails.

# Stack

![stack](https://i.postimg.cc/528BbMFH/Diagrama-en-blanco-1.png)

## Back-end

**Run**

    npm install
    npm run start

For back-end use Node js, ExpressJs to build an API that will handle all events.
#### API endpoint
- **/status** *GET*
This endpoint takes care of checking the status of the providers.
- **/user/create** *POST*
This endpoint takes care of creating a user in AWS Cognito and SendGrid provider.
- **/user/login** *POST*
This endpoint is in charge of verifying the user's data in AWS Cognito and then logging it in.
- **/send** *POST*
This endpoint sends an email depending on the data sent in the POST method.

## Front-end

**Run**

    npm install
    npm run start
    
In the front-end I use ReactJS with UI Material and handle all operations like logging, account creation and so on through https requests to my API


## Issues / Aspects

- The free version providers are a bit unstable, so there will be times when they won't send :7
- It took some handling of errors and notifications.
- I finally tried to do the deployment with AWS but due to lack of time I was able to implement it but a small error in the ports. So that's how they were
	[http://darkemail.me:3000/](http://darkemail.me:3000/)
