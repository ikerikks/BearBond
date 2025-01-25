import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

import NotifLoader from "../../components/loaders/UserLoader";
import avatar from "../../assets/images/avatar.png";

const DiscussionsPage = () => {

  const navigate = useNavigate();
  const {data:authUser} = useQuery({queryKey: ['authUser']});
  const [conversations, setConversations] = useState([]);

  const socket = io('http://localhost:5000');
  useEffect(() => {
    if (authUser && authUser._id) {
      socket.emit('getUserConversations', { userId: authUser._id }, (res) => {
        if (res.success) {
          setConversations(res.data);
        }
      })
    }

    // return () => {
    //   socket.disconnect();
    // }
  }, [authUser]);

  const hanadleSelectConv = (conversationId) => {
    navigate(`/discussions/${conversationId}`);
  }

  return (
    <div className="w-screen scrollbar-none overflow-y-auto bg-base-100 border-l px-3">
      <header className="flex items-center justify-between px-3 pt-3 pb-4 sticky top-0 
       bg-[#e91c51]/5 backdrop-blur-lg z-10 rounded-2xl">
        <h1 className="text-lg text-neutral font-bold">Discussions</h1>
        {/* <button
          className="btn btn-xs btn-error text-base-100"
          onClick={(ev) => { deleteAll() }}
        >
          <span className="hidden sm:block">{deletingAll ? '•••' : 'Delete all'}</span>
          <FaTrashAlt />
        </button> */}
      </header>
      {/* {conversations &&
        <>
          <NotifLoader />
          <NotifLoader />
        </>
      } */}
      {conversations.length === 0 &&
        <p className="text-center text-secondary font-bold">No discussions yet</p>
      }
      {conversations.length > 0 && (
        <ul className="mt-5">
          {conversations.map((conv) => (
            <li
              key={conv._id}
              className="flex gap-2 md:hover:bg-base-300 cursor-pointer p-3 border-b"
              onClick={() => navigate(`/discussions/${conv._id}`)}
            >
              <div className="avatar">
                <div
                  className="size-9 rounded-md overflow-hidden"
                >
                  <img src={conv.img || avatar} />
                </div>
              </div>
              <div className="">
                <p className="text-sm text-neutral font-bold">
                  {conv.participants.map((user) =>(
                    user._id !== authUser._id
                    && user.userName
                  ))}
                </p>
                <p className="text-xs opacity-60 font-semibold">
                  {conv.messages.length == 0 && ('no messages...')}
                  {conv.lastMessage && (
                    conv.lastMessage.text.split('').length > 40
                    ? conv.lastMessage.text.split('').splice(0, 39).join('') + '...'
                    : conv.lastMessage.text
                  )}
                </p>
              </div>
              <p className="text-[11px] self-end opacity-60 font-semibold flex-1 text-end">{conv.lastMessage && 
                new Date(conv.lastMessage.updatedAt).toLocaleDateString()
              }</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DiscussionsPage;