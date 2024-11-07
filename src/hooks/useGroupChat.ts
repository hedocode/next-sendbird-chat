"use client"; 

import { useEffect, useState } from "react";
import { GroupChannel, GroupChannelListQuery, GroupChannelListQueryParams, QueryType } from "@sendbird/chat/groupChannel";
import axios from "axios";
import { useAuthContext } from "@/contexts/auth";

/**
 * # Channel data provider
 * @param params 
 * @param messageWrapperRef 
 * @returns 
 */
export function useGroupChat(
    currentChannel?: GroupChannel|null,
    setCurrentChannel?: Function,
    params?: Promise<{ type: string, channel_url?: string }>,
) {
    const { userId, accessToken, sb } = useAuthContext();
    
    const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);

    
    function loadOpenChannels() {
        (async () => {
            
            const groupChannelsFromServer = (await axios.get("/api/channels/group")).data;
            
            setGroupChannels(groupChannelsFromServer)
        })()
    }
    useEffect( loadOpenChannels, [] );

    function connectToAppAndLoadChannel() {
        if(userId && accessToken && sb) {
            (async () => {
                await sb.connect(userId, accessToken);

                // const params: GroupChannelListQueryParams = {
                //     userIdsFilter: {
                //       userIds: [userId],
                //       queryType: QueryType.OR,
                //     }
                // };
                // const query: GroupChannelListQuery = sb.groupChannel.createMyGroupChannelListQuery(params);
                
                // // Only channel A is returned in a result list through the groupChannels parameter of the callback function.
                // const channels: GroupChannel[] = await query.next();
                // console.log("channels : %o", channels);
                // setGroupChannels(channels);

                
                if (params){
                    let { channel_url } = (await params);
                    if (channel_url) {
                        channel_url = decodeURI(channel_url);
                        console.log("sb : ", sb);
                        const urlChannel = await sb.groupChannel.getChannel(channel_url);
                        
                        if (urlChannel.isPublic) {
                            await urlChannel.join();
                        }
        
        
                        // const res = (await axios.post("/api/channels/open", { name: "general", channel_url: "general"}));
                        setCurrentChannel(urlChannel);
                    }
                }
            })()
        }
    }
    useEffect( connectToAppAndLoadChannel, [userId, accessToken, sb, currentChannel] )

    
    function isCurrentChannel(channel: GroupChannel) {
        return channel.name === currentChannel?.name;
    }
    
    return {
        groupChannels,
        currentChannel,
        isCurrentChannel
    };
}