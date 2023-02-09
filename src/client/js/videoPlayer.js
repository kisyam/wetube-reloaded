const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = async () => {
    playBtnIcon.classList = "fas fa-play";
    video.paused = video.pause();
    const { id } = videoContainer.dataset;
    await fetch(`/api/videos/${id}/view`, { method: "POST" });
};

//handleMouseMove 와 로직이 겹친다. 함수를 하나 만들어야 할까?
const handleControlsKeep = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
};

const handleKeydown = (event) => {
    if (event.code === "Space") {
        return handlePlayClick();
    }
};

// ⌛️ space 정지, 재생 구현
// ✅ video 화면 클릭시 정지, 재생 구현 + 클릭 했을 때 애니메이션 추가
// ✅ video 끝나면 재생버튼으로 아이콘 바꾸기
// ✅ video 화면 더블클릭시 fullScreen 구현

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("dblclick", handleFullscreen);
video.addEventListener("ended", handleEnded);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
videoControls.addEventListener("mouseover", handleControlsKeep);
document.addEventListener("keydown", handleKeydown, true);
