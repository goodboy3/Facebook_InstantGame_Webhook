import fs from 'fs';
import express from "express";
import body_parser from "body-parser";
import https from "https";
import { FlappyBirdShooter } from './falppyBirdShooter/FlappyBirdShooter';
import { InstantGameDemo } from './InstantGameDemo/InstantGameDemo';
import { StackJump } from './stackJump/StackJump';


export class HttpsServer
{
    private static instance:HttpsServer=null;
    public static GetInstance()
    {
        if (HttpsServer.instance==null) {
            HttpsServer.instance=new HttpsServer();
        }
        return HttpsServer.instance;
    }

    app:any;
    httpsOption = {
        key: fs.readFileSync("./sslkey/214984630590489.key"),
        cert: fs.readFileSync("./sslkey/214984630590489.pem")
    };
    httpsServer:any;

    Init()
    {
        this.app=express().use(body_parser.json());
        this.httpsServer = https.createServer(this.httpsOption, this.app);
    }


    Run()
    {
        this.httpsServer.listen(9527, () => console.log("HttpsServerStart:"+new Date().toString()+'\nwebhook is listening'));

        //允许跨域
        this.app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
            //res.header('Access-Control-Allow-Headers', 'Content-Type');
            //res.header('Access-Control-Allow-Methods', '*');
            //res.header('Content-Type', 'application/json;charset=utf-8');
            next();
          });

        //开启测试消息
        this.StartTestResponses();
        //开启文件获取
        this.ResponesFileRequest();

        //不同应用的响应
        new InstantGameDemo().StartService(this.app);
        new FlappyBirdShooter().StartService(this.app);
        new StackJump().StartService(this.app);
       

    }

    //文件获取
    ResponesFileRequest()
    {
        this.app.get('/files/*', function (req:any, res:any) {
            res.sendFile( __dirname+"/" + req.url );
            console.log("Request for " + req.url + " received.");
        });
    }

    //测试-返回时间
    StartTestResponses()
    {
        this.app.get('/test', (req:any, res:any) => {
            res.writeHead(200, {
                'Content-Type': 'text-plain'
            });
            res.end('Hello World\n' + new Date().toString());
        });
    }
}