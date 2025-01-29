import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import { TbSend, TbArrowLeftToArc, TbTrash, TbMessageDots } from "react-icons/tb";
import { RiBearSmileFill } from "react-icons/ri";
import { BsFillPatchCheckFill } from "react-icons/bs";

import EmojiPicker from "../../components/general/EmojiPicker";
import PostLoader from "../../components/loaders/PostLoader";
import avatar from "../../assets/images/avatar.png"

const PostDetailsPage = () => {

  const navigate = useNavigate();
  const { id: postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const queryClient = useQueryClient();

  const inputRef = useRef(null);
  const [commentUI, setCommentUI] = useState(null);

  const { data: post, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ['post'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/posts/status/${postId}`);
        const { data } = res;
        // const comments = data.user._id === authUser._id
        //   ? data.comments
        //   : data.comments.filter((comment) => comment.user._id === authUser._id)
        // data.myComments = comments;

        return data;
      } catch (err) {
        throw err;
      }
    },
    retry: false
  })

  useEffect(() => {
    refetch()
  }, [postId, refetch])

  const { mutate: reply, isPending: replying, isError: isReplyErr, error: replyErr } =
    useMutation({
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
        queryClient.invalidateQueries({ queryKey: ['post'] });
        toast('reply posted', {
          icon: <TbSend className="text-xl" />,
          style: {
            backgroundColor: '#E91C51',
            color: '#fff',
            fontSize: '14px'
          }
        });
      }

    })

  const { mutate: deleteComment, isPending: deleting } = useMutation({
    mutationFn: async (commentId) => {
      try {
        const res = await axios.delete(`/api/posts/comment/${post._id}/delete/${commentId}`);
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      toast('Reply deleted', {
        icon: <BsFillPatchCheckFill className="text-xl" />,
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
          fontSize: '14px'
        }
      });
    }
  })

  const { mutate: deletePost, isPending: deletingPost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete(`/api/posts/${post._id}`);
        const { data } = res;

        return data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast('Post deleted', {
        icon: <BsFillPatchCheckFill className="text-xl" />,
        style: {
          backgroundColor: '#E91C51',
          color: '#fff',
          fontSize: '14px'
        }
      });
    },
  })

  const [conversation, setConversation] = useState({});
  const handleChat = (recipientId) => {
    const socket = io('http://localhost:5000');
    socket.emit('startConversation', { 
      userId:authUser._id,
      recipientId,
    }, (res) => {
      if (res.success) {
        setConversation(res.data);
        navigate(`/discussions/${res.data._id}`,
          {state: res.data}
        );
      }
    })
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    reply();
  }

  const handleInput = (ev) => {
    const textarea = ev.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  if (isError) {
    return (
      <div className="flex flex-1 justify-center">No post found</div>
    );
  }

  return (
    <>
      <div className="pb-[20%] h-screen px-3 flex-1 scrollbar-none overflow-y-auto overflow-x-hidden">
        <div className="flex gap-4 items-center bg-[#e91c51]/5 sticky top-0 backdrop-blur-lg z-10 rounded-2xl">
          <div className="flex flex-1 gap-3 h-[56px] p-3 pb-4 items-center">
            <Link
              onClick={() => {navigate(-1)}}
              className=""
            >
              <TbArrowLeftToArc className="size-6" />
            </Link>
            <p className="font-bold text-lg">Post</p>
          </div>
        </div>
        {(isFetching || isPending) && (<PostLoader />)}
        {/* post */}
        {(!isFetching && !isPending) && post && (
          <div className="bg-base-100 pt-3 pb-10 mt-5 rounded-2xl">
            <div
              className="flex flex-col gap-2 pb-4"
            >
              <div className="flex gap-2 px-3">
                <div className="avatar">
                  <Link
                    to={`/profile/${post.user.userName}`}
                    className="size-12 rounded-md overflow-hidden"
                  >
                    <img src={post.user.profileImg || avatar} />
                  </Link>
                </div>
                <div className="flex-1">
                  <Link
                    to={`/profile/${post.user.userName}`}
                    className="text-md"
                  >
                    <p className="font-bold text-neutral">{post.user.fullName}</p>
                    <p className="text-gray-700">@{post.user.userName}</p>
                  </Link>
                </div>
                {post.user._id === authUser._id && (
                  <button
                    className={`flex justify-center items-center text-xl text-neutral size-8 rounded-full 
                        ${!deletingPost && 'md:hover:bg-primary/10'}`}
                    onClick={() => {
                      deletePost();
                      navigate(-1);
                    }}
                  >
                    {deletingPost
                      ? <span className="loading loading-spinner loading-sm text-primary"></span>
                      : <TbTrash className="text-primary text-md" />
                    }
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 px-3 overflow-hidden">
                <pre className="text-md font-sans text-neutral">{post.text}</pre>
                {post.file.type === 'image' && (
                  <div className=" w-full max-h-96">
                    <img
                      src={post.file.src}
                      className="w-auto h-96 rounded-xl border border-gray-300 bg-[#ececf0]"
                      alt="Image"
                    />
                  </div>
                )}
              </div>
              <p className="text-gray-700 tracking-tighter text-xs font-semibold opacity-75 underline-offset-8 px-3">
                {new Date(post.createdAt).toDateString()}
              </p>
            </div>
            {/* form */}
            {!(post.user._id === authUser._id) && (
              <div className="flex gap-4 mt-0 border-t px-3 pt-3">
                <div className="avatar size-10 rounded-md overflow-hidden">
                  <img src={post.user.profileImg || avatar} />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-sm">Replying to <span className="text-neutral font-bold">@{post.user.userName}</span></p>
                  <form
                    className="flex flex-col gap-1 py-2"
                    onSubmit={handleSubmit}
                  >
                    <textarea
                      className="w-full text-sm resize-none border-none overflow-hidden focus:outline-none bg-transparent"
                      placeholder="Post your reply..."
                      ref={inputRef}
                      name="comment"
                      onInput={handleInput}
                    />
                    {isReplyErr && <p className="max-w-64 text-sm text-error font-bold">{replyErr}</p>}
                    <div className="flex justify-between text-info items-center">
                      <EmojiPicker inputRef={inputRef} />
                      <button className="btn btn-neutral rounded-md btn-sm text-white">
                        {replying ? (
                          '•••'
                        ) : (
                          'Reply'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* replies header */}
            <div className="flex items-center gap-2 border-y py-3 px-3">
              <div className="badge bg-slate-200 text-slate-700 rounded-lg py-[11px] gap-1">
                <TbSend className="text-lg" />
                {post.comments.length}
              </div>
              <div className="badge bg-slate-200 text-slate-700 py-[12px] rounded-lg gap-1">
                <RiBearSmileFill className="text-lg" />
                {post.likes.length}
              </div>
              {/* <p className=" text-xs font-bold text-primary">
                All the replies
              </p> */}
            </div>
            <div className="flex flex-col">
              {post.comments && post.comments.map((comment) => (
                <div key={comment._id} className="flex flex-col gap-2 px-3 py-4 items-start border-b">
                  {/* post user info */}
                  <div className="flex w-full gap-2">
                    <div className="avatar">
                      <div className="size-10 rounded-md">
                        <Link to={`/profile/${comment.user.userName}`}>
                          <img src={comment.user.profileImg || avatar} />
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-1">
                      <Link to={`/profile/${comment.user.userName}`}>
                        <p className="text-sm font-bold">{comment.user.fullName}</p>
                        <p className="text-gray-600 text-sm">@{comment.user.userName}</p>
                      </Link>
                    </div>
                    {comment.user._id === authUser._id && (
                      <button
                        className={`flex items-center justify-center text-neutral text-lg size-8 
                        ${!deleting && 'md:hover:bg-red-200'} rounded-full`}
                        onClick={() => {
                          setCommentUI(comment._id);
                          deleteComment(comment._id);
                        }}
                      >
                        {deleting && commentUI === comment._id
                          ? <span className="loading loading-spinner loading-sm text-primary"></span>
                          : <TbTrash className="text-primary" />
                        }
                      </button>
                    )}
                  </div>
                  {/* post text/file */}
                  <pre className="text-sm font-sans">{comment.text}</pre>
                  {/* chat access if auth */}
                  {!(comment.user._id === authUser._id) &&
                    (<button
                      className="flex gap-1 items-center text-primary text-sm font-bold cursor-pointer rounded-full md:hover:bg-primary/10"
                      onClick={() => {handleChat(comment.user._id)}}
                    >
                      chat
                      <TbMessageDots className="text-lg" />
                    </button>)
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}


export default PostDetailsPage;