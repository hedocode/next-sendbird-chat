"use client"; 

import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorageSync } from "../hooks/useLocalStorageSync";
import { SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { BaseMessage } from "@sendbird/chat/message";


export type AuthType = {
  userId : string,
  setUserId: Function,
  accessToken: string,
  setAccessToken: Function,
  openSB: SendbirdOpenChat,
  setOpenSB: Function,
  groupSB: SendbirdGroupChat,
  setGroupSB: Function,
  messages: BaseMessage[],
  setMessages: Function,
  APP_ID: string
}

const Context = createContext<AuthType|null>(null);

export function AuthProvider(
  { APP_ID, children }
  : { APP_ID: string, children: ReactNode }
) {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState("");

  const [messages, setMessages] = useState<BaseMessage[]>([])

  const [openSB, setOpenSB] = useState<SendbirdOpenChat>();
  const [groupSB, setGroupSB] = useState<SendbirdGroupChat>();
  
  // Let's consider it's not really "sensitive" data.
  // We have to do that if we want to keep it when refreshing.
  useLocalStorageSync('userId', userId, setUserId);
  useLocalStorageSync('accessToken', accessToken, setAccessToken);

  const value = { 
    userId,
    setUserId,
    accessToken,
    setAccessToken,
    openSB,
    setOpenSB,
    groupSB,
    setGroupSB,
    messages,
    setMessages,
    APP_ID
  } as AuthType;

  return (
    <Context.Provider value={value}>{children}</Context.Provider>
  );
}

export function useAuthContext() : AuthType|null {
  return useContext(Context);
}