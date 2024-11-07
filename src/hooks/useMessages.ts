"use client"; 

import { RefObject, UIEvent, useEffect, useState } from "react";
import { GroupChannel, SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { BaseMessage, MessageTypeFilter, PreviousMessageListQuery, PreviousMessageListQueryParams, UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import { BaseChannel } from "@sendbird/chat";
import { OpenChannel } from "@sendbird/chat/openChannel";

/**
 * # Channel data provider
 * @param params 
 * @param messageWrapperRef 
 * @returns 
 */
export function useMessages(
    currentChannel: GroupChannel|OpenChannel|null,
    messageWrapperRef: RefObject<HTMLElement>
) {
    // Messages management
    const [ignoreScrollTo, setIgnoreScrollTo] = useState(false);
    const [messages, setMessages] = useState<BaseMessage[]>([])
    const [msgQuery, setMsgQuery] = useState<PreviousMessageListQuery>();
    const [messageDraft, setMessageDraft] = useState("");

    // ## Functions
    function addMessage(message: BaseMessage|UserMessage) {
        const newMessagesList = [...messages];
        newMessagesList.push(message);
        setMessages(newMessagesList);
    };

    function customAddMessage(channel: BaseChannel, message: BaseMessage|UserMessage) {
        addMessage(message);
    };

    
    async function loadOlderMessages(event: UIEvent<HTMLDivElement>) {
        setIgnoreScrollTo(true);
        if (event.currentTarget.scrollTop == 0) {
            if(msgQuery && msgQuery.hasNext) {
                const moreMessages = await msgQuery.load();
                setMessages([...moreMessages, ...messages])
            }
        }
    }

    
    function sendMessage() {
        const params: UserMessageCreateParams = { message: messageDraft };
        
        currentChannel?.sendUserMessage(params)
            // .onPending(
            //     (message: UserMessage) => {
            //         console.log("pending : %o", message);
            //     }
            // )
            // .onFailed(
            //     (err: Error, message: UserMessage) => {
            //         console.log("failed : %o", message);
            //     }
            // )
            .onSucceeded(
                (message) => {
                    // console.log("success : %o", message);
                    addMessage(message);
                }
            )
        ;
            
        setMessageDraft("");
    }
    
    async function deleteMessage(groupSB:SendbirdGroupChat, channel_url: string, message: UserMessage) {
        const channel: GroupChannel = await groupSB.groupChannel.getChannel(channel_url);

        await channel.deleteMessage(message);
        setMessages([...messages].filter(m => m !== message));
    }

    // If on bottom and new messages incoming,
    // scroll to last, unless we just loaded older ones.
    function scrollToLastMessage() {
        const msgWrapperElement = messageWrapperRef.current
        if(ignoreScrollTo) {
            setIgnoreScrollTo(false);
        }
        if (msgWrapperElement && !ignoreScrollTo) {
            msgWrapperElement.scrollTo(
                0, msgWrapperElement.scrollHeight
            )
        }
    }
    useEffect(scrollToLastMessage, [messages]);

    function loadCurrentChannelMessages() {
        if (currentChannel) {
            (async () => {
                const params: PreviousMessageListQueryParams = {
                    limit: 25,
                    reverse: false,
                    messageTypeFilter: MessageTypeFilter.ALL,
                    includeReactions: true,
                    // ...
                };
                const query: PreviousMessageListQuery = currentChannel.createPreviousMessageListQuery(params);
                try {
                    const messagesFromServer: BaseMessage[] = await query.load();
                    setMessages(messagesFromServer)
                    setMsgQuery(query)
                } catch(e) {
                    // Handle error
                }
            })();
        }
    }
    useEffect(loadCurrentChannelMessages, [currentChannel]);
    
    return {
        messages,
        msgQuery,
        messageDraft, setMessageDraft,
        addMessage,
        customAddMessage,
        loadOlderMessages,
        sendMessage,
        deleteMessage
    };
}