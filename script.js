// defines area for posts to appear in and array for storing posts
const mainPage = document.getElementById("posts");
// let used rather than const to allow reassignment from locally stored array
let postStorage = [];

// adds functionality to dropdown menu to filter posts by tag
const filter = document.getElementById("filter");
filter.addEventListener("change", newFilter);

// defines fields in form to add new posts
const newTitle = document.getElementById("newTitle");
const newBody = document.getElementById("newBody");
const newTags = document.getElementsByClassName("tagbox");
const addPost = document.getElementById("addPost");
addPost.addEventListener("click", addNew);

// gets post data from local storage and parses it
if (localStorage.getItem("posts") !== null) {
  let posts = localStorage.getItem("posts");
  postStorage = JSON.parse(posts);
  // sorts stored posts by likes and renders them
  postStorage.sort((a, b) => b.reactions - a.reactions);
  renderPosts(postStorage);
}
// if no data is found in local storage, it is fetched from dummyJSON here
else {
  fetch("https://dummyjson.com/posts")
    .then((res) => res.json())
    .then(function (response) {
      fillArray(response.posts);
    });
}

/* populates array from JSON data, sorts it by likes, and sends it to be rendered
 (see below for explanation of repetitive code for sorting) */
function fillArray(data) {
  for (let obj of data) {
    const newObj = {};
    newObj.title = obj.title;
    newObj.body = obj.body;
    //the 5 lines below put commas and spaces between tags - done in addNew for new posts
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
    let dltBtn = document.createElement("button");
    dltBtn.innerText = "X";
    //creates clickable like button and counter - save to local storage on clicking 'like'
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
    dltBtn.addEventListener("click", () => {
      arr.splice(i, 1);
      savePosts();
      mainPage.innerHTML = "";
      renderPosts(postStorage);
    });
    newPost.append(title, body, dltBtn, tags, react);
    mainPage.append(newPost);
  }
}

// adds new posts and saves all posts to local storage
function addNew() {
  // checks text fields have not been left blank
  if (newTitle.value === "" || newBody.value === "") {
    alert("Please fill in the required fields");
    return;
  } else {
    /* defines new post object to be added to array from user input.
 Tags dealt with first to avoid unnecessarily setting other values if tags
 have not been chosen */
    let newTagtxt = "";
    let tagEntered = false;
    for (let i = 0; i < newTags.length; i++) {
      if (newTags[i].checked === true) {
        if (!tagEntered) {
          newTagtxt = newTags[i].name;
          tagEntered = true;
        } else {
          newTagtxt += ", " + newTags[i].name;
        }
      }
    }
    /* checks for 1+ tags before adding new post at the top of the page. On refresh, new posts 
    are sorted by reactions along with all other posts). This seemed  to me to be the best way 
    to handle new posts, although it means that the code for sorting  posts is repeated rather 
    than being included in the renderPosts() function */
    if (!tagEntered) {
      alert("Please choose at least one tag");
      return;
    }
    const newMsg = {};
    newMsg.tags = newTagtxt;
    newMsg.title = newTitle.value;
    newMsg.body = newBody.value;
    newMsg.reactions = 0;
    postStorage.unshift(newMsg);
    mainPage.innerHTML = "";
    newTitle.value = "";
    newBody.value = "";
    for (let box of newTags) {
      box.checked = false;
    }
    renderPosts(postStorage);
    savePosts();
  }
}

// saves posts to local storage (after reaction or new post added)
function savePosts() {
  localStorage.clear();
  localStorage.setItem("posts", JSON.stringify(postStorage));
}

// filters posts by tags/resets filter
function newFilter(e) {
  mainPage.innerText = "";
  let tag = e.target.value;
  if (tag === "all") {
    renderPosts(postStorage);
  } else {
    let filteredArray = postStorage.filter((post) => post.tags.includes(tag));
    renderPosts(filteredArray);
  }
}
