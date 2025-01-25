import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { TbSend2, TbArrowLeftToArc } from "react-icons/tb";
import { PiLegoSmileyBold } from "react-icons/pi";

import avatar from "../../assets/images/avatar.png";

const Chat = () => {

  const navigate = useNavigate();
  const { id: conversationId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const handleInput = (ev) => {
    const textarea = ev.target;
    textarea.style.height = '36px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const inputRef = useRef(null);
  const [messages, setMessages] = useState(null);
  const [dest, setDest] = useState(null);

  const socket = io('http://localhost:5000');
  useEffect(() => {
    if (authUser && authUser._id) {
      socket.emit('getMessages', { conversationId }, (res) => {
        if (res.success) {
          const sendTo = res.data.participants
            .filter((user)=>user._id !== authUser._id);
          setDest(sendTo[0]);
          setMessages(res.data.messages);
        }
      })
    }

    // return () => {
    //   socket.disconnect();
    // }
  }, [authUser]);
  

  const handleSendMsg = (text) => {
    const socket = io('http://localhost:5000');
    socket.emit('sendMessage', {
      conversationId,
      senderId: authUser._id,
      text: text.replace(/\n+$/, ''),
    }, (res) => {
      if (res.success) {
        setMessages((prevMsgs) => [...prevMsgs, res.data])
      }
    })
  }

  return (
    <div className="w-screen h-screen overflow-hidden px-3 flex flex-col bg-base-100 border-l">
      <header className="flex items-center gap-3 p-3 pb-4 sticky top-0 bg-primary/5 backdrop-blur-lg z-10 rounded-2xl">
        <Link
          onClick={() => { navigate(-1) }}
        >
          <TbArrowLeftToArc className="size-6" />
        </Link>
        <h1 className="text-lg text-neutral font-bold">
          {dest && dest.userName}
        </h1>
        {/* <button
              className="btn btn-xs btn-error text-base-100"
              onClick={(ev) => { deleteAll() }}
            >
              <span className="hidden sm:block">{deletingAll ? '•••' : 'Delete all'}</span>
              <FaTrashAlt />
            </button> */}
      </header>

      {/* Chat ------------------------*/}
      <div className="flex-1 scrollbar-none overflow-y-auto py-4">
        {messages && messages.length > 0 && (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${msg.sender[0]._id === authUser._id ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-md">
                  <img
                    alt="profile img"
                    src={msg.sender[0].profileImg || avatar} />
                </div>
              </div>
              <div className="chat-header font-bold">
                <time className="text-xs opacity-50">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </time>
              </div>
              <div 
                className={`chat-bubble text-sm text-base-100 ${msg.sender[0]._id === authUser._id ? 'bg-info': 'bg-slate-400'}`}
              >
                {msg.text.split('\n').map((line) => (
                  <span key={Math.floor(Math.random() * 10000)}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {/*  ------------------------ */}

      <div className="pb-2 mb-6 px-3 border rounded-md bg-slate-100">
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSendMsg(inputRef.current.value);
            inputRef.current.value = '';
          }}
        >
          <textarea
            className="h-9 py-2 w-full text-neutral bg-transparent text-xs resize-none rounded-sm border-none focus:outline-none"
            placeholder="Type your message..."
            ref={inputRef}
            onInput={handleInput}
          />
          <div className="flex w-full items-center justify-between">
            <PiLegoSmileyBold className="text-lg text-primary" />
            <button
              className="px-2 py-[2px] bg-primary text-white rounded-md"
            >
              <TbSend2 className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat;