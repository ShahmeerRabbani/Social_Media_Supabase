const SUPABASE_URL = "https://wbgkzxqsuoxtflazvifg.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2t6eHFzdW94dGZsYXp2aWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODA5NzEsImV4cCI6MjA1Mjg1Njk3MX0.RkLMzbduu-u0C3A57k7fo8tEPcFdfMvA2RQn2OpNgU4";

const supabase_Api = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const login_email = document.getElementById("log-email");
const login_password = document.getElementById("log-pass");
const Sign_password = document.getElementById("sign-password");
const Sign_email = document.getElementById("sign-email");

const Logout = async() =>{
  const { error } = await supabase_Api.auth.signOut()
  if(error){
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error"
  });
  return;
}

window.location.href = 'index.html';
}

// Show password
function showPasswordSign() {
  const icon = document.getElementById("eye-icon")
  if (icon.classList.contains("fa-eye")) {
    Sign_password.type = 'text'
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
  else{
    Sign_password.type = 'password'
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
// Show password
function showPasswordLogin() {
  const icon = document.getElementById("eye-icon")
  if (icon.classList.contains("fa-eye")) {
    login_password.type = 'text'
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
  else{
    login_password.type = 'password'
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Login User handler-------------------------------------------
const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const { data: {user}, error } = await supabase_Api.auth.signInWithPassword({
      email: login_email.value,
      password: login_password.value,
    });
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error"
    });
      return;
    }

    const { data: userProfile, error: profileError } = await supabase_Api
      .from('user-information')
      .select('is_login')
      .eq('user_id', user.id)
      .single();

      if (profileError) {
        Swal.fire({
          title: "Error!",
          text: profileError.message,
          icon: "error"
      });
      }

    localStorage.setItem('userinfo', JSON.stringify(user));

    const isFirstTime = !userProfile?.is_login;    

    Swal.fire({
      title: "LogIn!",
      text: "Successfully Signed in",
      icon: "success"
  });

    setTimeout(async()=>{

      
      if (isFirstTime) {
        await supabase_Api
        .from('user-information')
        .update({is_login: true})
        .eq('user_id', user.id);
        window.location.href = "info.html"; // Redirect to info page
      } else {
        window.location.href = "home.html"; // Redirect to home page
      }
    }, 1000)

  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: "unexpected error occurred please try again: ",
      icon: "error"
  });
  }
};



// Sign Up User Handler-------------------------------------------

const handleSignUp = async (event) => {
  event.preventDefault();
  try {
    const { data: userData, error } = await supabase_Api.auth.signUp({
      email: Sign_email.value,
      password: Sign_password.value,
    });
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error"
    });
      return;
    }

    Swal.fire({
      title: "SignUp!",
      text: "Successfully Sign Up!",
      icon: "success"
  });

  setTimeout(()=>{
    window.location.href = "index.html";
  }, 1000)

  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: "unexpected error occurred please try again: ",
      icon: "error"
    })
  }
};





  // Dark theme Toggle----------------------------------------

  document.addEventListener("DOMContentLoaded", function ColorTheme() {

    const themeToggle = document.getElementById("theme");
    const themeIcon = document.getElementById("theme_icon");

  if(themeToggle  && themeIcon){
    const savedTheme = JSON.parse(localStorage.getItem("themeColor"));
    
    if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme.color);
    themeIcon.classList.remove("fa-sun", "fa-moon");
    themeIcon.classList.add(savedTheme.icon);
  }
  
  themeToggle.addEventListener("click", () => {
    let isDark = document.documentElement.getAttribute("data-theme") === "dark";
    let newTheme = isDark ? "light" : "dark";
    let newIcon = isDark ? "fa-moon" : "fa-sun";

    document.documentElement.setAttribute("data-theme", newTheme);
    themeIcon.className = `fa ${newIcon}`;

    localStorage.setItem(
      "themeColor",
      JSON.stringify({ color: newTheme, icon: newIcon })
    );
  });
}
else {
  console.warn("Theme elements not found on this page.");
}
});



  
// Open Modal --------------------------------------------------




  const openModalBtn = document.getElementById("Open_Modal");
  const showModal = document.getElementById("Create_Modal");
const closeModalBtn = document.getElementById("close_modal");

openModalBtn?.addEventListener("click", () => {
  showModal.style.display = "flex";
});

closeModalBtn?.addEventListener("click", closeModal);

function closeModal() {
  showModal.style.display = "none";
}

// Upload Create Post----------------------------------------

document.getElementById("fileInput")?.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = document.getElementById("image_preview");
    img.src = URL.createObjectURL(file);
  }
});

const handleCreatePost = async() => {
  const post_desc = document.getElementById("post_desc");
  const img_input = document.getElementById("fileInput").files[0];

  if(post_desc.value.trim() === '' || img_input === undefined) {
    alert("Please fill in all fields");
    return;
  }

  // Get Current User Id
  const getInfo = JSON.parse(localStorage.getItem('userinfo'));

  const {data: infoData, error} = await supabase_Api
  .from('user-information')
  .select('*')
  .eq('user_id', getInfo.id)

  const infoPostData = infoData[0]

  if (error) {
    console.error("Error fetching user:", error.message);
    return;
}

  const filePath = `posts/${Date.now()}_${img_input.name}`;
    
  const { data: img_data, error: img_err } = await supabase_Api.storage
  .from("blog-image")
  .upload(filePath, img_input);
  if (img_err) {
    throw img_err;
    return;
  }
  const imageUrl = supabase_Api.storage
  .from('blog-image').getPublicUrl(filePath).data.publicUrl;

  const {data: dbData, error:dbError} = await supabase_Api.from('user-posts')
  .insert([{
    caption: post_desc.value, 
    image_url: imageUrl, 
    user_id: infoPostData.user_id, 
    email: infoPostData.email, 
    user_name: infoPostData.user_name, 
    user_dp: infoPostData.image_url
  }])

  if (dbError) {
    Swal.fire({
      title: "Error!",
      text: dbError.message,
      icon: "error"
    })
  }

  Swal.fire({
    title: "Uploaded!",
    text: "Your Post uploaded successfully: ",
    icon: "success"
  })

  post_desc.value = '';
  document.getElementById("image_preview").src = '';

  closeModal();

};


// -------------------------Post Data---------------------------------------


async function GetPostData() {
  let postWrapper = document.getElementById('post_wrapper')
  if(postWrapper === null) {
    return;
  }
  const {data, error} = await supabase_Api
  .from('user-posts')
  .select('*')
  .order("created_at", { ascending: false });

  if(error){
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error"
    })
    return;
  }

// for Post Time 

function timeAgo(timestamp){
  const postTime = timestamp;
const now = new Date();
const postDate = new Date(postTime)
const seconds = Math.floor((now - postDate) / 1000)

if (seconds < 60)return `${seconds} seconds ago`;

const minutes = Math.floor(seconds / 60);
if (minutes < 60)return `${minutes} minutes ago`;

const hours = Math.floor(minutes / 60);
if (hours < 24)return `${hours} hours ago`;

const days = Math.floor(hours / 24);
if (days < 7)return `${days} days ago`;

const weeks = Math.floor(days / 7);
if (weeks < 4)return `${weeks} weeks ago`;

const months = Math.floor(days / 30);
if (months < 12)return `${months} months ago`;
}

let AllPosts = "";

 data.forEach((ele)=>{
  const textTime = timeAgo(ele.created_at)
  AllPosts += `
  <div class="post_section">
                    <div class="post_profile">
                    <span class="post_dp">
                        <img src=${ele.user_dp} alt="">
                    </span>
                    <div class="post_name">
                        <p>${ele.user_name}</p>
                        <span>${textTime}</span>
                    </div>
                    <span class="three-dots">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </span>
                </div>
                
                <p class="post_para">${ele.caption}</p>
                
                
                <div class="post_image">
                    <img src=${ele.image_url} alt="">
                </div>


                <div class="post_events">
                    <div>
                        <span><i class="fa-regular fa-heart"></i></span>
                        <span>150k</span>
                    </div>
                    <div>
                        <span><i class="fa-regular fa-comment-dots"></i></span>
                        <span>128</span>
                    </div>
                    <div>
                        <span><i class="fa-regular fa-bookmark"></i></span>
                        <span>183</span>
                    </div>
                    <span class="share"><i class="fa-regular fa-paper-plane"></i></span>
                </div>
                <!-- <div class="comment_section">
                    <div class="comment_dp">
                        <img class="user_image" src="./images/me.jpg" alt="">
                    </div>
                    <div class="comment_input">
                        <input type="text" placeholder="Write your comment...">
                    </div>
                </div> -->
            </div>
  `
 })

 postWrapper.innerHTML = AllPosts;

}

GetPostData()




// User_ActivePosts
async function userActive (){
  const user_div = document.getElementById('user_active');

  const {data, error} = await supabase_Api
  .from('user-information')
  .select('*')

  let div_element = '';

  data?.forEach(element => {
     div_element += `
                    <div class="short_div" data-id='${element.user_id}'>
                      <div>
                          <img src='${element.image_url}' alt="">
                      </div>
                      <span>
                          ${element.user_name}
                      </span>
                  </div>
    `
  });
  user_div.innerHTML += div_element

}
userActive()


// Profile Information------------------------------------

 document.getElementById("info_dp")?.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = document.getElementById("change_img");
    img.src = URL.createObjectURL(file);
  }

});


const cover_bg = document.getElementById("cover_img");
cover_bg?.addEventListener("click", () =>{
  document.getElementById("cover_dp")?.click();
  document.getElementById("cover_dp").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const img = document.getElementById("change_cover");
      img.src = URL.createObjectURL(file);
    }
  })
})

async function SetUserInformation (){
  const userName = document.getElementById('info_name')
  const userBio = document.getElementById('info_bio')
  const userDp = document.getElementById('info_dp').files[0]
  const user_cover = document.getElementById('cover_dp').files[0]
 
  if(userName.value.trim() === '' || userDp === undefined || user_cover === undefined){
    alert("Please fill in all fields");
    return;
  }
  
  const getInfo = JSON.parse(localStorage.getItem('userinfo'));


  
  const filePathCover = `profile/${Date.now()}_${userDp.name}`;
    
  const { data: cover_data, error: cover_err } = await supabase_Api.storage
  .from("blog-image")
  .upload(filePathCover, user_cover);
  if (cover_err) {
    throw cover_err;
    return;
  }
  const CoverUrl = supabase_Api.storage
  .from('blog-image').getPublicUrl(filePathCover).data.publicUrl;


  const filePath = `profile/${Date.now()}_${userDp.name}`;
    
  const { data: img_data, error: img_err } = await supabase_Api.storage
  .from("blog-image")
  .upload(filePath, userDp);
  if (img_err) {
    throw img_err;
    return;
  }
  const imageUrl = supabase_Api.storage
  .from('blog-image').getPublicUrl(filePath).data.publicUrl;

  const {data: dbData, error:dbError} = await supabase_Api.from('user-information')
  .insert([{
    user_name: userName.value, 
    image_url: imageUrl, 
    user_id: getInfo.id, 
    email: getInfo.email,
    user_bio: userBio.value,
    cover_url: CoverUrl,
  }])

  const setID = localStorage.setItem('setID', getInfo.id)

  if (dbError) {
    throw console.log(dbError);
  }

  Swal.fire({
    title: "Created!",
    text: "Your profile created successfully: ",
    icon: "success",
  })
  window.location.href = 'Home.html';

}



// ----------------------------------------------------------------



async function UserProfileData () {
  const getInfo = JSON.parse(localStorage.getItem('userinfo'));

  const {data, error} = await supabase_Api
  .from('user-information')
  .select('*')
  .eq('user_id', getInfo.id)
  
  if (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error"
      });
    return;
}
const {data: singleUser, error: singleUserError} = await supabase_Api
.from('user-posts')
.select('*')
.eq('user_id', getInfo.id)

if (singleUserError) {
  Swal.fire({
    title: "Error!",
    text: singleUserError.message,
    icon: "error"
    });
  return;
}

console.log(singleUser)


const userStuff = data[0]

const user_image = document.querySelectorAll('.user_image')
const user_name = document.querySelectorAll('.user_infoName')
const cover_img = document.getElementById('change_cover_dp')
let user_bioTxt = document.getElementById('bio')
let profile_wrapper = document.getElementById('ProfileContent_wrapper')
user_image.forEach((ele)=>{
  ele.src = userStuff?.image_url;
})

user_name.forEach((ele)=>{
  ele.textContent = userStuff?.user_name;
})

if(user_bioTxt === null){
  return;
}
user_bioTxt.innerText= userStuff?.user_bio;
cover_img.src = userStuff?.cover_url;



function timeAgo(timestamp){
  const postTime = timestamp;
const now = new Date();
const postDate = new Date(postTime)
const seconds = Math.floor((now - postDate) / 1000)

if (seconds < 60)return `${seconds} seconds ago`;

const minutes = Math.floor(seconds / 60);
if (minutes < 60)return `${minutes} minutes ago`;

const hours = Math.floor(minutes / 60);
if (hours < 24)return `${hours} hours ago`;

const days = Math.floor(hours / 24);
if (days < 7)return `${days} days ago`;

const weeks = Math.floor(days / 7);
if (weeks < 4)return `${weeks} weeks ago`;

const months = Math.floor(days / 30);
if (months < 12)return `${months} months ago`;
}


let AllPosts = '';
singleUser.forEach((ele)=>{
  const textTime = timeAgo(ele.created_at)
  AllPosts += `
  <div class="post_section">
                    <div class="post_profile">
                    <span class="post_dp">
                        <img src=${ele.user_dp} alt="">
                    </span>
                    <div class="post_name">
                        <p>${ele.user_name}</p>
                        <span>${textTime}</span>
                    </div>
                    <span class="three-dots">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </span>

                    <div class="event_modal" data-id="${ele.id}">
                    <span>Update</span>
                    <span>Delete</span>
                    <span>Close</span>
                    </div>
                </div>
                
                <p class="post_para">${ele.caption}</p>
                
                
                <div class="post_image">
                    <img src=${ele.image_url} alt="">
                </div>


                <div class="post_events">
                    <div>
                        <span><i class="fa-regular fa-heart"></i></span>
                        <span>150k</span>
                    </div>
                    <div>
                        <span><i class="fa-regular fa-comment-dots"></i></span>
                        <span>128</span>
                    </div>
                    <div>
                        <span><i class="fa-regular fa-bookmark"></i></span>
                        <span>183</span>
                    </div>
                    <span class="share"><i class="fa-regular fa-paper-plane"></i></span>
                </div>
                <!-- <div class="comment_section">
                    <div class="comment_dp">
                        <img class="user_image" src="./images/me.jpg" alt="">
                    </div>
                    <div class="comment_input">
                        <input type="text" placeholder="Write your comment...">
                    </div>
                </div> -->
            </div>
  `
 })

 profile_wrapper.innerHTML = AllPosts;
 

 profile_wrapper.addEventListener("click", async function (event) {
  const target = event.target.closest(".three-dots")
  const modal = event.target.closest(".event_modal");

  
  if(target){
    const eventModal = target.nextElementSibling;

    if(eventModal){
      eventModal.style.display = eventModal.style.display === 'flex' ? 'none' : 'flex';
    }
  }

  if(modal && event.target.textContent === 'Delete'){
    const postId = modal.getAttribute("data-id");

    const { data: dltPost, error: dltError } = await supabase_Api
      .from("user-posts")
      .delete()
      .eq("id", postId);
  
    if (dltError) {
      Swal.fire({
        title: "Error!",
        text: "Unexpected error occurred, please try again.",
        icon: "error"
      });
      return;
    }
  
    Swal.fire({
      title: "Deleted!",
      text: "Post has been deleted.",
      icon: "success"
    });

    modal.style.display = 'none';

  }

  if(modal && event.target.textContent === 'Update'){
    const postId = modal.getAttribute("data-id");

    if (!postId) {
        Swal.fire({
          title: "Error!",
          text: "Could not find the post ID.",
          icon: "error",
        });
        return;
      }
    
      let userUpdated = prompt("Please enter your update caption:")
    
      const { error } = await supabase_Api
      .from('user-posts')
      .update({ caption: userUpdated })
      .eq('id', postId)
    
     if(error){
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
      return;
     }
     modal.style.display = 'none';
  }

  if(modal && event.target.textContent === 'Close'){
    modal.style.display = 'none';
  }



  // if (!postId) {
  //   Swal.fire({
  //     title: "Error!",
  //     text: "Could not find the post ID.",
  //     icon: "error",
  //   });
  //   return;
  // }

  // let userUpdated = prompt("Please enter your update caption:")

  // const { error } = await supabase_Api
  // .from('user-posts')
  // .update({ caption: userUpdated })
  // .eq('id', postId)

  // console.log(error)

  // 

  // console.log("Deleted post ID:", postId);
});

}

UserProfileData()