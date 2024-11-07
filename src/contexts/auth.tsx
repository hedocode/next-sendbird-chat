"use client"; 

import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorageSync } from "../hooks/useLocalStorageSync";
import { SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { BaseMessage } from "@sendbird/chat/message";

const Context = createContext("auth");

export function AuthProvider(
  { APP_ID, children }
  : { APP_ID: string, children: ReactNode }
) {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState("");

  const [messages, setMessages] = useState<BaseMessage[]>([])

  const [sb, setSb] = useState<SendbirdOpenChat|SendbirdGroupChat>();
  
  // Let's consider it's not really "sensitive" data.
  // We have to do that if we want to keep it when refreshing.
  useLocalStorageSync('userId', userId, setUserId);
  useLocalStorageSync('accessToken', accessToken, setAccessToken);

  const value = { 
    userId, setUserId,
    accessToken, setAccessToken,
    sb, setSb,
    messages, setMessages,
    APP_ID
  };

  return (
    <Context.Provider value={value}>{children}</Context.Provider>
  );
}

export function useAuthContext() : {
  userId : string,
  setUserId: Function,
  accessToken: string,
  setAccessToken: Function,
  sb: SendbirdOpenChat|SendbirdGroupChat,
  setSb: Function,
  messages: BaseMessage[],
  setMessages: Function,
  APP_ID: string
} {
  return useContext(Context);
}