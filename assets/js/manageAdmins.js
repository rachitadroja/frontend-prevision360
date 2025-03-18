document.addEventListener("DOMContentLoaded", () => {
    const addAdminForm = document.querySelector("#addAdminModal form");
    const editAdminForm = document.querySelector("#editAdminModal form");
    const tableBody = document.querySelector("#datatable tbody");
  
    // Dummy data
    const users = [
      {
        firstName: "Amanda",
        lastName: "Harvey",
        email: "amanda@site.com",
        role: "Founder",
        permissions: ["Manage Admins", "Manage Company Profile", "Manage People", "Manage Milestones", "Manage Investors"],
      },
      {
        firstName: "Anne",
        lastName: "Richard",
        email: "anne@site.com",
        role: "Team Member",
        permissions: ["Manage Admins", "Manage Company Profile", "Manage People"],
      }
    ];
  
    // Render table data
    function renderTable() {
      tableBody.innerHTML = "";
      users.forEach((user, index) => {
        const row = `
          <tr data-index="${index}">
            <td class="table-column-pe-0">
              <div class="form-check">
                <input class="form-check-input" type="checkbox">
              </div>
            </td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              ${user.permissions.map(permission => `<div>${permission}</div>`).join("")}
            </td>
            <td>
<!-- Edit Button with Icon (Gray Color) -->
<button type="button" class="edit-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editAdminModal" style="background: none; border: none; padding: 0; margin-right: 20px;">
  <i class="bi-pencil-fill text-muted fs-5"></i>
</button>

<!-- Delete Button with Icon (Red Color) -->
<button type="button" class="delete-btn" data-index="${index}" style="background: none; border: none; padding: 0;">
  <i class="bi-trash-fill text-danger fs-5"></i>
</button>



            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
      });
      attachEventListeners(); // Attach event listeners after rendering
    }
  
    // ✅ Add new user
    addAdminForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const firstName = document.getElementById("addFirstName").value;
      const lastName = document.getElementById("addLastName").value;
      const email = document.getElementById("addEmail").value;
      
  
      // ✅ Get selected permissions properly
      const permissions = Array.from(
        document.querySelectorAll("#addAdminModal .form-check-input:checked")
      ).map((checkbox) => checkbox.nextElementSibling.innerText);
  
      if (firstName && lastName && email) {
        users.push({
          firstName,
          lastName,
          email,
          role: "Team Member",
          permissions
        });
  
        // ✅ Reset form and re-render table
        addAdminForm.reset();
        renderTable();
  
        // ✅ Close modal
        bootstrap.Modal.getInstance(document.getElementById("addAdminModal")).hide();
      }
    });
  
    // ✅ Edit user
    function openEditModal(index) {
      const user = users[index];
  
      document.getElementById("editFirstNameModalLabel").value = user.firstName;
      document.getElementById("editLastNameModalLabel").value = user.lastName;
      document.getElementById("editEmailModalLabel").value = user.email;
  
      // ✅ Update permissions in edit modal
      document.querySelectorAll("#editAdminModal .form-check-input").forEach((checkbox) => {
        checkbox.checked = user.permissions.includes(checkbox.nextElementSibling.innerText);
      });
  
      // ✅ Save edited values
      editAdminForm.onsubmit = (e) => {
        e.preventDefault();
  
        user.firstName = document.getElementById("editFirstNameModalLabel").value;
        user.lastName = document.getElementById("editLastNameModalLabel").value;
        user.email = document.getElementById("editEmailModalLabel").value;
  
        user.permissions = Array.from(
          document.querySelectorAll("#editAdminModal .form-check-input:checked")
        ).map((checkbox) => checkbox.nextElementSibling.innerText);
  
        // ✅ Update table and close modal
        renderTable();
        bootstrap.Modal.getInstance(document.getElementById("editAdminModal")).hide();
      };
    }
  
    let deleteIndex = null;
    function deleteUser(index) {
        deleteIndex = index;
        const user = users[index];
        document.getElementById("deleteConfirmationMessage").innerText =
          `Are you sure you want to delete ${user.firstName} ${user.lastName}?`;
      
        // Open the delete confirmation modal
        const deleteModal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));
        deleteModal.show();
      }
      
      // Confirm deletion
      document.getElementById("confirmDelete").addEventListener("click", () => {
        if (deleteIndex !== null) {
          users.splice(deleteIndex, 1);
          renderTable();
      
          // Close the modal after deletion
          bootstrap.Modal.getInstance(document.getElementById("deleteConfirmationModal")).hide();
          deleteIndex = null;
        }
      });
  
    // ✅ Attach event listeners dynamically
    function attachEventListeners() {
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.onclick = () => {
          const index = button.getAttribute("data-index");
          deleteUser(index);
        };
      });
  
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.onclick = () => {
          const index = button.getAttribute("data-index");
          openEditModal(index);
        };
      });
    }
  
    // ✅ Initialize table on page load
    renderTable();
  });
  