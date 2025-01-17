import { useRef, useState } from "react";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { PiLegoSmileyBold } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

const EmojiPicker = ({ inputRef }) => {

  const [emojiPicker, setEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
		let text = inputRef.current.value.split('');
		const cursor = inputRef.current.selectionStart;
		const prev = text.slice(0, cursor);
		const post = text.slice(cursor);

		inputRef.current.value = [...prev, emoji.native, ...post].join('');
		// setEmojiPicker(!emojiPicker);

	}

  return (
    <div className="hidden md:block">
      <PiLegoSmileyBold
        className="size-5 cursor-pointer text-primary"
        onClick={() => {
          setEmojiPicker(!emojiPicker);
        }}
      />
      {emojiPicker && (
        <div className="absolute flex flex-col z-20">
          <IoCloseSharp
            className="bg-red-500 text-white self-end rounded-md w-7 h-6 cursor-pointer z-30"
            onClick={() => { setEmojiPicker(false) }}
          />
          <Picker
            data={emojiData}
            onEmojiSelect={addEmoji}
          />
        </div>
      )}
    </div>
  )
}

export default EmojiPicker;