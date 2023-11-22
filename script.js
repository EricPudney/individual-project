// defines area for posts to appear in and array for storing posts
const mainPage = document.getElementById("posts");
const postStorage = [];

// defines new posts as objects
let newMsg = {};

// defines fields in form to add new posts
const newTitle = document.getElementById("newTitle");
const newBody = document.getElementById("newBody");
//const newTags = document.getElementById("newTags");
const newTags = document.getElementsByClassName("tagbox");
const addPost = document.getElementById("addPost");
addPost.addEventListener("click", addNew);

// gets initial data from local storage and adds it to array
if (localStorage.length > 0) {
  for (let i = 0; i < localStorage.length; i++) {
    let item = localStorage.getItem(localStorage.key(i));
    let obj = JSON.parse(item);
    postStorage.push(obj);
  }
// sorts stored posts by likes and renders them
  postStorage.sort((a, b) => b.reactions - a.reactions);
  renderPosts(postStorage);
}
// if no data is found in local storage, it is fetched from dummyJSON here
else {
  fetch('https://dummyjson.com/posts')
    .then(res => res.json())
    .then(function (response) {
      fillArray(response.posts);
    });
}

/* populates array from JSON data, sorts it by likes, and sends it to be rendered
 (see below for explanation of the repetition) */
function fillArray(data) {
  for (let obj of data) {
    const newObj = {};
    newObj.title = obj.title;
    newObj.body = obj.body; 
//the 5 lines below puts commas and spaces between tags - done below for new posts
    let text = "";
    for (i = 0; i < obj.tags.length; i++) {
      text += obj.tags[i] + ", ";
    }
    text = text.slice(0, text.length - 2);
    newObj.tags = text;
    newObj.reactions = obj.reactions;
    postStorage.push(newObj);
  }
  postStorage.sort((a, b) => b.reactions - a.reactions);
  renderPosts(postStorage);
}

// uses array to create HTML elements for each post
function renderPosts(arr) {
  for (let i = 0; i < arr.length; i++) {
    let newPost = document.createElement("div");
    newPost.classList.add("post");
    let title = document.createElement("h2");
    title.innerText = arr[i].title;
    let body = document.createElement("p");
    body.innerText = arr[i].body;
    let tags = document.createElement("span");
    tags.innerText = arr[i].tags;
    //creates clickable like button and counter
    let react = document.createElement("div");
    let img = document.createElement("img");
    img.src = "images/thumb.jpg";
    let likes = document.createElement("button");
    likes.innerText = arr[i].reactions;
    react.append(img, likes);
    react.addEventListener("click", () => {
      arr[i].reactions = parseInt(arr[i].reactions + 1);
      likes.innerText = arr[i].reactions;
      savePosts();
    });
    newPost.append(title, body, tags, react);
    mainPage.append(newPost);
  }
}

// adds new posts and saves array of posts to local storage
function addNew() {
// checks text fields have not been left blank
  if (newTitle.value === "" || newBody.value === "") {
    alert ("Please fill in the required fields");
    return;
  }
/* defines new post object, newMsg, to be added to array from user input.
 Tags dealt with first to avoid unnecessarily setting other values if tags
 have not been chosen */
  else {
    let newTagtxt = "";
    let tagEntered = false;
    for (let i = 0; i < newTags.length; i++) {
      if (newTags[i].checked === true) {
        if (!tagEntered) {
          newTagtxt += newTags[i].name;
          tagEntered = true;
        }
        else {
          newTagtxt += (", " + newTags[i].name);
        }
    }
    }
/* checks for 1+ tags before adding new post at the start of the array/top of the page
 (on refresh, new posts are sorted by reactions along with all other posts) - this seemed 
 to me to be the best way to handle new posts, although it does mean that the code for sorting 
 posts is repeated rather than being included in the renderPosts() function */
    if (!tagEntered) {
      alert("Please choose at least one tag");
      return;
  }
    newMsg.tags = newTagtxt;
    newMsg.title = newTitle.value;
    newMsg.body = newBody.value;
    newMsg.reactions = 0;
    postStorage.unshift(newMsg);
    mainPage.innerHTML = "";
    newTitle.value = "";
    newBody.value = "";
    renderPosts(postStorage);
    savePosts();
  }
}

// saves posts to local storage (after reaction or new post added)
function savePosts() {
  localStorage.clear();
  for (i = 0; i < postStorage.length; i++) {
    localStorage.setItem("post" + i, JSON.stringify(postStorage[i]));
  }
}