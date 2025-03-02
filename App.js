const SUPABASE_URL = "https://wbgkzxqsuoxtflazvifg.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2t6eHFzdW94dGZsYXp2aWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODA5NzEsImV4cCI6MjA1Mjg1Njk3MX0.RkLMzbduu-u0C3A57k7fo8tEPcFdfMvA2RQn2OpNgU4";

const supabase_Api = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const login_email = document.getElementById("log-email");
const login_password = document.getElementById("log-pass");
const Sign_password = document.getElementById("sign-password");
const Sign_email = document.getElementById("sign-email");


// Login User handler-------------------------------------------
const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const { data: {user}, error } = await supabase_Api.auth.signInWithPassword({
      email: login_email.value,
      password: login_password.value,
    });
    if (error) {
      alert(error.message);
      return;
    }
    alert("Successfully signed in");
    const setUserinfo = localStorage.setItem('userinfo', JSON.stringify(user));
  const getInfo = JSON.parse(localStorage.getItem('userinfo'));
    
    const getID = localStorage.getItem('setID')
    if (getID === getInfo.id) {
      window.location.href = "home.html";
    }
    else{
      window.location.href = "info.html";
    }
  } catch (err) {
    alert("unexpected error occurred please try again: ");
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
      alert(error.message);
      console.log(error);
      return;
    }

    alert("Successfully signed up");
    window.location.href = "index.html";
  } catch (err) {
    alert("unexpected error occurred please try again: ");
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
    throw alert(`Database error: ${dbError.message}`);
  }

  alert("Image uploaded and data saved successfully!");

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
    alert(error.message)
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



// Profile Information------------------------------------

 document.getElementById("info_dp")?.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = document.getElementById("change_img");
    img.src = URL.createObjectURL(file);
  }

});

async function SetUserInformation (){
  const userName = document.getElementById('info_name')
  const userBio = document.getElementById('info_bio')
  const userDp = document.getElementById('info_dp').files[0]
 
  if(userName.value.trim() === '' || userDp === undefined){
    alert("Please fill in all fields");
    return;
  }
  
  const getInfo = JSON.parse(localStorage.getItem('userinfo'));

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
  }])

  const setID = localStorage.setItem('setID', getInfo.id)

  if (dbError) {
    throw console.log(dbError);
  }

  alert("Image uploaded and data saved successfully!");
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
    console.error("Error fetching user:", error.message);
    return;
}

const userStuff = data[0]

const user_image = document.querySelectorAll('.user_image')
const user_name = document.querySelectorAll('.user_infoName')
let user_bioTxt = document.getElementById('bio')
user_image.forEach((ele)=>{
  ele.src = userStuff.image_url;
})

user_name.forEach((ele)=>{
  ele.textContent = userStuff.user_name;
})

if(user_bioTxt === null){
  return;
}
user_bioTxt.innerText= userStuff?.user_bio;


}

UserProfileData()