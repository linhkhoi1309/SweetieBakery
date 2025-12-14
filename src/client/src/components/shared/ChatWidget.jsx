import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null); // Ref để auto scroll xuống cuối tin nhắn

  const botResponses = [
    "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
    'Bạn có thể xem menu sản phẩm tại trang "Sản Phẩm" nhé!',
    "Để đặt hàng, vui lòng thêm sản phẩm vào giỏ hàng và thanh toán.",
    'Chúng tôi có ưu đãi đặc biệt cho khách hàng mới. Hãy kiểm tra trang "Ưu Đãi"!',
    "Thời gian giao hàng là 2-3 ngày làm việc tùy khu vực.",
  ];

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#F7B5D5] hover:bg-[#F7B5D5]/90 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[500px] shadow-xl z-50 flex flex-col bg-white text-gray-900 rounded-xl border">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F7B5D5] to-[#FFF0D9] text-white p-4 rounded-t-xl grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 border-b">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src="https://i.pravatar.cc/100?img=10" />
                  <AvatarFallback>SB</AvatarFallback>
                </Avatar>
                <div>
                  {/* Title */}
                  <h4 className="text-white text-base font-semibold leading-none">
                    SweetieBakery
                  </h4>
                  <p className="text-xs text-white/80 mt-1">
                    Online • Trả lời ngay
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className=" text-white font-bold hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1 p-0 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 break-words ${
                        message.sender === "user"
                          ? "bg-[#F7B5D5] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          message.sender === "user"
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t bg-gray-50/80 backdrop-blur-sm">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                Câu hỏi nhanh:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white hover:bg-gray-50 h-7"
                  onClick={() => setInputValue("Làm sao để đặt hàng?")}
                >
                  Làm sao để đặt hàng?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white hover:bg-gray-50 h-7"
                  onClick={() => setInputValue("Có ưu đãi gì không?")}
                >
                  Có ưu đãi gì không?
                </Button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex h-10 w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B5D5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#F7B5D5] hover:bg-[#F7B5D5]/90 rounded-full h-10 w-10 p-0 flex items-center justify-center shrink-0"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
