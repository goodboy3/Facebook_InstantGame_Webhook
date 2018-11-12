import { SubGameBase } from "../SubGameBase";
import { RedisHelper } from "../RedisHelper";
import { GenericTemplate } from "../MessageTemplate";
import { MessagerSender } from "../MessagerSender";
import { LogHelper } from "../LogHelper";

export class InstantGameDemo extends SubGameBase
{

    genericTemplate: GenericTemplate = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Button_Title",
                        image_url: "https://zstudio.online:9527/files/instantGameDemo/facebookDemoIcon_512.png",
                        subtitle: "Button_subtitle",
                        buttons: [
                            {
                                type: "game_play",
                                title: "Play",
                                payload: ""
                            }
                        ]
                    }
                ]
            }
        }
    };

    StartService(app: any)
    {
        this.name = "instantGameDemo";
        this.pageAccessToken = "EAANGZCv5xZAcIBABvTzRouufUUnTQcAR4Rf6r2nCfStkMKJGAB6yVHAAeSkPuLx09gZCh1XYPsfHXe8h6eTZCPDhI1V5K1emSTh29hE2fKOJLGxZBFLy7PcnO8El2ziZCWcIE6QBPvZAi0nyYf1g7Dh578TZCtC1xPrzGBDEVFJAc4zqwrdtP1BV";
        this.hook = "/" + this.name + "/webhook"
        this.app = app;

        let nameStr = "[" + this.name + "]";
        LogHelper.info(nameStr + " Webhook Start")
        LogHelper.info(nameStr + " webhook address:" + this.hook);

        this.RunResponse();

        LogHelper.info("");
    }

    HandleGamePlay(event: any)
    {
        let senderId = event.sender.id;//senderId
        let playerId = event.game_play.player_id;//玩家ID
        let contextId = event.game_play.context_id;//contextID
        if (!event.game_play.payload) 
        {
            return;
        }
        let payload = JSON.parse(event.game_play.payload);//附带数据
        let receiveTime = event.timestamp;//发送时间戳

        if (payload.scoutSent) 
        {
            //保存退出游戏的时间
            let exitTime = receiveTime;
            RedisHelper.client.hset(this.name, senderId, exitTime,
                function (err, res)
                {
                    if (err) 
                    {
                        //LogHelper.error("fail:" + err);
                    }
                    else
                    {
                        //LogHelper.info("success:" + res);
                        this.SendGameButton(senderId);
                    }
                }.bind(this));
        }
    }

    SendGameButton(id: string)
    {
        MessagerSender.Send(id, this.genericTemplate, this.pageAccessToken,
            function ()//成功
            {
                LogHelper.info("发送成功");

            }.bind(this),
            function (err)//失败
            {
                LogHelper.info("发送失败");

            }.bind(this));
    }
}
