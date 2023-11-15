// defines area for posts to appear in and array for storing posts
const mainPage = document.getElementById("posts");
const postStorage =  [];

// gets initial data from dummyJSON and renders it in HTML doc
fetch('https://dummyjson.com/posts')
  .then(res => res.json())
  .then(function (response) {
    fillArray(response.posts);
  });

function fillArray(data) {
  for (let obj of data) {
    const newObj = {};
    newObj.title = obj.title;
    newObj.body = obj.body;
    newObj.tags = obj.tags;
    newObj.reactions = obj.reactions;
    postStorage.push(newObj);
  }
  renderPosts(postStorage);
}

function renderPosts(arr) {
  for (let i=0; i<arr.length; i++) {
    let newPost = document.createElement("div");
    newPost.classList.add("post");
    let title = document.createElement("h2");
    title.innerText = arr[i].title;
    let body = document.createElement("p");
    body.innerText = arr[i].body;
    let tags = document.createElement("span");
    //puts commas and spaces between tags
    let text = "";
    for (j = 0; j < arr[i].tags.length; j++) {
      text = text + arr[i].tags[j] + ", ";
    }
    text = text.slice(0, text.length - 2);
    tags.innerText = text;
    //creates likes button and counter
    let react = document.createElement("div");
    let img = document.createElement("img");
    img.src = "images/thumb.jpg";
    let likes = document.createElement("button");
    likes.innerText = arr[i].reactions;
    react.append(img, likes);
    react.addEventListener("click", () => {
      arr[i].reactions = parseInt(arr[i].reactions +1);
      likes.innerText = arr[i].reactions;
    });
    newPost.append(title, body, tags, react);
    mainPage.append(newPost);
  }
}

// turns posts into HTML objects - previously used to create posts directly from JSON object
/*function createPosts(data) {
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
}*/

// defines fields in form to add new posts
const newTitle = document.getElementById("newTitle");
const newBody = document.getElementById("newBody");
const newTags = document.getElementById("newTags");
const addPost = document.getElementById("addPost");
addPost.addEventListener("click", addNew);

// adds new posts and saves array of posts to local storage
let newMsg = { title: "", body: "", tags: "", reactions: 0 };
function addNew() {
  if (newTitle.value === "" || newBody.value === "" || newTags.value === "") {
    return;
  }
  else {
    newMsg.title = newTitle.value;
    newMsg.body = newBody.value; 
    newMsg.tags = newTags.value;
    newMsg.reactions = 0;
    postStorage.push(newMsg);
    renderPosts(postStorage);
    for (i=0; i<postStorage.length; i++) {
      localStorage.setItem("post" + i, JSON.stringify(postStorage[i]));
    }
  }
}

//localStorage.setItem("posts", JSON.stringify(postStorage));


