const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#deleteCommentBtn");

const addComment = (text, commentId) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    span2.dataset.id = commentId;
    span2.dataset.videoId = videoContainer.dataset.id;
    span2.id = "newDeleteCommentBtn";
    span2.className = "video__comment-delete";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    const newDeleteCommentBtn = document.querySelector("#newDeleteCommentBtn");
    newDeleteCommentBtn.addEventListener("click", handleDelete);
};

// const deleteComment = (id) => {};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", //! json string이라는 것을 알려줌.
        },
        body: JSON.stringify({ text }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
};

const handleDelete = async () => {
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json", //! json string이라는 것을 알려줌.
        },
        body: JSON.stringify({ text }),
    });
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", handleDelete);
    });
}
