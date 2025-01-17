import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

import NotificationsLoader from "../../components/loaders/UserLoader";
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
          console.log('CONVS----', res.data);
        } else {
          console.log('error fetching conversations', res.error);
        }
      })
    }

    // return () => {
    //   socket.disconnect();
    // }
  }, [authUser]);

  // const handleJoin = async () => {
  //   const socket = io('http://localhost:5000');
  //   socket.emit('joinConversation', conversationId);
  // }

  const hanadleSelectConv = (conversationId) => {
    navigate(`/discussions/${conversationId}`);
  }

  const dummy = [
    { userName: 'alberto', last: 'Do you come to the party on wednesday ?', img: '', id: 1 },
    { userName: 'lisa', last: 'Do you come to the party on wednesday ?', img: '', id: 2 },
    { userName: 'omar', last: 'Do you come to the party on wednesday ?', img: '', id: 3 },
    { userName: 'danielA', last: 'Do you come to the party on wednesday ?', img: '', id: 4 },
    { userName: 'francisco86', last: 'Do you come to the party on wednesday ?', img: '', id: 5 },
    { userName: 'cristinaFayel', last: 'Do you come to the party on wednesday ?', img: '', id: 6 },
  ]

  return (
    <div className="w-screen scrollbar-none overflow-y-auto border-x">
      <header className="flex items-center justify-between px-3 pt-3 pb-4 sticky top-0 border-b bg-white/70 backdrop-blur-lg z-10">
        <h1 className="text-lg text-neutral font-bold">Discussions</h1>
        {/* <button
          className="btn btn-xs btn-error text-base-100"
          onClick={(ev) => { deleteAll() }}
        >
          <span className="hidden sm:block">{deletingAll ? '•••' : 'Delete all'}</span>
          <FaTrashAlt />
        </button> */}
      </header>
      {/* {isPending &&
        <>
          <NotificationsLoader />
          <NotificationsLoader />
          <NotificationsLoader />
        </>
      } */}
      {conversations.length === 0 &&
        <p className="text-center text-secondary font-bold">No discussions yet</p>
      }
      {conversations.length > 0 && (
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              className="flex gap-2 md:hover:bg-base-300 cursor-pointer p-3 border-b"
            >
              <div className="avatar">
                <div
                  className="size-12 rounded-md overflow-hidden"
                >
                  <img src={conv.img || avatar} />
                </div>
              </div>
              <div className="">
                <p className="text-sm text-neutral font-bold">@{conv.userName}</p>
                <p className="text-xs opacity-60 font-semibold my-1">{conv.last}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DiscussionsPage;