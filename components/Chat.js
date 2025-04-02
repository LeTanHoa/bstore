// // pages/Chat.js
// "use client";
// import { useEffect, useState, useCallback } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { CloseOutlined } from "@ant-design/icons";

// let socket;
// if (typeof window !== "undefined") {
//   socket = io("http://localhost:8000");
// }

// export default function Chat({ userId, role, isChatOpen, setIsChatOpen }) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [isSending, setIsSending] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const [unreadCounts, setUnreadCounts] = useState({});

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!isMounted || !userId || !socket) return;

//     socket.on("connect", () => {
//       console.log("Connected to Socket.IO server");
//     });
//     socket.on("connect_error", (err) => {
//       console.error("Socket.IO connection error:", err.message);
//     });

//     socket.emit("joinChat", { userId });

//     socket.on("receiveMessage", (newMessage) => {
//       console.log("Received message:", newMessage);
//       setMessages((prev) => {
//         const exists = prev.some((msg) => msg._id === newMessage._id);
//         return exists ? prev : [...prev, newMessage];
//       });

//       if (role === "admin" && !newMessage.isRead) {
//         setUnreadCounts((prev) => ({
//           ...prev,
//           [newMessage.sender._id]: (prev[newMessage.sender._id] || 0) + 1,
//         }));
//       }
//     });

//     socket.on("updateMessages", (updatedMessages) => {
//       console.log("Received updated messages:", updatedMessages);
//       setMessages(updatedMessages);
//     });

//     socket.on("error", (error) => {
//       console.error("Socket error:", error);
//     });

//     if (role === "admin") {
//       axios.get("http://localhost:8000/api/users").then((res) => {
//         setUsers(res.data);
//       });
//     }

//     axios.get(`http://localhost:8000/api/messages/${userId}`).then((res) => {
//       setMessages(res.data);
//     });

//     return () => {
//       socket.off("receiveMessage");
//       socket.off("updateMessages");
//       socket.off("error");
//       socket.off("connect");
//       socket.off("connect_error");
//     };
//   }, [isMounted, userId, role]);

//   const sendMessage = useCallback(() => {
//     if (message.trim() && userId && !isSending && socket) {
//       setIsSending(true);
//       if (role === "admin" && !selectedUserId) {
//         console.error("Please select a user to send message");
//         setIsSending(false);
//         return;
//       }
//       const payload = {
//         senderId: userId,
//         receiverId: role === "admin" ? selectedUserId : null,
//         content: message,
//       };
//       socket.emit("sendMessage", payload);

//       const tempMessage = {
//         _id: Date.now().toString(),
//         sender: { _id: userId, username: "You" },
//         receiver: { _id: payload.receiverId },
//         content: message,
//         isRead: false,
//       };
//       setMessages((prev) => [...prev, tempMessage]);
//       setTimeout(() => setIsSending(false), 300);
//       setMessage("");
//     }
//   }, [message, userId, role, selectedUserId, isSending]);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const selectUser = (userId) => {
//     setSelectedUserId(userId);
//     setUnreadCounts((prev) => ({
//       ...prev,
//       [userId]: 0,
//     }));
//     axios.get(`http://localhost:8000/api/messages/${userId}`).then((res) => {
//       setMessages(res.data);
//     });
//   };

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <div
//       className={
//         role === "admin"
//           ? "flex flex-col gap-3 md:gap-0 md:flex-row h-[95vh] rounded-xl overflow-hidden"
//           : "flex h-full"
//       }
//     >
//       {role === "admin" && (
//         <div className="w-full md:w-1/4  md:h-full  border-r bg-gray-50">
//           <div className="p-4 border-b">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Danh sách người dùng
//             </h2>
//           </div>
//           <div className="overflow-y-auto h-[250px] md:h-[calc(100vh-120px)]">
//             {users.map((user) => (
//               <div
//                 key={user._id}
//                 onClick={() => selectUser(user._id)}
//                 className={`p-4 cursor-pointer transition-colors duration-150 border-b
//                   ${
//                     selectedUserId === user._id
//                       ? "bg-blue-50 border-l-4 border-l-blue-500"
//                       : "hover:bg-gray-100"
//                   }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="flex-shrink-0">
//                     <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
//                       <span className="text-white font-medium">
//                         {user.username.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-sm font-medium text-gray-900">
//                         {user.username}
//                       </h3>
//                       {unreadCounts[user._id] > 0 && (
//                         <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                           {unreadCounts[user._id]}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-500">User ID: {user._id}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div
//         className={role === "admin" ? "w-full md:w-3/4" : "w-full rounded-xl"}
//       >
//         <div className="h-full flex flex-col">
//           <div className="p-4 border-b bg-white">
//             <h1 className="text-xl font-bold text-gray-800">
//               {role === "admin" ? (
//                 selectedUserId ? (
//                   `Chat với ${
//                     users.find((u) => u._id === selectedUserId)?.username ||
//                     "User"
//                   }`
//                 ) : (
//                   <span className="text-red-500">
//                     Chọn user để bắt đầu chat
//                   </span>
//                 )
//               ) : (
//                 <div className="flex justify-between items-center gap-2">
//                   <span>Hỗ trợ nhanh</span>
//                   <CloseOutlined
//                     className="text-black cursor-pointer"
//                     onClick={() => setIsChatOpen(false)}
//                   />
//                 </div>
//               )}
//             </h1>
//           </div>

//           <div
//             className={
//               role === "admin"
//                 ? "h-[420px]  md:h-full overflow-y-auto p-4 bg-gray-50"
//                 : "flex-1 overflow-y-auto p-4 bg-gray-50"
//             }
//           >
//             <div className="space-y-4">
//               {messages.map((msg, index) => (
//                 <div
//                   key={msg._id || index}
//                   className={`flex ${
//                     msg.sender._id === userId ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`relative max-w-[60%] p-3 rounded-lg shadow-sm
//                       ${
//                         msg.sender._id === userId
//                           ? "bg-blue-500 text-white"
//                           : "bg-white text-gray-800"
//                       }`}
//                   >
//                     <p className="text-sm font-medium mb-1">
//                       {msg.sender._id === userId
//                         ? "You"
//                         : msg.sender.username || "Unknown"}
//                     </p>
//                     <p className="text-sm">{msg.content}</p>
//                     {!msg.isRead && msg.sender._id !== userId && (
//                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                         Chưa đọc
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="p-4 border-t bg-white">
//             <div className="flex space-x-4">
//               <input
//                 type="text"
//                 value={message}
//                 onKeyDown={handleKeyDown}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Nhập tin nhắn..."
//                 className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={role === "admin" && !selectedUserId}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={role === "admin" && !selectedUserId}
//                 className={`px-6 py-2 rounded-lg font-medium
//                   ${
//                     role === "admin" && !selectedUserId
//                       ? "bg-gray-300 cursor-not-allowed"
//                       : "bg-blue-500 hover:bg-blue-600 text-white"
//                   }`}
//               >
//                 Gửi
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { View, Text } from "react-native";
import React from "react";

const Chat = () => {
  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
};

export default Chat;
