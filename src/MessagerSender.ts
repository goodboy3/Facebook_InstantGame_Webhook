import request from 'request';

export class MessagerSender
{

    private static _send(json, token, successCallback: Function, failCallback: Function)
    {

        var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token=' + token;
        request({
            url: graphApiUrl,
            method: "POST",
            json: true,
            body: json
        }, function (error, response, body)
            {
                if (!error)
                {
                    //console.log('message sent!')
                    if (successCallback) 
                    {
                        successCallback();
                    }
                }
                else
                {
                    console.error("Unable to send message:" + error);
                    if (failCallback) 
                    {
                        failCallback(error);
                    }
                }
            });
    }

    static Send(targetId: string, json: any, token: string, successCallback: Function = null, failCallback: Function = null)
    {
        let sendJson = {
            recipient: {
                id: targetId
            },
            message: json
        }
        MessagerSender._send(sendJson, token, successCallback, failCallback);
    }

}