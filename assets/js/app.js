
const cl=console.log;
const postscontainer=document.getElementById('postscontainer');
const postsform=document.getElementById('postsform');
const titlecontrol=document.getElementById('title');
const contentcontrol=document.getElementById('content');
const useridcontrol=document.getElementById('userid');
const submitBtn  = document.getElementById('submitBtn');
const updateBtn  = document.getElementById('updateBtn');
const loader =document.getElementById('loader');

const BASE_URL=`https://jsonplaceholder.typicode.com`;

const POSTS_URL=`${BASE_URL}/posts`;

const snackBar = (msg,icon) => {
   swal.fire({
      title : msg,
      icon : icon,
      timer : 2500
   })
}


//fetch data

const createPostsCards = (arr) => {
        let result = ``;
        for(let i=0; i<arr.length; i++){
           result+=`
               <div class="card mb-3" id=${arr[i].id}>
                <div class="card-header">
                    <h4 class='mb-0'>${arr[i].title}</h4>
                </div>
                <div class="card-body">
                   <p class='mb-0'>${arr[i].body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-info" onClick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onClick="onRemove(this)">Remove</button>
                </div>
               </div>
           `
        }
        postscontainer.innerHTML = result;
}

const createCard = (postObj) => {
    let card = document.createElement('div');
    card.className = 'card mb-3';
    card.id = postObj.id;
    card.innerHTML = `
          <div class="card-header">
                <h4 class='mb-0'>${postObj.title}</h4>
            </div>
            <div class="card-body">
               <p class='mb-0'>${postObj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-sm btn-info" onClick="onEdit(this)">Edit</button>
                <button class="btn btn-sm btn-danger" onClick="onRemove(this)">Remove</button>
            </div>
    `;

    postscontainer.append(card)
}

const fetchPosts = () => {
    loader.classList.remove('d-none')
    fetch(POSTS_URL,{
        method : 'GET',
        body : null,
        headers : {
            "Auth" : "Token bearer from local storage"
        }
    })
      .then(res =>{
         return res.json() //promise
      })
      .then(res =>{
        cl(res) //we get data
        createPostsCards(res);
      })
      .catch(err => {snackBar(err, 'error')})
      .finally(()=>{
        loader.classList.add('d-none')
      })
    
}

fetchPosts()

//create data

const onPostSubmit = (eve) => {
    eve.preventDefault();
    let postObj = {
        title : titlecontrol.value,
        body : contentcontrol.value,
        userId : useridcontrol.value
    }
    loader.classList.remove('d-none')
    fetch(POSTS_URL,{
        method : 'POST',
        body : JSON.stringify(postObj),
        headers : {
            "Auth" : "Token bearer from local storage"
        }
    })
    .then((res) => {
       return res.json()
    })
    .then(res => {
        postObj.id = res.id;
        createCard(postObj)
        snackBar(`card with ${postObj.title} is created successfully !!!`, 'success')
    })
    .catch(err => {snackBar(err, 'error')})
    .finally(()=>{
        postsform.reset();
        loader.classList.add('d-none');
      })
}

const onEdit = (ele) => {
    let EDIT_ID = ele.closest('.card').id;
    localStorage.setItem('edit-id',EDIT_ID)
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`;

    fetch(EDIT_URL, {
        method : "GET",
        body : null,
        headers : {
            "Auth" : "Token bearer from local storage"
        }
    })
     .then(res => res.json)
     .then(res => {
        cl(res)
     })
     .catch(err => {snackBar(err, 'error')})
}

postsform.addEventListener('submit', onPostSubmit);