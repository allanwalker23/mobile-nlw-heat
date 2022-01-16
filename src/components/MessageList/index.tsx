import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  ScrollView
} from 'react-native';
import { api } from '../../services/api';
import { MESSAGES_EXAMPLE } from '../../utils/messages';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagesQueue : MessageProps[] =MESSAGES_EXAMPLE;

const socket = io(String(api.defaults.baseURL))
socket.on('new_message', (newMessage)=>{
  messagesQueue.push(newMessage);
  console.log(newMessage)
})

export function MessageList(){
  const [currentMessage,setCurrentMessage] = useState<MessageProps[]>([]);

  useEffect(()=>{
    async function fetchMessages() {
      const messageResponse = await api.get<MessageProps[]>('/messages/last3');
      setCurrentMessage(messageResponse.data)
    }
    fetchMessages();
   
  },[])

  useEffect(()=>{
    const timer = setInterval(()=>{
      if(messagesQueue.length > 0){
        setCurrentMessage(prevState => [messagesQueue[0],prevState[0], prevState[1]]);
        messagesQueue.shift();
      }

      return () => clearInterval(timer)
    },3000)
  },[])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.container} 
    keyboardShouldPersistTaps="never">
      {currentMessage.map((message => <Message key={message.id} data={message}/> ))}
       
       
    </ScrollView>
  );
}