"use client"; 

import axios from "axios";
import { RefObject, UIEvent, useEffect, useMemo, useState } from "react";
import { BaseChannel, User } from '@sendbird/chat'
import { OpenChannel, OpenChannelHandler, OpenChannelListQuery } from '@sendbird/chat/openChannel';
import { GroupChannel, GroupChannelCreateParams } from "@sendbird/chat/groupChannel";
import { BaseMessage, MessageTypeFilter, PreviousMessageListQuery, PreviousMessageListQueryParams, UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import { useAuthContext } from "../contexts/auth";

/**
 * # Channel data provider
 * @param params 
 * @param messageWrapperRef 
 * @returns 
 */
export function useChannels(
    params: Promise<{ type: string, channel_url?: string }>,
    messageWrapperRef: RefObject<HTMLElement>
) {
    const { userId, accessToken, sb, sbGroup, sbOpen } = useAuthContext();


    // ## States

    // Storing channels 
    const [openChannels, setOpenChannels] = useState<OpenChannel[]>([]);
    const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);
    
    const [currentChannel, setCurrentChannel] = useState<GroupChannel|OpenChannel|null>(null);
    const [currentChannelType, setCurrentChannelType] = useState("open");
    const channelsToDisplay = useMemo(
        () => currentChannelType === "open" ? openChannels : groupChannels
        , [currentChannel]
    );

    const [channelParticipants, setChannelParticipants] = useState<User[]>([]);
    const [ignoreScrollTo, setIgnoreScrollTo] = useState(false);
    
    // Messages management
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

    async function goPrivate(targetUserId: string) {
        // https://sendbird.com/docs/chat/sdk/v4/javascript/channel/creating-a-channel/create-a-channel#2-group-channel
        const params: GroupChannelCreateParams = {
            invitedUserIds: [userId, targetUserId],
            name: userId + " and " + targetUserId,
            channelUrl: userId + "_" + targetUserId,
            isDistinct: true,
        };
        const channel: GroupChannel = await sb.groupChannel.createChannel(params);
        console.log("newGroupChannel : %o", channel);
        await channel.join();
        setCurrentChannel(channel);
    }

    function isCurrentChannel(channel: OpenChannel|GroupChannel) {
        return channel.name === currentChannel?.name;
    }


    // ## Effects


    useEffect(
        () => {
            (async () => {
                const { type } = await params;
                setCurrentChannelType(type);
            })()
        }
    )

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


    function loadGroupChannels() {
        (async () => {
            const groupChannelsFromServer = (await axios.get("/api/channels/group")).data;
            
            setGroupChannels(groupChannelsFromServer)
        })()
    }
    useEffect( loadGroupChannels, [] );


    function connectToAppAndLoadChannel() {
        if(userId && accessToken && sb) {
            (async () => {
                let { channel_url } = (await params);
                // setCurrentChannelType(type);

                await sb.connect(userId, accessToken);

                // setOpenChannels((await axios.get("/api/channels/open")).data)

                // https://sendbird.com/docs/chat/sdk/v4/javascript/channel/retrieving-channels/retrieve-a-list-of-channels
                
                if (currentChannelType === "open" && sb.openChannel) {
                    const query: OpenChannelListQuery = sb.openChannel.createOpenChannelListQuery();
                    if (query.hasNext) {
                        const channels: OpenChannel[] = await query.next();
                        setOpenChannels(channels);
                    }
                }

                // Couldn't get groups using the SDK
                // const groupChannelCollection: GroupChannelCollection = sb.groupChannel.createGroupChannelCollection({
                //     // filter: groupChannelFilter,
                //     // order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
                //     // // ...
                // });
                // if (groupChannelCollection.hasMore) {
                //     const channels: GroupChannel[] = await groupChannelCollection.loadMore();
                //     console.log("groupChannels : %o", groupChannelCollection);
                //     setGroupChannels(channels);
                // }

                
                if (channel_url) {
                    channel_url = decodeURI(channel_url);
                    let urlChannel;
                    console.log("currentChannelType:  %o", currentChannelType);
                    if (currentChannelType === "open" && sb.openChannel) {
                        urlChannel = await sb.openChannel.getChannel(channel_url);
                        await urlChannel.enter();
                        const participants = await (await urlChannel.createParticipantListQuery({
                            limit: 25,
                        }).next());
                        setChannelParticipants(participants);
                    } else {
                        console.log("channel_url : %o", channel_url);
                        console.log("sb : %o", sb);
                        console.log("sbGroup : %o", sbGroup);
                        console.log("sbOpen : %o", sbOpen);
                        urlChannel = await sb.groupChannel.getChannel(channel_url);
                        console.log("url Chanel : %o", urlChannel);
                        if (urlChannel.isPublic) {
                            await urlChannel.join();
                        }
                    }
    
    
                    // const res = (await axios.post("/api/channels/open", { name: "general", channel_url: "general"}));
                    setCurrentChannel(urlChannel);
                }
            })()
        }
    }
    useEffect( connectToAppAndLoadChannel, [userId, accessToken, sb, currentChannel, currentChannelType] )


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

    
    function listenMessagesAndParticipantsChanges() {
        if(messages.length) {

            if (currentChannelType === "open") {
                const channelHandler = new OpenChannelHandler({
                    onMessageReceived: customAddMessage,
                    onChannelParticipantCountChanged: (channels) => {
                        (async () => {
                            if(currentChannel) {
                                const participants = await (await currentChannel.createParticipantListQuery({
                                    limit: 25,
                                }).next());
                                setChannelParticipants(participants);
                            }
                        })()
                    }
                });

                sb.openChannel.addOpenChannelHandler("WATCH_MESSAGES", channelHandler);
            } else {

            }
        }
    }
    useEffect(listenMessagesAndParticipantsChanges, [messages, currentChannel]);


    return {
        groupChannels,
        channelParticipants,
        messages,
        channelsToDisplay,
        currentChannelType, setCurrentChannelType,
        messageDraft, setMessageDraft,
        ignoreScrollTo, setIgnoreScrollTo,
        sendMessage, goPrivate, isCurrentChannel, loadOlderMessages,
    };
}