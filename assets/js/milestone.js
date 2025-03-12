document.addEventListener("DOMContentLoaded", function () {
    const milestoneTableBody = document.querySelector("#milestoneTableBody");
    let selectedGoalId = null; // To store the goal being edited
    let selectedStatus = "all"; // Default filter

    // Mock Deals & Milestones (Replace with API Fetch in real implementation)
    const deals = [
        { id: 1, name: "Green Energy Corp" },
        { id: 2, name: "Tech Innovators" },
        { id: 3, name: "NextGen Startups" }
    ];

    const milestones = [
        { id: 1, title: "Project Kickoff", description: "Initial project planning", dealId: 1, dueDate: "2025-03-01", completionDate: "", creationDate: "2025-02-20", modifiedDate: "2025-02-25", status: "active", is_completed: false },
        { id: 2, title: "Requirement Gathering", description: "Collect project requirements", dealId: 2, dueDate: "2025-03-10", completionDate: "2025-03-14", creationDate: "2025-02-22", status: "inactive", modifiedDate: "2025-02-26", is_completed: true },
        { id: 3, title: "Frontend", description: "Wireframing and UI/UX", dealId: null, dueDate: "2025-04-10", completionDate: "", creationDate: "2025-03-22", modifiedDate: "2025-03-26", status: "draft", is_completed: false },
        { id: 4, title: "Backend", description: "API development", dealId: 3, dueDate: "2025-05-10", completionDate: "", creationDate: "2025-04-22", modifiedDate: "2025-04-26", status: "active", is_completed: false },
        { id: 5, title: "Backend", description: "API development", dealId: 3, dueDate: "2025-05-10", completionDate: "", creationDate: "2025-04-22", modifiedDate: "2025-04-26", status: "inactive", is_completed: false }
    ];

     // **Validation & Goal Creation**
    const addMilestoneForm = document.getElementById("addMilestoneForm");

    function validateGoalForm() {
        let isValid = true;
        const titleInput = document.getElementById("milestoneTitle");
        const descriptionInput = document.getElementById("milestoneDescription");
        const dueDateInput = document.getElementById("dueDate");
        const dealsDropdown = document.getElementById("milestoneDeals");

        const titleError = document.getElementById("milestoneTitleError");
        const descriptionError = document.getElementById("milestoneDescriptionError");
        const dueDateError = document.getElementById("dueDateError");
        const dealsError = document.getElementById("milestoneDealsError");

        // Clear previous errors
        titleError.classList.add("d-none");
        descriptionError.classList.add("d-none");
        dueDateError.classList.add("d-none");
        dealsError.classList.add("d-none");

        // Title validation
        if (titleInput.value.trim() === "") {
            titleError.classList.remove("d-none");
            isValid = false;
        }

        // Description validation
        if (descriptionInput.value.trim() === "") {
            descriptionError.classList.remove("d-none");
            isValid = false;
        }

        // Due Date validation: Cannot be in the past or today
        const today = new Date();
        const selectedDate = new Date(dueDateInput.value);

        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        if (selectedDate <= today) {
            dueDateError.classList.remove("d-none");
            isValid = false;
        }

        // Deals validation
        if (dealsDropdown.value === "") {
            dealsError.classList.remove("d-none");
            isValid = false;
        }

        return isValid;
    }

    // Handle Goal Creation
    addMilestoneForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (validateGoalForm()) {
            const newGoal = {
                id: Math.floor(Math.random() * 1000), // Random ID
                title: document.getElementById("milestoneTitle").value,
                description: document.getElementById("milestoneDescription").value,
                dueDate: document.getElementById("dueDate").value,
                creationDate: new Date().toISOString().split("T")[0],
                modifiedDate: new Date().toISOString().split("T")[0],
                status: "draft",
                is_completed: false,
                dealId: document.getElementById("milestoneDeals").value
            };

            milestones.push(newGoal); // Add goal to list
            populateMilestones();
            showToast("Goal created successfully!");

            let addModal = bootstrap.Modal.getInstance(document.getElementById("addMilestoneModal"));
            addModal.hide();

            addMilestoneForm.reset();
        }
    });

    // Function to return status badge
    const getStatusBadge = (milestone) => {
        if (milestone.is_completed) {
            return `<span class="badge bg-success text-white px-3 py-1">Completed</span>`;
        }

        const statusColors = {
            draft: "border border-danger text-danger",
            inactive: "border border-info text-info",
            active: "border border-primary text-primary"
        };

        return `<span class="badge ${statusColors[milestone.status] || 'border border-secondary text-secondary'} px-3 py-1 fw-bold">${milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}</span>`;
    };

    // Function to get deal name
    const getDealName = (dealId) => {
        const deal = deals.find(d => d.id === dealId);
        return deal ? deal.name : `<span class="text-muted">Not Linked</span>`;
    };

    // Function to generate milestone actions (Edit, Delete, Activate/Pause)
    const getMilestoneActions = (milestone) => {
        if (milestone.is_completed) return `<i class="bi-check-circle-fill text-success fs-5"></i>`; // ✅ Completed Icon

        let actions = "";

        if (milestone.status === "inactive") {
            actions += `
                <button class="btn btn-sm p-0 activate-milestone" data-id="${milestone.id}" title="Activate">
                    <i class="bi-play-circle-fill text-info fs-5"></i>
                </button>`;
        }

        if (milestone.status === "active") {
            actions += `
                <button class="btn btn-sm p-0 pause-milestone" data-id="${milestone.id}" title="Pause">
                    <i class="bi-pause-circle-fill text-info fs-5"></i>
                </button>`;
        }

        if (milestone.status === "draft") {
            actions += `
                <button class="btn btn-sm p-0 delete-milestone" data-id="${milestone.id}" title="Delete">
                    <i class="bi-trash-fill text-danger fs-5"></i>
                </button>`;
        }

        if (!milestone.is_completed) {
            actions += `
                <button class="btn btn-sm p-0 edit-milestone" data-bs-toggle="modal" data-bs-target="#editMilestoneModal" data-id="${milestone.id}" title="Edit">
                    <i class="bi-pencil-fill fs-5"></i>
                </button>`;
        }

        return actions;
    };

    // Populate Milestones Table
    const populateMilestones = () => {
        milestoneTableBody.innerHTML = "";
    
        // Filter milestones based on the selected status
        let filteredMilestones = milestones.filter(milestone => {
            if (selectedStatus === "all") return true;
            if (selectedStatus === "completed") return milestone.is_completed;
            return milestone.status === selectedStatus;
        });
    
        // Sort milestones: Move completed ones to the end
        filteredMilestones.sort((a, b) => {
            if (a.is_completed && !b.is_completed) return 1;  // Completed moves to the bottom
            if (!a.is_completed && b.is_completed) return -1; // Keep non-completed on top
            return 0; // Maintain order for others
        });
    
        if (filteredMilestones.length === 0) {
            milestoneTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No results found</td></tr>`;
            return;
        }
    
        // Render sorted milestones
        filteredMilestones.forEach(milestone => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${milestone.title}</td>
                <td>${milestone.description}</td>
                <td>${getDealName(milestone.dealId)}</td>
                <td>${milestone.dueDate}</td>
                <td>${milestone.completionDate || '<span class="text-muted">Pending</span>'}</td>
                <td>${milestone.creationDate}</td>
                <td>${milestone.modifiedDate}</td>
                <td>${getStatusBadge(milestone)}</td>
                <td class="actions-column">
                    <div class="d-flex align-items-center justify-content-center gap-3">
                        ${getMilestoneActions(milestone)}
                    </div>
                </td>`;
            milestoneTableBody.appendChild(row);
        });
    
        attachListeners();
    };
        

    // Attach event listeners for toggles, deletes, edits
    const attachListeners = () => {
        document.querySelectorAll(".activate-milestone, .pause-milestone").forEach(button => {
            button.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                const milestone = milestones.find(m => m.id === id);
                if (milestone) milestone.status = milestone.status === "active" ? "inactive" : "active";
                populateMilestones();
            });
        });

        document.querySelectorAll(".delete-milestone").forEach(button => {
            button.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                const milestone = milestones.find(m => m.id === id);
        
                if (milestone && milestone.status === "draft") {
                    // Set confirmation message
                    document.getElementById("confirmDeleteMessage").innerText = 
                        `Are you sure you want to delete "${milestone.title}"?`;
        
                    // Store the ID of the milestone being deleted
                    document.getElementById("confirmDeleteBtn").setAttribute("data-id", id);
        
                    // Show the confirmation modal
                    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
                    confirmDeleteModal.show();
                }
            });
        });
        
        // Handle Delete Confirmation Button
        document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
            const id = parseInt(this.getAttribute("data-id"));
            const index = milestones.findIndex(m => m.id === id);
        
            if (index !== -1) {
                milestones.splice(index, 1); // Remove milestone from list
                populateMilestones(); // Re-render milestone list
        
                // Show delete success toast
                const deleteToastEl = document.getElementById("deleteToast");
                const toast = new bootstrap.Toast(deleteToastEl);
                toast.show();
        
                // Close the confirmation modal
                const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
                confirmDeleteModal.hide();
            }
        });
        
        

        document.querySelectorAll(".edit-milestone").forEach(button => {
            button.addEventListener("click", function () {
                selectedGoalId = parseInt(this.getAttribute("data-id"));
                const milestone = milestones.find(m => m.id === selectedGoalId);
                if (milestone) {
                    document.getElementById("editMilestoneTitle").value = milestone.title;
                    document.getElementById("editMilestoneDescription").value = milestone.description;
                }
            });
        });
    };

    // Filter by status
    document.querySelectorAll(".filter-status").forEach(option => {
        option.addEventListener("click", function (e) {
            e.preventDefault();
            selectedStatus = this.dataset.status;
            document.getElementById("filterDropdown").innerHTML = `<i class="bi-funnel"></i> ${this.textContent}`;
            populateMilestones();
        });
    });
    
    // Populate Deals Dropdown in Add/Edit Modal
    const populateDealsDropdown = (dropdownId, selectedDealId = null) => {
        const dealsDropdown = document.getElementById(dropdownId);
        if (!dealsDropdown) return;

        dealsDropdown.innerHTML = `<option value="" selected>Select a Deal</option>`;
        deals.forEach(deal => {
            const option = document.createElement("option");
            option.value = deal.id;
            option.textContent = deal.name;
            if (deal.id === selectedDealId) option.selected = true;
            dealsDropdown.appendChild(option);
        });
    };

    document.getElementById("addMilestoneModal").addEventListener("show.bs.modal", () => {
        populateDealsDropdown("milestoneDeals");
    });


    // Populate Edit Goal modal
    document.addEventListener("click", function (event) {
        if (event.target.closest(".edit-milestone")) {
            selectedGoalId = parseInt(event.target.closest(".edit-milestone").getAttribute("data-id"));
            const milestone = milestones.find(m => m.id === selectedGoalId);
            if (milestone) {
                document.getElementById("editMilestoneTitle").value = milestone.title;
                document.getElementById("editMilestoneDescription").value = milestone.description;
                document.getElementById("editDueDate").value = milestone.dueDate;
                document.getElementById("editCreationDate").value = milestone.creationDate;
                document.getElementById("editModifiedDate").value = milestone.modifiedDate;
                document.getElementById("editCompletionDate").value = milestone.completionDate;
                document.getElementById("markCompleted").checked = milestone.is_completed;
                
                // Populate Status Dropdown
                const statusDropdown = document.getElementById("editMilestoneStatus");
                statusDropdown.innerHTML = `
                    <option value="draft" ${milestone.status === "draft" ? "selected" : ""}>Draft</option>
                    <option value="active" ${milestone.status === "active" ? "selected" : ""}>Active</option>
                    <option value="inactive" ${milestone.status === "inactive" ? "selected" : ""}>Inactive</option>
                `;
    
                populateDealsDropdown("editMilestoneDeal", milestone.dealId);
            }
        }
    });

// Save Changes - Update Status, Show Toast & Close Modal
document.getElementById("editMilestoneForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const milestone = milestones.find(m => m.id === selectedGoalId);
    if (milestone) {
        milestone.title = document.getElementById("editMilestoneTitle").value;
        milestone.description = document.getElementById("editMilestoneDescription").value;
        milestone.dueDate = document.getElementById("editDueDate").value;
        milestone.modifiedDate = new Date().toISOString().split("T")[0]; // Update modified date
        milestone.is_completed = document.getElementById("markCompleted").checked;
        milestone.status = document.getElementById("editMilestoneStatus").value; // Get new status

        populateMilestones();
        showToast("Milestone updated successfully.");

        // Close modal after saving
        let editModal = bootstrap.Modal.getInstance(document.getElementById("editMilestoneModal"));
        editModal.hide();
    }
});
    
    // Toast Notification
    function showToast(message) {
        const toastEl = document.createElement("div");
        toastEl.className = "toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3 show";
        toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
    }


    // Populate milestones on page load
    populateMilestones();
});
