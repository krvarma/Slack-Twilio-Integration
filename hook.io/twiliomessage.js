module['exports'] = function echoHttp (hook) {
	var apiai = require('apiai');
  	var https = require('https');
  	var querystring = require('querystring');
	var app = apiai("<your client access token>", "<your client subscription key>");
  	var query = hook.params["text"];
  
  	console.log(query);
  
	var qtext = query.replace("twilio, ", "");
  
  	console.log(qtext);
  
  	var request = app.textRequest(qtext);
  
	request.on('response', function(response) {
    	console.log(response);
      
      	var statusCode = response["status"]["code"];
      
      	if(statusCode != 200){
          	var returnValue = {
				'statusCode': response["status"]["code"],
          		'errorType': response["status"]["errorType"],
        	}
            
            hook.res.end(returnValue);
        }
      
      	var result = response["result"];
      	var action = result["action"];
      
      	if(action == 'send-message'){
          	var params = result["parameters"];
          	var message = params["message"];
          	var messagetype = params["messagetype"];
          	var number = params["phonenumber"];
          
          	console.log(params);
          	console.log("Message " + message);
 	        console.log("Message Type: " + messagetype);
          	console.log("Phone Number: " + number);
          
          	var client = require('twilio')('<your account SID>', '<your authentication token>');
			var fromNumber = '<your telephone number>';

            if(messagetype === 'voice'){
          		client.makeCall({
                	    to:number, // Any number Twilio can call
                    	from: fromNumber, // A number you bought from Twilio and can use for outbound communication
                    	url: 'https://hook.io/krvarma/gettwml?text=' + encodeURIComponent(message)  // A URL that produces an XML document (TwiML) which contains instructions for the call
                	}, function(err, responseData) {
	
    	                //executed when the call has been initiated.
                    	console.log(err);
                    	console.log(responseData); // outputs "+14506667788"
	
                    	hook.res.end(responseData);
                	}
            	);
            }
          	else{
            	client.messages.create({
                	    to:number, // Any number Twilio can call
                    	from: fromNumber, // A number you bought from Twilio and can use for outbound communication
                    	body: message  // A URL that produces an XML document (TwiML) which contains instructions for the call
                	}, function(err, responseData) {
	
    	                //executed when the call has been initiated.
                    	console.log(err);
                    	console.log(responseData); // outputs "+14506667788"
	
                    	hook.res.end(responseData);
                	}
            	);
          	}
        }
      	else{
            var returnValue = {
                'response': JSON.stringify(response, false, 2),
            } 	

            hook.res.end(returnValue);
        }
	});
 
	request.on('error', function(error) {
    	console.log(error);
      
      	hook.res.end("Error: " + error);
	});
 
	request.end()
};