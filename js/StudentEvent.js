

    let editIndex = -1;

    // OPEN MODAL
    window.openModal= function() {
        document.getElementById("addModal").style.display = "flex";
        }

    window.closeModal= function() {
        document.getElementById("addModal").style.display = "none";
        }

    // SAVE
    window.savePhoto= function() {
        let fileInput = document.getElementById("imgInput");

        if (!fileInput || !fileInput.files[0]) {
            alert("Select file!");
            return;
        }
    let caption = document.getElementById("captionInput").value;

    if (!file || !caption) {
        alert("Fill all fields");
    return;
            }

    let reader = new FileReader();
    reader.onload = function (e) {

        let data = JSON.parse(localStorage.getItem("gallery")) || [];

    data.push({
        image: e.target.result,
    caption: caption,
    date: new Date().toLocaleDateString()
                });

    localStorage.setItem("gallery", JSON.stringify(data));

    loadData();
    closeModal();
            }

    reader.readAsDataURL(file);
        }

    // LOAD
window.loadData = function () {
    let table = document.getElementById("tableData");

    if (!table) return; 
        let data = JSON.parse(localStorage.getItem("gallery")) || [];

    let html = "";

            data.forEach((p, i) => {
        html += `
                <tr>
                <td>${p.date}</td>
                <td><img src="${p.image}"></td>
                <td>${p.caption}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editPhoto(${i})">
                        <i class="fa fa-edit"></i>
                    </button>

                    <button class="action-btn remove-btn" onclick="deletePhoto(${i})">
                        <i class="fa fa-trash"></i>
                    </button>

                   <button class="btn btn-primary btn-sm" onclick="viewImage('${p.image}', '${p.caption}')">
                                     <i class="fa fa-eye"></i>
                    </button>
                </td>
                </tr>
                `;
            });

    document.getElementById("tableData").innerHTML = html || "<tr><td colspan='4'>No Data</td></tr>";
        }

    // DELETE

    window.deletePhoto= function(i) {
        deleteIndex = i;
    document.getElementById("deleteModal").style.display = "flex";
        }

    window.confirmDelete= function() {
        let data = JSON.parse(localStorage.getItem("gallery")) || [];

    data.splice(deleteIndex, 1);

    localStorage.setItem("gallery", JSON.stringify(data));

    loadData();
    closeDelete();
        }

    window.closeDelete= function() {
        document.getElementById("deleteModal").style.display = "none";
        }

    // EDIT OPEN
   window.editPhoto= function(i) {
        let data = JSON.parse(localStorage.getItem("gallery")) || [];

    editIndex = i;

    document.getElementById("editImg").src = data[i].image;
    document.getElementById("editCaption").value = data[i].caption;

    document.getElementById("editModal").style.display = "flex";
        }

    window.closeEdit= function() {
        document.getElementById("editModal").style.display = "none";
        }

    // UPDATE
    window.updatePhoto= function() {
        let data = JSON.parse(localStorage.getItem("gallery")) || [];

    data[editIndex].caption = document.getElementById("editCaption").value;

    localStorage.setItem("gallery", JSON.stringify(data));

    loadData();
    closeEdit();
}
  window. viewImage= function(image, title) {

    localStorage.setItem("selectedImage", image);
   localStorage.setItem("selectedTitle", title);

    window.location.href = "Studentpage.html";
}
    // INIT
window.initStudentEvent = function () {
    loadStudentData();
};