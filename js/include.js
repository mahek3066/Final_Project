//document.getElementById("navbar").innerHTML = `

//<nav class="navbar header d-flex justify-content-between px-3">

//<span class="text-white fs-5">
//<i class="fa fa-gauge"></i> Admin Dashboard
//</span>

//<a href="login.html" class="btn btn-light btn-sm">
//<i class="fa fa-sign-out"></i> Logout
//</a>

//</nav>

//`;
//document.getElementById("sidebar").innerHTML = `
//<div class="sidebar">

//<ul>


//<a href="dashboard.html">
//<i class="fa fa-home"></i> Dashboard
//</a>


//<a href="blogs.html">
//<i class="fa fa-blog"></i> Blogs
//</a>


//<class="dropdown">

//<a href="#" onclick="toggleMenu()">
//<i class="fa fa-calendar"></i> Event
//<i class="fa fa-angle-down"></i>
//</a>

//<ul class="submenu" id="eventMenu">

//<li><a href="nss-event.html">NSS Event</a></li>
//<li><a href="student-event.html">Student Event</a></li>
//<li><a href="college-event.html">College Event</a></li>

//</ul>




//<a href="Adamin_gallery.html">
//<i class="fa fa-image"></i> Gallery
//</a>


//<a href="users.html">
//<i class="fa fa-user"></i> Users
//</a>



//<a href="achievements.html">
//<i class="fa fa-trophy"></i> Achievements
//</a>


//<a href="settings.html">
//<i class="fa fa-gear"></i> Settings
//</a>


//</ul>

//</div>
//`;

//function toggleMenu() {
//    let menu = document.getElementById("eventMenu");

//    if (menu.style.display === "block") {
//        menu.style.display = "none";
//    }
//    else {
//        menu.style.display = "block";
//    }
//}

//function loadPage(page) {

//    fetch(page)
//        .then(response => response.text())
//        .then(data => {

//            document.getElementById("main-content").innerHTML = data;

//        });

//}

// Navbar Load
document.getElementById("navbar").innerHTML = `

<nav class="navbar header d-flex justify-content-between px-3">

<span class="text-white fs-5">
<i class="fa fa-gauge"></i> Admin Dashboard
</span>

<a href="login.html" class="btn btn-light btn-sm">
<i class="fa fa-sign-out"></i> Logout
</a>

</nav>

`;


// Sidebar Load
document.getElementById("sidebar").innerHTML = `

<div class="sidebar">

<ul>

 <a class="sidebar-link" href="#" onclick="loadPage('dashboard.html'); setActive(this);return false;">
        <i class="fa fa-home"></i> Dashboard
    </a>


<a class="sidebar-link" href="pages/blogs.html" onclick="loadPage('blogs.html'); setActive(this);return false;">
        <i class="fa fa-blog"></i> Blogs
    </a>


<a href="#" onclick="toggleMenu()">
<i class="fa fa-calendar"></i> Event
<i class="fa fa-angle-down"></i>
</a>

<ul class="submenu" id="eventMenu">

 <li><a class="sidebar-link" href="nss-event.html" onclick="loadPage('nss-event.html'); setActive(this);return false;">NSS Event</a></li>
 <li><a class="sidebar-link" href="pages/StudentEvents.html" onclick="loadPage('pages/StudentEvents.html'); setActive(this);return false;">Student Event</a></li>
 <li><a class="sidebar-link" href="pages/College_Admin.html" onclick="loadPage('pages/College_Admin.html');setActive(this);return false;">College Event</a></li>
</ul>

 <a class="sidebar-link" href="pages/Sports.html" onclick="loadPage('Sports.html');setActive(this);return false;">
        <i class="fa-solid fa-table-tennis-paddle-ball"></i> Sports
    </a>

<a class="sidebar-link" href="Admin_Gallery.html "onclick="loadPage('Admin_Gallery.html');setActive(this);return false;">
        <i class="fa fa-image"></i> Gallery
    </a>

 <a class="sidebar-link" href="AddFaculty.html" onclick="loadPage('AddFaculty.html');setActive(this);return false;">
        <i class="fa fa-user"></i> Faculty

</a>

<a class="sidebar-link" href="achievements.html" onclick="loadPage('achievements.html');setActive(this);return false;">
        <i class="fa-solid fa-table"></i> Time Table
    </a>

    <a class="sidebar-link" href="achievements.html" onclick="loadPage('Notice.html');setActive(this);return false;">
        <i class="fa-solid fa-file-lines"></i> Notice
    </a>

 <a class="sidebar-link" href="pages/StudentEvents.html" onclick="loadPage('pages/StudentEvents.html');setActive(this);return false;">
        <i class="fas fa-user-circle"></i> Profile
    </a>


</ul>

</div>

`;


// Dropdown Toggle
function toggleMenu() {

let menu = document.getElementById("eventMenu");

if (menu.style.display === "block") {
menu.style.display = "none";
}
else {
menu.style.display = "block";
}

}


// Page Load Function
//function loadPage(page) {

//fetch(page)
//.then(response => response.text())
//.then(data => {

//document.getElementById("main-content").innerHTML = data;

//});

//}

function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(data => {
            document.getElementById("main-content").innerHTML = data;

         
            if (pageUrl.includes("StudentEvent.html")) {
                loadData();
            }
        });
}
function setActive(element) {

    let links = document.querySelectorAll(".sidebar-link");

    links.forEach(link => {
        link.classList.remove("active");
    });

    element.classList.add("active");
}

function loadPage(page) {
    fetch(page)
        .then(res => res.text())
        .then(data => {
            document.getElementById("main-content").innerHTML = data;


            if (page.includes("College_Admin")) {
                if (window.initCollegeGallery) initCollegeGallery();
            }

            if (page.includes("StudentEvent")) {
                if (window.initStudentEvent) initStudentEvent();
            }

            if (page.includes("Admin_Gallery")) {
                if (window.initAdminGallery) initAdminGallery();
            }
        });
}
