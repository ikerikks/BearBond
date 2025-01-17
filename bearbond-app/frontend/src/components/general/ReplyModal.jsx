import { QueryClient, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";

import { PiPaperPlaneTiltFill } from "react-icons/pi";

import EmojiPicker from "./EmojiPicker";
import toast from "react-hot-toast";

const ReplyModal = ({ post }) => {

  const queryClient = useQueryClient();
  const postOwner = post.user;
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const inputRef = useRef(null);
  const isCommenting = false;

  const { mutate: commentPost, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/posts/comment/${post._id}`, {
          comment: inputRef.current.value.trim()
        });
        const { data } = res;
        return data;
      } catch (err) {
        if (err.response) {
          throw err.response.data.error;
        } else {
          throw err.message;
        }
      }
    },
    onSuccess: () => {
      inputRef.current.value = null;
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast('reply posted', {
        icon: <PiPaperPlaneTiltFill className="text-xl" />,
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
          fontSize: '14px'
        }
      });
    }
  })

  const handleSubmit = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    commentPost();
  };

  const handleInput = (ev) => {
    const textarea = ev.target;
    textarea.style.height = '150px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <dialog id={`reply_modal${post._id}`} className="modal border-none outline-none cursor-default"
      onClick={(ev) => { ev.stopPropagation() }}>
      <div className="modal-box rounded-lg absolute top-10 px-4 py-2"
        onClick={(ev) => { ev.stopPropagation() }}>
        <form method="dialog" className="ml-[-10px] mt-2">
          <button
            className="btn btn-sm btn-circle btn-ghost text-xl"
          >✕</button>
        </form>
        <div className="mt-6">
          <div className="flex gap-2">
            <div className="h-11 w-1 bg-primary rounded-full"></div>
            <p className="">Replying to <span className="text-primary font-bold">@{postOwner.userName}</span></p>
          </div>
          <form
            className="flex flex-col gap-2 py-2"
            onSubmit={handleSubmit}
          >
            <textarea
              className="w-full h-[150px] text-lg resize-none border-none overflow-hidden focus:outline-none bg-transparent"
              placeholder="Post your reply..."
              ref={inputRef}
              name="comment"
              onInput={handleInput}
            />
            {isError && <p className="max-w-64 text-sm text-error font-bold">{error}</p>}
            <div className="flex justify-between text-info items-center">
              <EmojiPicker inputRef={inputRef} />
              <button className="btn btn-neutral btn-sm text-white self-start">
                {isPending ? '•••': 'Reply'}
              </button>
            </div>
          </form>
        </div>
      </div >
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none">close</button>
      </form>
      <Toaster toastOptions={{ duration: 1000 }} />
    </dialog >
  )
}

export default ReplyModal;