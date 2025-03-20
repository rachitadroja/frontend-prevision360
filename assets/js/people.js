// Sample data
const people = [
    {
        firstName: "Amanda",
        lastName: "Harvey",
        email: "amanda@site.com",
        role: "Founder"
    },
    {
        firstName: "Anne",
        lastName: "Richard",
        email: "anne@site.com",
        role: "Team Member"
    }
];

// Function to render table rows
function renderTable() {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    people.forEach((person, index) => {
        const row = `
            <tr>
                <td class="table-column-pe-0">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="check${index}">
                        <label class="form-check-label" for="check${index}"></label>
                    </div>
                </td>
                <td>${person.firstName}</td>
                <td>${person.lastName}</td>
                <td>${person.email}</td>
                <td>${person.role}</td>
                <td>
                 <button type="button" class="btn p-0 border-0" onclick="editPerson(${index})">
                <i class="bi-pencil-fill"></i>
            </button>
            <button type="button" class="btn p-0 border-0 text-danger ms-5" onclick="deletePerson(${index})">
                 <i class="bi-trash-fill text-danger fs-5"></i>
            </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Add new person
document.querySelector("#addPeopleModal form").addEventListener("submit", function(event) {
    event.preventDefault();

    const firstName = document.getElementById("addFirstNameModalLabel").value;
    const lastName = document.getElementById("addLastNameModalLabel").value;
    const email = document.getElementById("addEmailModalLabel").value;

    if (firstName && lastName && email) {
        people.push({ firstName, lastName, email, role: "Team Member" });
        renderTable();

        // Reset form and close modal
        document.querySelector("#addPeopleModal form").reset();
        bootstrap.Modal.getInstance(document.getElementById("addPeopleModal")).hide();
    }
});

// Edit person
function editPerson(index) {
    const person = people[index];
    document.getElementById("editFirstNameModalLabel").value = person.firstName;
    document.getElementById("editLastNameModalLabel").value = person.lastName;
    document.getElementById("editEmailModalLabel").value = person.email;

    // Save changes
    document.querySelector("#editPeopleModal form").onsubmit = (event) => {
        event.preventDefault();

        people[index].firstName = document.getElementById("editFirstNameModalLabel").value;
        people[index].lastName = document.getElementById("editLastNameModalLabel").value;
        people[index].email = document.getElementById("editEmailModalLabel").value;

        renderTable();
        bootstrap.Modal.getInstance(document.getElementById("editPeopleModal")).hide();
    };

    // Open edit modal
    const editModal = new bootstrap.Modal(document.getElementById("editPeopleModal"));
    editModal.show();
}
// Delete person
function deletePerson(index) {
    const person = people[index];
    const confirmModal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));

    // ✅ Set the confirmation message with the person's full name
    document.querySelector("#deleteConfirmModal .modal-body p").innerText = `Are you sure you want to delete ${person.firstName} ${person.lastName}?`;

    // Confirm delete
    document.getElementById("confirmDeleteButton").onclick = () => {
        people.splice(index, 1);
        renderTable();
        confirmModal.hide();
    };

    confirmModal.show();
}


// Render initial data
renderTable();
