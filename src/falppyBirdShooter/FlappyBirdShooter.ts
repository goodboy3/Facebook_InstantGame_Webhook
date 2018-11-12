import { SubGameBase } from "../SubGameBase";
import { RedisHelper } from "../RedisHelper";
import { AppConfig } from "../AppConfig";
import { MessagerSender } from "../MessagerSender";
import { GenericTemplate } from "../MessageTemplate";
import { Random } from "../Random";
import schedule from 'node-schedule';
import { LogHelper } from "../LogHelper";

export class FlappyBirdShooter extends SubGameBase
{

    genericTemplate: GenericTemplate[] = [
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: "Several friends have surpassed you！:",
                            image_url: "https://zstudio.online:9527/files/flappyBirdShooter/test1.png",
                            subtitle: "During your departure, several friends have surpassed you. Come back and prove yourself.",
                            buttons: [
                                {
                                    type: "game_play",
                                    title: "Challenge your friends",
                                    payload: ""
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: "Some friends want to surpass you!",
                            image_url: "https://zstudio.online:9527/files/flappyBirdShooter/test2.png",
                            subtitle: "A few friends want to surpass your results when you leave. Come back hurry and give them a lesson.",
                            buttons: [
                                {
                                    type: "game_play",
                                    title: "Play again",
                                    payload: ""
                                }
                            ]
                        }
                    ]
                }
            }
        },
    ]

    StartService(app: any)
    {
        this.name = "flappyBirdShooter";
        this.pageAccessToken = "EAADdVe94sVkBAOP7cYFeW8Ys3octnWvZBvuOzmLalQvY9a9NH7dF7otoPqg7ZBE2p56mXemc2QSDJbZC5DYpeF8rG0xb7nEp6lOjRUWPWLSA5UDDZA9ZBb7WC5pAdGiPWNJMx3ZCypw4dhoIq9akwLBAkNZBcR0UQQjSqrAdZAwrlhntUPhs3f38";
        this.hook = "/" + this.name + "/webhook"
        this.app = app;

        let nameStr = "[" + this.name + "]";
        LogHelper.info(nameStr + " Webhook Start")
        LogHelper.info(nameStr + " webhook address:" + this.hook);

        this.RunResponse();

        //开启定时任务
        LogHelper.info(nameStr + " scheduleJob Ready");
        schedule.scheduleJob("0 7 * * * *",
            function ()
            {
                this.ScheduleCheck();
            }.bind(this));
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
                        //console.log("fail:" + err);
                    }
                    else
                    {
                        //console.log("success:" + res);
                    }
                }.bind(this));
        }
    }

    //检查是否要发送消息给玩家
    ScheduleCheck()
    {
        //获取当前所有的senderId和信息
        LogHelper.info("Start to check: Do need send message to player");
        var nowTime = Date.now();
        LogHelper.info("startTime:" + new Date(nowTime).toString());
        //遍历每个senderId
        RedisHelper.client.hgetall(this.name,
            function (e, v)
            {
                for (let key in v)
                {
                    let lastPlayTime = parseInt(v[key]);
                    //离开上次游戏时间超过了设定的时间
                    if (nowTime - lastPlayTime >= AppConfig.sendTimeOffset)
                    {
                        //需要发送消息
                        this.SendQuestion(key)
                    }
                }
            }.bind(this));
    }

    SendQuestion(id: string)
    {
        let index = Random.Random0To1Int();
        let json = this.genericTemplate[index];
        MessagerSender.Send(id, json, this.pageAccessToken,
            function ()//成功
            {
                //console.log("发送成功,重新设置最后时间");
                let newTime = Date.now() + AppConfig.nextTimeAdd;
                RedisHelper.client.hset(this.name, id, newTime.toString());
            }.bind(this),
            function (err)//失败
            {
                LogHelper.info("发送失败,删除这个用户:" + id);
                RedisHelper.client.hdel(this.name, id,
                    function (e, v)
                    {
                        if (e)
                        {

                            return;
                        }
                    });
            }.bind(this));
    }
}
