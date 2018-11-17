import { Application } from "express";
import { RedisHelper } from "./RedisHelper";
import { MessagerSender } from "./MessagerSender";
import { LogHelper } from "./LogHelper";

export abstract class SubGameBase
{
    name: string = "";//游戏名称
    appId: string = "";//应用ID
    pageAccessToken: string = "";//游戏口令
    hook: string = "";
    app: Application = null;


    /**
     * 开始服务,需要为 name token hook app赋值
     */
    abstract StartService(app: Application);

    RunResponse()
    {
        this.ResponseGet();
        this.ResponsePost();
    }

    ResponseGet()
    {
        if (this.app == null) 
        {
            LogHelper.error(this.name + " app is null");
            return;
        }
        this.app.get(this.hook + "/isRun", (req: any, res: any) =>
        {
            res.writeHead(200, {
                'Content-Type': 'text-plain'
            });
            res.end("[" + this.name + "] is running\n" + new Date().toString());
        });
        this.app.get(this.hook,
            function (req, res)
            {
                //console.log("token:",pageAccessToken);
                /** UPDATE YOUR VERIFY TOKEN **/
                //var VERIFY_TOKEN = pageAccessToken;

                // Parse params from the webhook verification request
                let mode = req.query['hub.mode'];
                let token = req.query['hub.verify_token'];
                let challenge = req.query['hub.challenge'];

                // Check if a token and mode were sent
                if (mode && token)
                {
                    // Check the mode and token sent are correct
                    if (mode === 'subscribe' && token === this.pageAccessToken)
                    {
                        // Respond with 200 OK and challenge token from the request
                        LogHelper.info('WEBHOOK_VERIFIED');
                        res.status(200).send(challenge);
                    } else
                    {
                        // Responds with '403 Forbidden' if verify tokens do not match
                        res.sendStatus(403);
                    }
                }
            }.bind(this));
    }

    ResponsePost()
    {
        if (this.app == null) 
        {
            LogHelper.error(this.name + " app is null");
            return;
        }
        this.app.post(this.hook,
            function (req, res)
            {
                // Parse the request body from the POST
                let body = req.body;
                //LogHelper.debug("");
                //LogHelper.debug("body");
                //LogHelper.debug(body);
                // Check the webhook event is from a Page subscription
                if (body.object === 'page')
                {
                    // Iterate over each entry - there may be multiple if batched
                    body.entry.forEach(function (entry)
                    {
                        // Get the webhook event. entry.messaging is an array, but 
                        // will only ever contain one event, so we get index 0
                        let event = entry.messaging[0];
                        //LogHelper.debug("messaging:");
                        //LogHelper.debug(event);
                        if (event.game_play) 
                        {
                            this.HandleGamePlay(event);
                        }
                        else if (event.message) 
                        {
                            this.HandleMessage(event);
                        }
                        else 
                        {
                            this.HandleOther(event);
                        }
                    }.bind(this));
                    // Return a '200 OK' response to all events
                    res.status(200).send('EVENT_RECEIVED');
                }
                else
                {
                    // Return a '404 Not Found' if event is not from a page subscription
                    res.sendStatus(404);
                }
            }.bind(this));
    }

    HandleOther(event: any)
    {

    }

    HandleMessage(event: any)
    {
        let id = event.sender.id;
        if (event.message.text) 
        {
            let json = { text: "Welcome to my page!" };
            MessagerSender.Send(id, json, this.pageAccessToken);
        }
    }

    HandleGamePlay(event: any)
    {
        let senderId = event.sender.id;//senderId
        let playerId = event.game_play.player_id;//玩家ID
        let contextId = event.game_play.context_id;//contextID
        let receiveTime = event.timestamp;//发送时间戳

        //保存退出游戏的时间
        RedisHelper.client.hset(this.name, senderId, receiveTime,
            function (err, res)
            {
                if (err) 
                {
                    console.log(err);
                }
            });
    }

}