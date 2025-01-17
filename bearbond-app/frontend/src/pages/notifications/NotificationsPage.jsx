import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { TbMessage2 } from "react-icons/tb";
import { TbSend } from "react-icons/tb";
import { RiBearSmileLine, RiBearSmileFill } from "react-icons/ri";
import { HiReply } from "react-icons/hi";
import { FaInfoCircle } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import { PiTrashBold } from "react-icons/pi";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { BsFillPatchExclamationFill } from "react-icons/bs";

import NotificationsLoader from "../../components/loaders/UserLoader";
import avatar from "../../assets/images/avatar.png";

const NotificationsPage = () => {

  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const {data:authUser} = useQuery({queryKey:['authUser']});

  const [notifUI, setNotifUI] = useState(null);

  const {data:notifications, isPending, isError, error} = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/notifications/');
        const {data} = res;
        return data; 
      } catch (err) {
        throw err;
      }
    },
    retry: false
  })

  const {mutate:deleteAll, isPending:deletingAll} = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete('/api/notifications/');
        const {data} = res;
        return data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
      toast(data.message, {
        icon: <BsFillPatchCheckFill className="text-xl" />,
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
          fontSize: '14px'
        }
      });
    }
  })

  const {mutate:deleteNotif, isPending:deletingNotif} = useMutation({
    mutationFn: async (notifId) => {
      try {
        const res = await axios.delete(`/api/notifications/${notifId}`);
        const {data} = res;
        return data;
      } catch (err) {
        throw err; 
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
      toast(data.message, {
        icon: <BsFillPatchCheckFill className="text-xl" />,
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
          fontSize: '14px'
        }
      });
    }
  })

  const {mutate:readNotif, isPending:reading} = useMutation({
    mutationFn: async (notifId) => {
      try {
        const res = await axios.post(`/api/notifications/read/${notifId}`);
        const data = {res};
        return data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
    }
  })

  const {mutate:unreadNotif, isPending:unreading} = useMutation({
    mutationFn: async (notifId) => {
      try {
        const res = await axios.post(`/api/notifications/unread/${notifId}`);
        const data = {res};
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
    }
  })

  const handleClickNotif = (notif) => {
    readNotif(notif._id);
    try {
      navigate(`/status/${notif.post._id}`);
    } catch (err) {
      toast(`post deleted`, {
        icon: <BsFillPatchExclamationFill />, 
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
          fontSize: '14px'
        }
      });
    }
  }


  return (
    <div className="flex-[4_4_0] min-h-screen scrollbar-none overflow-y-auto border-x">
      <header className="flex items-center justify-between px-3 pt-3 pb-4 sticky top-0 border-b bg-white/70 backdrop-blur-lg z-10">
        <h1 className=" text-lg text-neutral font-bold">Notifications</h1>
        <button 
          className="btn btn-xs btn-primary text-base-100"
          onClick={(ev) => {deleteAll()}}
        >
          <span className="hidden sm:block">{deletingAll? '•••': 'Delete all'}</span>
          <FaTrashAlt />
        </button>
      </header>
      {isPending &&
        <>
          <NotificationsLoader />
          <NotificationsLoader />
          <NotificationsLoader />
        </>
      }
      {notifications?.length === 0 &&
      <p className="text-center text-secondary font-bold">No notifications yet</p>
      }
      {notifications?.length > 0 &&
        <ul className="">
          {notifications.map((notif) => (
            <li
              key={notif._id} 
              className="flex gap-2 md:gap-4 items-center border-b p-2 md:p-3 hover:bg-base-200 cursor-pointer"
              onClick={() =>{handleClickNotif(notif)}}
            >
              <div className="flex gap-1">
                <div className={`${!notif.read?'bg-info':'bg-transparent'} size-2 rounded-full`}></div>
                {notif.type === 'like' &&
                  <RiBearSmileFill className="text-2xl text-[#e91c51]" />
                }
                {notif.type === 'comment' &&
                  <TbSend className="text-2xl text-info" />
                }
              </div>
              <img 
                  className="size-10 object-cover rounded-md" 
                  src={notif.from.profileImg? notif.from.profileImg: avatar} 
              />
              <div className="self-start flex-1">
                <p className="font-bold text-sm md:text-md">@{notif.from.userName}</p>
                <p className={`text-sm ${!notif.read? 'font-bold': ''}`}>
                  {notif.type === 'like' && 'ask to bond!'}
                  {notif.type === 'comment' && 'replied to your post'}
                </p>
              </div>
              <div className="flex gap-1 items-center">
                <button 
                  className="btn btn-xs btn-neutral rounded-md text-base-100"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    unreadNotif(notif._id);
                  }}
                >Unread</button>
                <button
                  className={`text-neutral text-xl p-2 ${!deleteNotif && 'md:hover:bg-red-200'} rounded-full z-50`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setNotifUI(notif._id)
                    deleteNotif(notif._id);
                  }}
                >
                  {deletingNotif && notifUI === notif._id
                    ? <span className="loading loading-spinner loading-sm text-primary"></span>
                    : <PiTrashBold className="text-primary" />
                  }
                </button>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default NotificationsPage;