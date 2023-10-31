fetch('https://dummyjson.com/posts')
  .then(res => res.json())
  .then(function (response) {
    createPosts(response.posts);
  });


const mainPage = document.getElementById("posts");

function createPosts(data) {
  for (let obj of data) {
    let newPost = document.createElement("div");
    newPost.classList.add("post");
    let title = document.createElement("h2");
    title.innerText = obj.title;
    let body = document.createElement("p");
    body.innerText = obj.body;
    let tags = document.createElement("span");
    let text = ""
    for (i = 0; i < obj.tags.length; i++) {
      text = text + obj.tags[i] + ", ";
    }
    text = text.slice(0, text.length - 2);
    tags.innerText = text;
    newPost.append(title, body, tags);
    mainPage.append(newPost);
  }
}

