const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll("#newDeleteCommentBtn");
const editBtns = document.querySelectorAll("#newEditCommentBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id; //* comment objectId
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const control = document.createElement("div");
    control.className = "control";
    const icon2 = document.createElement("i");
    icon2.className = "fas fa-trash";
    icon2.id = "newDeleteCommentBtn";
    const icon3 = document.createElement("i");
    icon3.className = "fas fa-pen";
    icon3.id = "newEditCommentBtn";
    control.appendChild(icon3);
    control.appendChild(icon2);
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(control);
    videoComments.prepend(newComment);
    const newDeleteCommentBtn = document.querySelector("#newDeleteCommentBtn");
    newDeleteCommentBtn.addEventListener("click", handleDelete);
};

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

const handleEdit = async (event) => {
    const comment = event.target.parentNode.parentNode;
    const commentId = parentNode.dataset.id;
    const text = comment.innerText;
    const response = await fetch(`/api/comments/${commentId}/edit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", //! json string이라는 것을 알려줌.
        },
        body: JSON.stringify({ text }),
    });
};

const handleEditBtn = (event) => {
    const comment = event.target.parentNode.parentNode.childNodes[1];
    comment.classList.add("edit-line");
    comment.contentEditable = true;
    event.target.className = "fas fa-check";
    event.target.removeEventListener("click", handleEditBtn);
    event.target.addEventListener("click", handleEdit);
};

const handleDelete = async (event) => {
    const parentNode = event.target.parentNode.parentNode;
    const commentId = parentNode.dataset.id;
    console.log(commentId);
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
    });
    if (response.status === 403) {
        return;
    }

    if (response.status === 200) {
        parentNode.remove();
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", handleDelete);
    });
}
if (editBtns) {
    editBtns.forEach((editBtn) => {
        editBtn.addEventListener("click", handleEditBtn);
    });
}
