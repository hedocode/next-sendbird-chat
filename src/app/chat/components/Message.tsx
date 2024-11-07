import { BaseMessage } from "@sendbird/chat/message";
import Image from "next/image";


export default function Message({ message, userId, deleteMessage } : {message: BaseMessage, userId?: string, deleteMessage: Function}) {
    const isSender = (userId === message.sender.nickname);
    const channel_color = "bg-blue-50 dark:bg-blue-900";
    const user_color = "bg-indigo-50 dark:bg-indigo-900";

    const channel_border = "border-blue-200 dark:border-blue-800";
    const user_border = "border-indigo-200 dark:border-indigo-800";

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
        <div className={`message-item ${message_border} ${message_bkg_color} ` + (isSender ? "self-end ml-10" : "mr-10")}>
            <b> {!isSender && message.sender.nickname + " : "} </b> {message.message}
            <button
                className="delete-btn opacity-0"
                onClick={() => deleteMessage()}
            >
                x
            </button>
            {messageContainsYoutubeLink && (
                <a target="_blank" href={youtubeLink} rel="noopenner noreferrer">
                    <Image width={200} height={150} src={`https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`} alt="youtube video miniature"/>
                </a>
            )}
        </div>
    )
}