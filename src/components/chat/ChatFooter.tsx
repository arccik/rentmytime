import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { RiMailSendLine } from "react-icons/ri";
import { TfiFaceSmile } from "react-icons/tfi";
import data from "@emoji-mart/data"; // you can do this lazy loading
import Picker from "@emoji-mart/react"; // you can do this lazy loading
import type { Message } from "~/components/chat/ChatBody";

type PropType = {
  chatId: string | null;
  sendMessage: (data: Message) => void;
};

export default function ChatFooter({ chatId, sendMessage }: PropType) {
  const { data: userSession } = useSession();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleMessageSend = () => {
    if (!message || !userSession?.user.id || !chatId) return;
    sendMessage({
      message,
      recipientId: chatId,
      senderId: userSession.user.id,
      timestamp: Date.now(),
      isRead: false,
    });
    setMessage("");
  };
  const handleEmojiClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex h-auto w-full items-center justify-around  gap-3 bg-background/70  p-2  backdrop-blur-lg backdrop-saturate-150">
      {showEmojiPicker && (
        <div ref={wrapperRef} className="absolute bottom-16 left-5 z-50">
          <Picker
            data={data}
            theme="light"
            onEmojiSelect={(e: { native: string }) =>
              setMessage((prev) => prev.concat(e.native))
            }
          />
        </div>
      )}
      <TfiFaceSmile
        onClick={handleEmojiClick}
        size={30}
        className="cursor-pointer rounded-full  p-1 hover:bg-indigo-50"
      />

      <Input
        value={message}
        variant="bordered"
        autoFocus
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            void handleMessageSend();
          }
        }}
      />
      <RiMailSendLine
        size={30}
        onClick={() => void handleMessageSend()}
        className="-rotate-45 cursor-pointer rounded-full  p-1 hover:bg-indigo-50"
      />
    </div>
  );
}
