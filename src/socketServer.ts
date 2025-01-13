let onlineUsers = [];

const socketServer = (socket: any, io: any) => {
  // user joins or opens the application
  socket.on("join", (user: any) => {
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some((user: any) => user.user_id)) {
      // console.log(`user ${user} is now online`);
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    // console.log({ onlineUsers });
    // send online users to frontend
    io.emit("get-online-users", onlineUsers);
    // send socket id
    io.emit("setup socket", socket.id);
  });

  //   socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(
      (user: any) => user.socketId !== socket.id
    );
    // console.log("User has just disconnected");
    io.emit("get-online-users", onlineUsers);
  });

  //  join a room - join a conversation
  socket.on("join conversation", (conversation: any) => {
    socket.join(conversation);
  });

  // send and receive message
  socket.on("send message", (message: any) => {
    let conversation = message.conversation;

    if (!conversation.users) return;
    conversation.users.forEach((user: any) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  //   typing
  socket.on("typing", (conversation: any) => {
    // console.log(`typing: ${conversation}`);
    socket.in(conversation).emit("typing", conversation);
  });

  // stop typing
  socket.on("stop typing", (conversation: any) => {
    // console.log(`stop typing: ${conversation}`);
    socket.in(conversation).emit("stop typing");
  });

  // call
  socket.on("call user", (data: any) => {
    // console.log(data);
    let userId = data?.userToCall;
    let userSocketId = onlineUsers.find((user: any) => {
      return user.userId == userId;
    });
    // console.log(userSocketId);
    // console.log(userId);
    io.to(userSocketId.socketId).emit("call user", {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });
  //   answer call
  socket.on("answer call", (data: any) => {
    io.to(data.to).emit("call accept", data.signal);
  });

  // end call
  socket.on("end call", (id: any) => {
    console.log(id);
    io.to(id).emit("end call", { message: "call ended" });
  });
};

export default socketServer;
