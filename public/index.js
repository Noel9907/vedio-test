const socket = io("/");
const peer = new Peer();

peer.on("open", (id) => {
  socket.emit("newUser", id);
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    addVideo(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const vid = document.createElement("video");
      call.on("stream", (userStream) => {
        addVideo(vid, userStream);
      });
      call.on("error", (err) => {
        alert(err);
      });
    });

    socket.on("userJoined", (id) => {
      console.log("new user joined");
      const call = peer.call(id, stream);
      const vid = document.createElement("video");
      call.on("stream", (userStream) => {
        addVideo(vid, userStream);
      });
      call.on("error", (err) => {
        alert(err);
      });
    });
  })
  .catch((err) => {
    alert(err.message);
  });

function addVideo(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  document.getElementById("videoDiv").append(video);
}
