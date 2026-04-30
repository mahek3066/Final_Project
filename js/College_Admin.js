
    let galleryData = JSON.parse(localStorage.getItem("collegeGallery")) || [];
    let deleteIndex = null;

        window.onload = () => {
        displayData();
        };

    // Modal Functions
    window.openModal = function () {
        document.getElementById('addModal').style.display = 'flex';
        }
window.openModal = function() { document.getElementById('addModal').style.display = 'flex'; }
window.closeModal= function() { document.getElementById('addModal').style.display = 'none'; }
window.closeEdit= function() { document.getElementById('editModal').style.display = 'none'; }
window.closeDelete= function() { document.getElementById('deleteModal').style.display = 'none'; }
    // Save Function
  window.savePhoto=  function() {
            const fileInput = document.getElementById('imgInput');
    const captionInput = document.getElementById('captionInput');

    if (!fileInput.files || !fileInput.files[0]) {
        alert("please choose photo!");
    return;
            }

    const reader = new FileReader();
    reader.onload = function (e) {
                const newPhoto = {
        date: new Date().toLocaleDateString(),
    image: e.target.result,
    caption: captionInput.value || "No Caption"
                };
    galleryData.push(newPhoto);
    localStorage.setItem("collegeGallery", JSON.stringify(galleryData));
    displayData();
    closeModal();
    fileInput.value = "";
    captionInput.value = "";
            };
    reader.readAsDataURL(fileInput.files[0]);
        }

// Display Function
window.displayData = function () {
    let table = document.getElementById('tableBody');

    if (table) {
        table.innerHTML = "";

        galleryData.forEach((item, index) => {
            table.innerHTML += `
        <tr>
            <td class="col-date">${item.date}</td>
            <td class="col-img">
                <img src="${item.image}" width="75" height="50" style="object-fit:cover; border-radius:6px;">
            </td>
            <td class="col-caption">${item.caption}</td>
            <td class="col-action">
                <div class="btn-wrapper">
                    <button class="action-btn btn-edit" onclick="openEdit(${index})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="openDelete(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="action-btn btn-view" onclick="viewImage('${item.image}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>`;
        });
    }
}

    function viewImage(imgSrc){
        localStorage.setItem("currentViewImage", imgSrc);
    window.location.href = "/pages/College_Event.html";
        }

     function openEdit(index){
            const photo = galleryData[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editImg').src = photo.image;
    document.getElementById('editCaption').value = photo.caption;
    document.getElementById('editModal').style.display = 'flex';
        }

    function updatePhoto(){
     const index = document.getElementById('editIndex').value;
    galleryData[index].caption = document.getElementById('editCaption').value;
    localStorage.setItem("collegeGallery", JSON.stringify(galleryData));
    displayData();
    closeEdit();
        }

    function openDelete(index) {
        deleteIndex = index;
    document.getElementById('deleteModal').style.display = 'flex';
        }

    function confirmDelete() {
      if (deleteIndex !== null) {
        galleryData.splice(deleteIndex, 1);
    localStorage.setItem("collegeGallery", JSON.stringify(galleryData));
    displayData();
    closeDelete();
    deleteIndex = null;
            }
}
window.initCollegeGallery = function () {
    loadData();
};