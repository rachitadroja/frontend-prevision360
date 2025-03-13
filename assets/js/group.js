document.addEventListener("DOMContentLoaded", () => {
    const allInvestors = ["Harvey Specter", "Rachel Zane", "Monica Geller", "Chandler Bing", "Joey Tribbiani", "Phoebe Buffay", "Ross Geller"];
    let selectedInvestors = []; // Initially, no selected investors for create group

    const groups = [
        { id: 1, name: "Family Group", investors: ["Chandler Bing", "Joey Tribbiani"] },
        { id: 2, name: "Angel Investors Group", investors: ["Chandler Bing", "Joey Tribbiani"] },
        { id: 3, name: "Venture Capital Group", investors: ["Phoebe Buffay", "Ross Geller"] }
    ];

    const groupsTableBody = document.querySelector("#datatable tbody");
    const editInvestorSearch = document.getElementById('editInvestorSearch');
    const editSelectedInvestors = document.getElementById('editSelectedInvestors');
    const editInvestorSuggestions = document.getElementById('editInvestorSuggestions');
    const createInvestorSearch = document.getElementById('newInvestorSearch');
    const createInvestorSuggestions = document.getElementById('investorSuggestions');
    const createSelectedInvestors = document.getElementById('selectedInvestorsContainer');
    let selectedGroupId = null;

    // Function to populate the groups table
    const populateGroupsTable = () => {
        groupsTableBody.innerHTML = "";
        groups.forEach(group => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><input type="checkbox" class="group-checkbox form-check-input"></td>
                <td>${group.name}</td>
                <td>${group.investors.join(", ")}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-group" data-bs-toggle="modal" data-bs-target="#editGroupModal" data-id="${group.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-group" data-bs-toggle="modal" data-bs-target="#deleteGroupModal" data-id="${group.id}">Delete</button>
                </td>
            `;
            groupsTableBody.appendChild(row);
        });
    };

    populateGroupsTable();

    // Populate selected investors in the edit modal
    function populateSelectedInvestors(investors, modal = 'edit') {
        const targetContainer = modal === 'edit' ? editSelectedInvestors : createSelectedInvestors;
        targetContainer.innerHTML = "";
        investors.forEach(investor => {
            const investorChip = document.createElement('div');
            investorChip.classList.add('badge', 'bg-primary', 'text-white', 'd-flex', 'align-items-center', 'mb-2');
            investorChip.textContent = investor;

            const removeIcon = document.createElement('i');
            removeIcon.classList.add('bi', 'bi-x-circle-fill', 'ms-2', 'cursor-pointer');
            removeIcon.addEventListener('click', function () {
                const index = investors.indexOf(investor);
                if (index > -1) {
                    investors.splice(index, 1);
                    populateSelectedInvestors(investors, modal);
                }
            });

            investorChip.appendChild(removeIcon);
            targetContainer.appendChild(investorChip);
        });
    }

    // Handle the search suggestions for adding investors in the edit modal
    editInvestorSearch.addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();
        const filteredInvestors = allInvestors.filter(investor => investor.toLowerCase().includes(searchQuery));

        // Adjust the width of the suggestions box to match the input field width
        editInvestorSuggestions.style.width = editInvestorSearch.offsetWidth + 'px';

        // Show or hide suggestions based on input
        if (searchQuery === '') {
            editInvestorSuggestions.style.display = 'none'; // Hide if input is empty
        } else if (filteredInvestors.length > 0) {
            editInvestorSuggestions.style.display = 'block';
            editInvestorSuggestions.innerHTML = filteredInvestors.map(investor => `
                <div class="list-group-item list-group-item-action" data-investor="${investor}">
                    ${investor}
                </div>
            `).join('');
        } else {
            editInvestorSuggestions.style.display = 'none'; // Hide if no matches
        }
    });

    // Add investor to the selected list in the edit modal
    editInvestorSuggestions.addEventListener('click', function (e) {
        const investorName = e.target.getAttribute('data-investor');
        if (investorName && !editSelectedInvestors.querySelector(`[data-investor="${investorName}"]`)) {
            selectedInvestors.push(investorName);
            populateSelectedInvestors(selectedInvestors, 'edit');
            editInvestorSearch.value = '';
            editInvestorSuggestions.style.display = 'none';
        }
    });

    // Handle the search suggestions for adding investors in the create modal
    createInvestorSearch.addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();
        const filteredInvestors = allInvestors.filter(investor => investor.toLowerCase().includes(searchQuery));

        // Adjust the width of the suggestions box to match the input field width
        createInvestorSuggestions.style.width = createInvestorSearch.offsetWidth + 'px';

        // Show or hide suggestions based on input
        if (searchQuery === '') {
            createInvestorSuggestions.style.display = 'none'; // Hide if input is empty
        } else if (filteredInvestors.length > 0) {
            createInvestorSuggestions.style.display = 'block';
            createInvestorSuggestions.innerHTML = filteredInvestors.map(investor => `
                <div class="list-group-item list-group-item-action" data-investor="${investor}">
                    ${investor}
                </div>
            `).join('');
        } else {
            createInvestorSuggestions.style.display = 'none'; // Hide if no matches
        }
    });

    // Add investor to the selected list in the create modal
    createInvestorSuggestions.addEventListener('click', function (e) {
        const investorName = e.target.getAttribute('data-investor');
        if (investorName && !createSelectedInvestors.querySelector(`[data-investor="${investorName}"]`)) {
            selectedInvestors.push(investorName);
            populateSelectedInvestors(selectedInvestors, 'create');
            createInvestorSearch.value = '';
            createInvestorSuggestions.style.display = 'none';
        }
    });

    // Event listener for edit button
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-group')) {
            selectedGroupId = parseInt(event.target.getAttribute('data-id'));
            const group = groups.find(g => g.id === selectedGroupId);
            if (group) {
                document.getElementById('editGroupName').value = group.name;
                selectedInvestors = [...group.investors];
                populateSelectedInvestors(selectedInvestors, 'edit');
            }
        }
    });

    // Event listener for save changes button in edit modal
    document.getElementById('saveEditGroupChanges').addEventListener('click', function () {
        const updatedGroupName = document.getElementById('editGroupName').value.trim();
        const group = groups.find(g => g.id === selectedGroupId);
        if (group) {
            group.name = updatedGroupName;
            group.investors = [...selectedInvestors];
            populateGroupsTable(); // Refresh the table with updated data
            showToast("Group updated successfully!"); // Show the toast notification
            bootstrap.Modal.getInstance(document.getElementById("editGroupModal")).hide(); // Hide modal
        }
    });

    // Function to show toast notifications
    function showToast(message) {
        const toastEl = document.createElement("div");
        toastEl.className = "toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3";
        toastEl.innerHTML = `<div class="d-flex">
                                <div class="toast-body">${message}</div>
                                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>`;
        document.body.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
        toast.show();
        setTimeout(() => toastEl.remove(), 3000);
    }

    // Function to handle delete action
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-group')) {
            selectedGroupId = parseInt(event.target.getAttribute('data-id'));
            const group = groups.find(g => g.id === selectedGroupId);
            if (group) {
                groupToDeleteName.innerText = group.name; // Display the group name in the confirmation modal
            }
        }
    });

    // Event listener for confirm delete button
    document.getElementById('confirmDeleteGroup').addEventListener("click", function () {
        const group = groups.find(g => g.id === selectedGroupId);
        if (group) {
            // Remove group from the array
            const index = groups.indexOf(group);
            if (index > -1) {
                groups.splice(index, 1);
                populateGroupsTable(); // Refresh the table after deletion
                showToast("Group deleted successfully!"); // Show toast notification after deletion
                bootstrap.Modal.getInstance(deleteGroupModal).hide(); // Close the delete modal
            }
        }
    });

    // Event listener for create group form submission
    document.getElementById('saveNewGroup').addEventListener("click", function () {
        const newGroupName = document.getElementById("newGroupName").value.trim();
        const newInvestorSearch = selectedInvestors;

        let valid = true;

        // Validate Group Name
        if (!newGroupName) {
            valid = false;
            document.getElementById("groupNameError").style.display = "block";
        } else {
            document.getElementById("groupNameError").style.display = "none";
        }

        // Validate Investors
        if (newInvestorSearch.length === 0 || newInvestorSearch[0] === "") {
            valid = false;
            document.getElementById("investorError").style.display = "block";
        } else {
            document.getElementById("investorError").style.display = "none";
        }

        if (valid) {
            // Create new group object
            const newGroup = {
                id: groups.length + 1, // Increment the ID
                name: newGroupName,
                investors: newInvestorSearch
            };

            // Push the new group into the array and refresh the table
            groups.push(newGroup);
            populateGroupsTable(); // Refresh the table with new group data

            // Show success toast notification
            showToast("New group created successfully!");
            bootstrap.Modal.getInstance(document.getElementById("createGroupModal")).hide(); // Close the modal
        }
    });
});
