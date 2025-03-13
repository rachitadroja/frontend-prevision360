// Define getStatusBadge function globally to be used throughout
const getStatusBadge = (status) => {
  const statusClasses = {
      Active: "border border-success text-success",
      Pending: "border border-warning text-warning",
      Unsubscribed: "border border-danger text-danger"
  };

  return `
      <div>
          <span class="badge ${statusClasses[status] || 'border border-secondary text-secondary'} px-3 py-1 fw-bold">
              ${status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          ${status === "Pending" || status === "Unsubscribed" ? `
              <button type="button" class="btn btn-link p-0 text-primary resend-btn" data-bs-toggle="tooltip" title="Resend Invite">
                  <i class="bi-arrow-clockwise"></i>
              </button>
          ` : ''}
      </div>
  `;
};


document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#addInvestorModal form");
  const tableBody = document.querySelector("#datatable tbody");

  // Sample data
  const sampleData = [
      { firstName: "Amanda", lastName: "Harvey", email: "amanda@site.com", group: "Admin Group", status: "Active", inviteText: "1 invite left" },
      { firstName: "Anne", lastName: "Richard", email: "anne@site.com", group: "Team Group", status: "Pending", inviteText: "1 invite left" },
      { firstName: "Amanda", lastName: "Harvey", email: "amanda@site.com", group: "Team Group", status: "Unsubscribed", inviteText: "1 invite left" }
  ];

  // Function to create a table row dynamically
  function createRow(firstName, lastName, email, group, status, inviteText) {
    const uniqueId = `checkbox-${Date.now()}`;

    const statusClass = status === "Active" ? "border border-success text-success" : status === "Pending" ? "border border-warning text-warning" : "border border-danger text-danger";
    const statusText = status === "Active" ? "Active" : status === "Pending" ? "Pending" : "Unsubscribed";

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="table-column-pe-0">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="${uniqueId}">
                <label class="form-check-label" for="${uniqueId}"></label>
            </div>
        </td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td>${group}</td>
        <td>
            ${getStatusBadge(status)}
            <small class="text-muted invite-text">${inviteText}</small>
        </td>
        <td>
            <button class="btn btn-sm p-0 edit-milestone" data-bs-toggle="modal" data-bs-target="#editInvestorModal" title="Edit">
                <i class="bi-pencil-fill fs-5"></i>
            </button>
            <button class="btn btn-sm p-0 delete-milestone ms-4" title="Delete">
                <i class="bi-trash-fill text-danger fs-5"></i>
            </button>
        </td>
    `;

    // Append new row to table
    tableBody.appendChild(newRow);
}



  // Loop through sample data and create table rows
  sampleData.forEach(data => {
      createRow(data.firstName, data.lastName, data.email, data.group, data.status, data.inviteText);
  });

  // Handle form submission to add a new row
  form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Get input values
      const firstName = document.querySelector("#addFirstNameModalLabel").value;
      const lastName = document.querySelector("#addLastNameModalLabel").value;
      const email = document.querySelector("#addEmailModalLabel").value;
      const group = document.querySelector("#addGroupModalLabel").value;

    
      let isValid = true;

      // Clear any previous error messages
      document.querySelectorAll(".text-danger").forEach(error => {
          error.classList.add("d-none");
      });

      // Check if all fields are filled
      if (!firstName) {
          document.querySelector("#addFirstNameError").classList.remove("d-none");
          isValid = false;
      }

      if (!lastName) {
          document.querySelector("#addLastNameError").classList.remove("d-none");
          isValid = false;
      }

      if (!email) {
          document.querySelector("#addEmailError").classList.remove("d-none");
          isValid = false;
      }

      if (!group) {
          document.querySelector("#addGroupError").classList.remove("d-none");
          isValid = false;
      }

      if (!isValid) {
          return; // Prevent form submission if there are errors
      }

      // Add the new row dynamically
      createRow(firstName, lastName, email, group, "Pending", "1 invite left");

      // Reset form and close modal
      form.reset();
      let modalElement = document.querySelector("#addInvestorModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
  });

  // Handle Resend button click functionality
  tableBody.addEventListener("click", function (event) {
    const resendButton = event.target.closest(".resend-btn");
    if (resendButton) {
        const row = resendButton.closest("tr");
        const inviteTextElement = row.querySelector(".invite-text");

        if (inviteTextElement) {
            inviteTextElement.textContent = "0 invite left";
        }

        resendButton.disabled = true;
        resendButton.setAttribute("data-bs-original-title", "Invite Sent");
        const tooltip = bootstrap.Tooltip.getInstance(resendButton);
        if (tooltip) tooltip.hide();

        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-success position-fixed bottom-0 end-0 m-3";
        alertDiv.textContent = "Invitation Sent";
        alertDiv.style.width = "350px";
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});


  // Handle Edit button click
  tableBody.addEventListener("click", function (event) {
      const editButton = event.target.closest(".edit-milestone");
      if (editButton) {
          const row = editButton.closest("tr");
          const firstName = row.cells[1].textContent;
          const lastName = row.cells[2].textContent;
          const email = row.cells[3].textContent;
          const group = row.cells[4].textContent;

          // Prefill the modal with the data
          document.querySelector("#editFirstNameModalLabel").value = firstName;
          document.querySelector("#editLastNameModalLabel").value = lastName;
          document.querySelector("#editEmailModalLabel").value = email;
          document.querySelector("#editGroupModalLabel").value = group; // Match the option in the dropdown

          // Show the modal
          const modal = new bootstrap.Modal(document.getElementById("editInvestorModal"));
          modal.show();
      }
  });

  // Handle Delete button click
  let deleteRow = null;

  tableBody.addEventListener("click", function (event) {
      const deleteButton = event.target.closest(".delete-milestone");
      if (deleteButton) {
          deleteRow = deleteButton.closest("tr");
          const firstName = deleteRow.cells[1].textContent;
          const lastName = deleteRow.cells[2].textContent;
  
          document.querySelector("#deleteConfirmationMessage").textContent =
              `Are you sure you want to delete ${firstName} ${lastName}?`;
  
          const confirmModal = new bootstrap.Modal(document.getElementById("deleteConfirmationModal"));
          confirmModal.show();
      }
  });
  
  document.querySelector("#confirmDelete").addEventListener("click", function () {
      if (deleteRow) {
          deleteRow.remove();
          deleteRow = null;
          bootstrap.Modal.getInstance(document.getElementById("deleteConfirmationModal")).hide();
      }
  });
  

  // Reset the background blur effect when modal is closed
  const editInvestorModal = document.getElementById('editInvestorModal');
  editInvestorModal.addEventListener('hidden.bs.modal', function () {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
          backdrop.remove(); // Remove backdrop
      }
      document.body.style.overflow = 'auto'; // Reset body overflow style
  });
});
