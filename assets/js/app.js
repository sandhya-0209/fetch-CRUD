var cl=console.log;

const postsContainer=document.getElementById("postsContainer");
const postForm=document.getElementById("postForm");
const titleControl=document.getElementById("title");
const contentControl=document.getElementById("content");
const userIdControl=document.getElementById("userId");
const addbtn=document.getElementById("addbtn");
const updatebtn=document.getElementById("updatebtn");
const loader=document.getElementById("loader");

const BASE_URL=`https://jsonplaceholder.typicode.com/`;

const POST_URL=`${BASE_URL}/posts`;

const snackBar=(title,icon)=>{
    swal.fire({
        title:title,
        icon:icon,
        timer:2000,
    })
}

const createAllPost=(array)=>{
    let result="";
    array.forEach(element => {
        result+=`
                <div class="card mb-4" id="${element.id}">
                    <div class="card-header">
                        <h2>${element.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${element.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-sm btn-outline-success" onclick="onEdit(this)">Edit</button>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div>
                </div>
        `
    });
    postsContainer.innerHTML=result;
}

const createSinglePost=(post)=>{
    let card=document.createElement("div");
    card.className='card mb-4';
    card.id=post.id;
    card.innerHTML=`
                <div class="card-header">
                    <h2>${post.title}</h2>
                </div>
                <div class="card-body">
                    <p>${post.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-sm btn-outline-success" onclick="onEdit(this)">Edit</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                </div>
    
    `;
    postsContainer.append(card);
}


const fetchData=()=>{
    loader.classList.remove("d-none");
    fetch(POST_URL,{
        method:"GET",
        body:null,
        headers:{
            "Auth":"token",
            "Content-type":"Application/json",
        }
    })
     .then(res=>{
        return res.json()
     })
     .then(data=>{
        createAllPost(data);
     })
     .catch((err)=>{
        cl(err);
     })
     .finally(()=>{
        loader.classList.add("d-none");
     })
}

fetchData();

const onPostForm=(eve)=>{
    eve.preventDefault();

    let postObj={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value,
    }
    loader.classList.remove("d-none");
    fetch(POST_URL,{
        method:"POST",
        body:JSON.stringify(postObj),
        headers:{
            "Auth":"token",
            "content-type":"Application/json",
        }
    })
    .then(res=>{
       return res.json()
    })
    .then(data=>{
       
        createSinglePost(data);
        snackBar("the card is added successFully in database!!!","success");
        
    })
    .catch((err)=>{
        cl(err);
    })
    .finally(()=>{
        loader.classList.add("d-none");
    })
}

const onEdit=(ele)=>{
    //get id;

    let EDIT_ID=ele.closest(".card").id;
    localStorage.setItem("editId",EDIT_ID);
    

    //create url to Api call

    let EDIT_URL=`${POST_URL}/${EDIT_ID}`;
    loader.classList.remove("d-none");
    fetch(EDIT_URL,{
        method:"GET",
        body:null,
        headers:{
            "Auth":"token",
            "Content-type":"Application/json",
        }
    })
     .then(res=>{
        return res.json();
     })
     .then(data=>{ 
        titleControl.value=data.title;
        contentControl.value=data.body;
        userIdControl.value=data.userId;

        window.scrollBy({top:-50000,behavior:"smooth"});

     })
     .catch(err=>{
        cl(err);
     })
     .finally(()=>{
        addbtn.classList.add("d-none");
        updatebtn.classList.remove("d-none");
        loader.classList.add("d-none");
     })
}

const onUpdateBtn=()=>{
    //get id from backend db

    let UPDATE_ID=localStorage.getItem("editId");

    let UPDATE_POST={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value,
    }

    //url

    let UPDATE_URL=`${POST_URL}/${UPDATE_ID}`;
    loader.classList.remove("d-none");
    fetch(UPDATE_URL,{
        method:"PATCH",
        body:JSON.stringify(UPDATE_POST),
        headers:{
            "Auth":"token",
            "Content-type":"Application/json",
        }
    })
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        
        let card=[...document.getElementById(UPDATE_ID).children];

        card[0].innerHTML=`<h2>${UPDATE_POST.title}</h2>`;
        card[1].innerHTML=`<p>${UPDATE_POST.body}</p>`;

        snackBar("the card is updated successFully!!!","success");

        window.scrollBy({top:50000,behavior:"smooth"});
    })
    .catch(err=>{
        cl(err);
    })
    .finally(()=>{
        updatebtn.classList.add("d-none");
        addbtn.classList.remove("d-none");
        loader.classList.add("d-none");
    })
}

const onRemove=(ele)=>{
    //get id;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
    
            let REMOVE_Id=ele.closest(".card").id;

            let REMOVE_URL=`${POST_URL}/${REMOVE_Id}`;
            loader.classList.remove("d-none");
            fetch(REMOVE_URL,{
                method:"GET",
                body:null,
                headers:{
                    "Auth":"token",
                    "Content-type":"Application/json",
                }
            })
            .then(res=>{
                return res.json();
            })
            .then(data=>{
                ele.closest(".card").remove();
                snackBar("the card is removed successFully!!!","success");
            })
            .catch((err)=>{
                cl(err);
            })
            .finally(()=>{
                loader.classList.add("d-none");
            })
        }
    });
}

postForm.addEventListener("submit",onPostForm);
updatebtn.addEventListener("click", onUpdateBtn);