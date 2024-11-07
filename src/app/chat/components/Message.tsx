import { BaseMessage } from "@sendbird/chat/message";
import Image from "next/image";


export default function Message({message, userId} : {message: BaseMessage, userId: string}) {
    const isSender = (userId === message.sender.nickname);
    const channel_color = "bg-blue-50";
    const user_color = "bg-purple-50";

    const channel_border = "border-blue-200";
    const user_border = "border-purple-200";

    const message_bkg_color = isSender ? user_color : channel_color;
    const message_border = isSender ? user_border : channel_border;

    const messageContainsYoutubeLink = new RegExp(/youtu/g).test(message.message);
    const youtubeLinkIsShort = new RegExp(/youtu.be/g).test(message.message);
    const youtubeVideoId = (
        messageContainsYoutubeLink ?
            youtubeLinkIsShort ?
                message.message.match(/(?<=be\/)(.*)(?=\?si)/)?.[0]
        :
            message.message.match(/(?<=\?v=)(.*)/)?.[0] : ""
    );
    const youtubeLink = messageContainsYoutubeLink ? message.message.match(/https:[^\s]*/g)?.[0] : "";

    return (
        <div className={`max-w-sm ${message_bkg_color} p-2 rounded-xl ${message_border} border-2 ` + (isSender ? "self-end ml-10": "mr-10")}>
            <b> {!isSender && message.sender.nickname + " : "} </b> {message.message}
            {messageContainsYoutubeLink && (
                <a target="_blank" href={youtubeLink} rel="noopenner noreferrer">
                    <Image width={200} height={150} src={`https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`} alt="youtube video miniature"/>
                </a>
            )}
        </div>
    )
}