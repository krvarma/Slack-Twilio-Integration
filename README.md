Integrating Slack and Twilio using Api.ai and Hook.io
-----------------------------------------------------

**Introduction**

[Slack](https://slack.com/), [Twilio](https://www.twilio.com/), [Api.ai](https://api.ai/) and [Hook.io](http://Hook.io) are great platform to explore. I recently started exploring these platform. You can see in [my previous post](https://www.hackster.io/krvarma/interacting-with-particle-device-using-slack-and-nlp-458714), I have created a Proof of Concept Home Automaiton by integrating Particle Device, Slack, Api.ai and Hook.io. Here is another one I recently worked on. 

In this example, I try to integrate Slack and Twilio. You can send voice or text messages to any number by posting Slack messages in a particular channel. Same as in the previous example, in this project also I am using Api.ai to parse the Slack messages using NLP. Hook.io is used to host a microservice which process the incoming messages and call Twilio APIs to send text or voice message.

To use this project, you need a Twilio Programmable Voice account which you can purchase for a cost of $2 per month. When you purchase this, you can choose a toll-free phone number/any other number. You can configure this number with URL. This URL will be called when anybody call this number or programmatically place an outgoing call from this number to any other number. The URL should return a TwiML document. TwiML is a Markup Language to define what to do when a call is established. You can define what are the actions to be performed when a call is established like, Read some text to the caller, Record caller's voice, gather digits caller types on the Keyboard, etc... For a complete reference of TwiML refer to [this document](https://www.twilio.com/docs/api/twiml).

For this project I have hosted a Hook.io microservice that will create this TwiML response. You can pass any text as query parameter and this service will create a TwiML file that will read out the text passed to it as a query parameter.

The image below is a pictorial representation of the project:

![enter image description here](https://raw.githubusercontent.com/krvarma/Slack-Twilio-Integration/master/images/workflow.png)

**Sample Application**

In this sample application, user can post a message to a particular Slack Channel. The message should start **Twilio**. One Outgoing Webhook is configured in Slack which will invoke whenever a message starting with trigger word "twilio" is posted to the channel. The Webhook points to a microservice hosted Hook.io. This microservice will pass the message text to Api.ai which will return Intents and Actions using NLP. The intent is defined has following user expressions. 

    Send message @sys.any:message to @sys.phone-number:phone-number
    Send voice message @sys.any:message to @sys.phone-number:phone-number
    Send text message @sys.any:message to @sys.phone-number:phone-number 

As you can see from the user expressions above, you can type `send voice message <your message> to <phone number>`. Api.ai engine will parse this text and return message, messagetype and phone-number entities. The service hosted on Hook.io will receive these entities and send voice or text message depending on the messagetype entity.

The microservice hosted on Hook.io is written in Node.js. It uses Api.ai Node.js SDK and Twilio Node.js SDK. The text to parse using NLP is passed as a query parameter. 

For a detailed explanation on how to use Api.ai, please refer to [this link](https://docs.api.ai/). 

**Setting up the Application**

1. Create Api.ai account and add intents and actions. If you want to import instead of manually creating it, you can download [File](https://github.com/krvarma/Slack-Twilio-Integration/raw/master/api.ai/twilio-slack.zip) and import from Settings->Export Import. Go to your Intent Settings and note down the Client Access Token and Subscription Key. Here is a screenshot of the Api.ai intent: 
![Api.ai Intent](https://raw.githubusercontent.com/krvarma/Slack-Twilio-Integration/master/images/api.ai.intents.png)

2. Create Hook.io account and create a JavaScript hook. Copy [this file](https://raw.githubusercontent.com/krvarma/Slack-Twilio-Integration/master/hook.io/twiliomessage.js) and paste to the code.
3. Create a Slack account and create a channel "***twilio***", configure an Outgoing Webhook. Select the channel as "*Twilio*" and enter the trigger word "*twilio*". Enter the URL of the Hook.io microservice create in setup 1. My Slack Outgoing Webhook settings looks like this:
![enter image description here](https://raw.githubusercontent.com/krvarma/Slack-Twilio-Integration/master/images/slack-outhook.png)
4. Create a [Twilio account](https://www.twilio.com/) and purchase the Programmable Telephone Number. Go to your account settings and note down Account SID and Auth Token.
5. Open the Hook.io JavaScript hook create in step 2. Find the apiai object initialization and replace the [placeholder](https://github.com/krvarma/Slack-Twilio-Integration/blob/master/hook.io/twiliomessage.js#L5) with your Client Access Token and Subscription Key from Step 1. 
6. Go to the Twilio object initialization and replace the [placeholder](https://github.com/krvarma/Slack-Twilio-Integration/blob/master/hook.io/twiliomessage.js#L44) with your Account SID and Authentication Token.

Now your are ready to go, log on to Slack and type

**Using the application**

Log on to Slack and select the channel configured. Post some message as per the user expressions defined in Api.ai, refer to the user expressions listed above.

For example:

    twilio, send voice message Hello from Twilio and Slack Integration Sample to <phone number> 

This will send the voice message, if everything goes well the phone you specified  will receive a call from the Twilio number and when it is taken you can hear the message.

Also you can try 

    twilio, send text message Hello from Twilio and Slack Integration Sample to <phone number> 

This will send a text message to the phone number specified.

**Demo Video**

https://www.youtube.com/watch?v=CqkUhvBrmrQ
