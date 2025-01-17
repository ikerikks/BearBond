import { Link } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";
import { TbSend } from "react-icons/tb";
import { PiLegoSmileyBold } from "react-icons/pi";

const Chat = () => {

  const handleInput = (ev) => {
    const textarea = ev.target;
    textarea.style.height = '36px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };


  return (
    <div className="w-screen scrollbar-none overflow-y-auto border-x flex flex-col justify-between pb-4">
      <header className="flex items-center gap-4 px-3 pt-3 pb-4 sticky top-0 border-b bg-white/70 backdrop-blur-lg z-10">
        <Link
          onClick={() => { navigate(-1) }}
        >
          <FaArrowLeft className="size-5 md:hover:bg-red-200" />
        </Link>
        <h1 className="text-lg text-neutral font-bold">Discussions</h1>
        {/* <button
              className="btn btn-xs btn-error text-base-100"
              onClick={(ev) => { deleteAll() }}
            >
              <span className="hidden sm:block">{deletingAll ? '•••' : 'Delete all'}</span>
              <FaTrashAlt />
            </button> */}
      </header>
      <div className="px-16">

        <form action="" className="flex items-center gap-2">
          <PiLegoSmileyBold className="text-2xl text-primary" />
          <textarea
            className="h-9 py-2 px-3 text-neutral bg-slate-100 w-full text-xs resize-none rounded-sm border-none focus:outline-none"
            placeholder="Type your message..."
            // ref={}
            onInput={handleInput}
          />
          <button
            className="px-4 py-1 bg-primary text-white rounded-lg"
          >
            <TbSend className="text-2xl" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat;