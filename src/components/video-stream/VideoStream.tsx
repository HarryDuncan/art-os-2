export const VideoStream = () => {
  return (
    <div>
      <h1>Live Video Stream</h1>
      <img
        src="http://127.0.0.1:8000/video_feed"
        alt="Live Video Stream"
        style={{ width: "100%", maxWidth: "640px", border: "1px solid #ccc" }}
      />
    </div>
  );
};
