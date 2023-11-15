// gets initial data from dummyJSON and renders it in HTML doc
fetch('https://dummyjson.com/posts')
  .then(res => res.json())
  .then(function (response) {
    createPosts(response.posts);
  });

// defines area for posts to appear in
const mainPage = document.getElementById("posts");

// turns posts into HTML objects
function createPosts(data) {
  for (let obj of data) {
    let newPost = document.createElement("div");
    newPost.classList.add("post");
    let title = document.createElement("h2");
    title.innerText = obj.title;
    let body = document.createElement("p");
    body.innerText = obj.body;
    let tags = document.createElement("span");
    //puts commas and spaces between tags
    let text = "";
    for (i = 0; i < obj.tags.length; i++) {
      text = text + obj.tags[i] + ", ";
    }
    text = text.slice(0, text.length - 2);
    tags.innerText = text;
    //creates likes button and counter
    let react = document.createElement("div");
    let img = document.createElement("img");
    img.src = "images/thumb.jpg";
    let likes = document.createElement("button");
    likes.innerText = obj.reactions;
    react.append(img, likes);
    react.addEventListener("click", () => {
      likes.innerText = parseInt(likes.innerText) + 1;
    });
    newPost.append(title, body, tags, react);
    mainPage.append(newPost);
  }
}

// defines fields in form to add new posts
const newTitle = document.getElementById("newTitle");
const newBody = document.getElementById("newBody");
const newTags = document.getElementById("newTags");
const addPost = document.getElementById("addPost");
addPost.addEventListener("click", addNew);

// cannot get createPosts to work on the form data for some reason so the code is repetitive here :(
function addNew() {
  if (newTitle.value === "" || newBody.value === "" || newTags.value === "") {
    return;
  }
  let newPost = document.createElement("div");
  newPost.classList.add("post");
  let title = document.createElement("h2");
  title.innerText = newTitle.value;
  let body = document.createElement("p");
  body.innerText = newBody.value;
  let tags = document.createElement("span");
  tags.innerText = newTags.value;
  let react = document.createElement("div");
  let img = document.createElement("img");
  img.src = "images/thumb.jpg";
  let likes = document.createElement("button");
  likes.innerText = 0;
  react.append(img, likes);
  react.addEventListener("click", () => {
    likes.innerText = parseInt(likes.innerText) + 1;
  });
  newPost.append(title, body, tags, react);
  mainPage.append(newPost);
  newTitle.value = "";
  newBody.value = "";
  newTags.value = "";
}