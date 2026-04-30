let deleteId = null;
let editId = null;

// MESSAGE
window.showMsg = function (text) {
    let m = document.getElementById('msg');
    if (!m) return;

    m.innerText = text;
    m.className = 'msg show';

    setTimeout(() => m.className = 'msg', 2000);
};

// MODAL
window.openAddPhotoModal = function () {
    document.getElementById('addPhotoModal').classList.add('show');
};

window.closeAddPhotoModal = function () {
    document.getElementById('addPhotoModal').classList.remove('show');
};

// SAVE PHOTO
window.savePhoto = function () {

    let fileInput = document.getElementById('adminPhotoInput');

    console.log("Input:", fileInput);
    console.log("Files:", fileInput.files);

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Please select file");
        return;
    }

    let file = fileInput.files[0];
    let caption = document.getElementById('captionInput').value.trim();
    let category = document.getElementById('categoryInput').value || "College Event";

    if (!caption) {
        alert("Please enter caption");
        return;
    }

    let reader = new FileReader();

    reader.onload = function (e) {
        const photo = {
            id: Date.now(),
            image: e.target.result,
            caption: caption,
            category: category,
            date: new Date().toISOString().split('T')[0]
        };

        let data = JSON.parse(localStorage.getItem('Gallery_photo') || '[]');
        data.unshift(photo);

        localStorage.setItem('Gallery_photo', JSON.stringify(data));

        showMsg("Photo Saved");
        closeAddPhotoModal();
        loadPhotos();

        // reset form
        fileInput.value = "";
        document.getElementById('captionInput').value = "";
    };

    reader.readAsDataURL(file);
};// LOAD PHOTOS
window.loadPhotos = function () {
    let data = JSON.parse(localStorage.getItem('Gallery_photo') || '[]');

    let html = '';

    if (data.length === 0) {
        html = '<tr><td colspan="5">No Data</td></tr>';
    } else {
        data.forEach(p => {
            html += `
                <tr>
                    <td>${p.date}</td>
                    <td><img src="${p.image}" width="80"></td>
                    <td>${p.caption}</td>
                    <td>${p.category || 'College Event'}</td>
                    <td>
                        <button class="btn orange action-btn" onclick="openEditModal(${p.id})">
                            <i class="fa fa-edit"></i>
                        </button>

                        <button class="btn red action-btn" onclick="openDeleteModal(${p.id})">
                            <i class="fa fa-trash"></i>
                        </button>

                        <a href="Gallery_photo.html" class="btn blue action-btn">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                    </td>
                </tr>`;
        });
    }

    let table = document.getElementById('photoList');
    if (table) table.innerHTML = html;

    updateCounts(data);
};

// COUNTS
window.updateCounts = function (photos) {
    let all = photos.length;
    let event = photos.filter(p => p.category === "College Event").length;
    let achievement = photos.filter(p => p.category === "Achievement").length;

    let allEl = document.getElementById("allCount");
    let eventEl = document.getElementById("eventCount");
    let achievementEl = document.getElementById("achievementCount");

    if (allEl) allEl.innerText = all;
    if (eventEl) eventEl.innerText = event;
    if (achievementEl) achievementEl.innerText = achievement;
};

// DELETE
window.openDeleteModal = function (id) {
    deleteId = id;
    document.getElementById('deleteModal').classList.add('show');
};

window.closeModal = function () {
    document.getElementById('deleteModal').classList.remove('show');
};

window.confirmDelete = function () {
    let data = JSON.parse(localStorage.getItem('Gallery_photo') || '[]');

    data = data.filter(p => p.id !== deleteId);

    localStorage.setItem('Gallery_photo', JSON.stringify(data));

    loadPhotos();
    closeModal();
};

// EDIT
window.openEditModal = function (id) {
    let data = JSON.parse(localStorage.getItem('Gallery_photo') || '[]');
    let p = data.find(x => x.id === id);

    if (!p) return;

    editId = id;

    document.getElementById('editImagePreview').src = p.image;
    document.getElementById('editCaptionInput').value = p.caption;
    document.getElementById('editCategoryInput').value = p.category || "College Event";

    document.getElementById('editPhotoModal').classList.add('show');
};

window.closeEditModal = function () {
    document.getElementById('editPhotoModal').classList.remove('show');
};

window.saveEditPhoto = function () {
    let data = JSON.parse(localStorage.getItem('Gallery_photo') || '[]');
    let p = data.find(x => x.id === editId);

    if (!p) return;

    p.caption = document.getElementById('editCaptionInput').value;
    p.category = document.getElementById('editCategoryInput').value;

    localStorage.setItem('Gallery_photo', JSON.stringify(data));

    loadPhotos();
    closeEditModal();
    showMsg("Updated Successfully");
};

// INIT (SAFE)
window.addEventListener("DOMContentLoaded", function () {
    loadPhotos();
});

window.initAdminGallery = function () {
    console.log("Gallery Init Called");

    let input = document.getElementById("adminPhotoInput");
    console.log("adminPhotoInput =", input);

    loadPhotos();
};