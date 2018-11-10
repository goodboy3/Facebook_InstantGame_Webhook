// genericTemplate = {
//     attachment: {
//         type: "template",
//         payload: {
//             template_type: "generic",
//             elements: []
//         }
//     }
// }
export interface GenericTemplate
{
    attachment:GenericTemplateAttachment
}
export interface GenericTemplateAttachment
{
    type:string;
    payload:GenericTemplateAttachmentPayload
}
export interface GenericTemplateAttachmentPayload
{
    template_type:string;
    elements:Element[];
}

// listTemplate={
//     attachment: {
//         type: "template",
//         payload: {
//             template_type: "list",
//             top_element_style:"compact",
//             elements: []
//         }
//     }
// }
export interface ListTemplate
{
    attachment:ListTemplateAttachment
}
export interface ListTemplateAttachment
{
    type:string;
    payload:ListTemplateAttachmentPayload
}
export interface ListTemplateAttachmentPayload
{
    template_type:string;
    top_element_style:string;
    sharable:boolean;
    elements:Element[];
}


// element={
//     title:"Question:",
//     image_url:"",
//     subtitle:"",
//     buttons:[]
// }
export interface Element
{
    title:string;
    image_url:string;
    subtitle:string;
    buttons:GamePlayButton[];
}

// gamePlayButton={
//     type: "game_play",
//     title: "Ask Friend",
//     payload: ""
// }
export interface GamePlayButton
{
    type:string;
    title:string;
    payload:string;
}

// buttonPayload={
//     share: 1,
//     s: ["283504779039200", "webhook", ""],
//     q: ["0", "", ""]
// }
export interface GamePlayButtonPayload
{
    share:number;
    s:string[];
    q:string[];
}

export class MessageTemplate
{
    static genericTemplate:GenericTemplate = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: []
            }
        }
    }
    static listTemplate:ListTemplate={
        attachment: {
            type: "template",
            payload: {
                template_type: "list",
                top_element_style:"compact",
                sharable:false,
                elements: []
            }
        }
    }
    static element:Element={
        title:"Question:",
        image_url:"",
        subtitle:"",
        buttons:[]
    }

    static gamePlayButton:GamePlayButton={
        type: "game_play",
        title: "Ask Friend",
        payload: ""
    }

    static buttonPayload:GamePlayButtonPayload={
        share: 1,
        s: ["283504779039200", "webhook", ""],
        q: ["0", "", ""]
    }
}