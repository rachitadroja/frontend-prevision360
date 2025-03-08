document.addEventListener("DOMContentLoaded", function () {
    const milestoneTableBody = document.querySelector("#milestoneTableBody");
    let selectedGoalId = null; // To store the goal being edited

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

    const getStatusBadge = (milestone) => {
        if (milestone.is_completed) {
            return `<span class="badge bg-success text-white px-3 py-1">Completed</span>`;
        }
    
        switch (milestone.status) {
            case "draft":
                return `<span class="badge border border-danger text-danger px-3 py-1 fw-bold">Draft</span>`;
            case "inactive":
                return `<span class="badge border border-info text-info px-3 py-1 fw-bold">Inactive</span>`;
            case "active":
                return `<span class="badge border border-primary text-primary px-3 py-1 fw-bold">Active</span>`;
            default:
                return `<span class="badge border border-secondary text-secondary px-3 py-1 fw-bold">Unknown</span>`;
        }
    };

    // Function to toggle milestone status (Active ↔ Inactive)
    const toggleMilestoneStatus = (id) => {
        const milestone = milestones.find(m => m.id === id);

        if (!milestone) return;

        // Toggle between Active and Inactive
        if (milestone.status === "active") {
            milestone.status = "inactive";
        } else if (milestone.status === "inactive") {
            milestone.status = "active";
        }

        // Re-render the table with the updated status
        populateMilestones();
    };


    // Function to delete a draft milestone
    const deleteMilestone = (id) => {
        const milestoneIndex = milestones.findIndex(m => m.id === id);
    
        if (milestoneIndex !== -1 && milestones[milestoneIndex].status === "draft") {
            // Show Bootstrap confirmation modal instead of alert
            const confirmation = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
            document.getElementById("confirmDeleteMessage").innerText = `Are you sure you want to delete "${milestones[milestoneIndex].title}"?`;
            document.getElementById("confirmDeleteBtn").setAttribute("data-id", id);
            confirmation.show();
        }
    };
    
    // Confirm Delete Button Click
    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        const milestoneIndex = milestones.findIndex(m => m.id === id);
    
        if (milestoneIndex !== -1) {
            milestones.splice(milestoneIndex, 1); // Remove from array
            populateMilestones(); // Refresh the table
    
            // Show Toast Notification
            const toast = new bootstrap.Toast(document.getElementById("deleteToast"));
            toast.show();
        }
    
        // Hide confirmation modal
        bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal")).hide();
    });
    

    const attachToggleListeners = () => {
        document.querySelectorAll(".activate-milestone").forEach(button => {
            button.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                toggleMilestoneStatus(id);
            });
        });
    
        document.querySelectorAll(".pause-milestone").forEach(button => {
            button.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                toggleMilestoneStatus(id);
            });
        });
    };
    
    const attachDeleteListeners = () => {
        document.querySelectorAll(".delete-milestone").forEach(button => {
            button.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                deleteMilestone(id);
            });
        });
    };
    
    

    // Function to get deal name by ID
    const getDealName = (dealId) => {
        const deal = deals.find(d => d.id === dealId);
        return deal ? deal.name : `<span class="text-muted">Not Linked</span>`;
    };

    // Function to populate the milestone table
    const populateMilestones = () => {
    milestoneTableBody.innerHTML = "";
    milestones.forEach(milestone => {
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

                    <!-- Show Check if Completed -->
                    ${milestone.is_completed ? 
                        `<i class="bi-check-circle-fill text-success fs-5"></i>` 
                        : `
                        <!-- Toggle Active ↔ Inactive -->
                        ${milestone.status === "inactive" ? `
                            <button class="btn btn-sm p-0 activate-milestone" 
                                data-id="${milestone.id}" title="Activate Milestone">
                                <i class="bi-play-circle-fill text-info fs-5"></i>
                            </button>` : ""}
                        
                        ${milestone.status === "active" ? `
                            <button class="btn btn-sm p-0 pause-milestone" 
                                data-id="${milestone.id}" title="Pause Milestone">
                                <i class="bi-pause-circle-fill text-info fs-5"></i>
                            </button>` : ""}
                        
                        ${milestone.status === "draft" ? `
                            <button class="btn btn-sm p-0 delete-milestone" 
                                data-id="${milestone.id}" title="Delete Milestone">
                                <i class="bi-trash-fill text-danger fs-5"></i>
                            </button>` : ""}

                        <!-- Edit Button (Only if NOT Completed) -->
                        ${!milestone.is_completed ? `
                            <button class="btn btn-sm p-0 edit-milestone" 
                                data-bs-toggle="modal" data-bs-target="#editMilestoneModal"
                                data-id="${milestone.id}" title="Edit Milestone">
                                <i class="bi-pencil-fill fs-5"></i>
                            </button>` : ""}
                        `
                    }
                </div>
            </td>

        `;
        milestoneTableBody.appendChild(row);
    });


        // Attach event listeners for edit buttons after populating table
        attachEditListeners();
        // Attach event listeners for toggle buttons
        attachToggleListeners();
        // Attach event listeners for delete buttons
        attachDeleteListeners();
    };

    // Function to populate the Edit Modal when the edit button is clicked
    const attachEditListeners = () => {
        document.querySelectorAll(".edit-milestone").forEach(button => {
            button.addEventListener("click", function () {
                selectedGoalId = parseInt(this.getAttribute("data-id"));
                const milestone = milestones.find(m => m.id === selectedGoalId);

                if (milestone) {
                    document.getElementById("editMilestoneTitle").value = milestone.title;
                    document.getElementById("editMilestoneDescription").value = milestone.description;
                    document.getElementById("editDueDate").value = milestone.dueDate;
                    document.getElementById("editCompletionDate").value = milestone.completionDate;
                    document.getElementById("editCreationDate").value = milestone.creationDate;
                    document.getElementById("editModifiedDate").value = milestone.modifiedDate;

                    // Handle Completion Checkbox
                    const markCompletedCheckbox = document.getElementById("markCompleted");
                    markCompletedCheckbox.checked = milestone.is_completed;
                    markCompletedCheckbox.disabled = milestone.is_completed;

                    // Populate the deals dropdown dynamically
                    const dealDropdown = document.getElementById("editMilestoneDeal");
                    dealDropdown.innerHTML = `<option value="" disabled>Select a Deal</option>`;
                    deals.forEach(deal => {
                        const option = document.createElement("option");
                        option.value = deal.id;
                        option.textContent = deal.name;
                        if (deal.id === milestone.dealId) option.selected = true;
                        dealDropdown.appendChild(option);
                    });

                    // If already completed, disable all fields
                    if (milestone.is_completed) {
                        disableEditing();
                    } else {
                        enableEditing();
                    }
                }
            });
        });
    };

    // Function to disable editing if milestone is completed
    const disableEditing = () => {
        document.getElementById("editMilestoneTitle").disabled = true;
        document.getElementById("editMilestoneDescription").disabled = true;
        document.getElementById("editMilestoneDeal").disabled = true;
        document.getElementById("editDueDate").disabled = true;
        document.getElementById("editModifiedDate").disabled = true;
        document.querySelector(".btn-primary").style.display = "none";
    };

    // Function to enable editing if milestone is not completed
    const enableEditing = () => {
        document.getElementById("editMilestoneTitle").disabled = false;
        document.getElementById("editMilestoneDescription").disabled = false;
        document.getElementById("editMilestoneDeal").disabled = false;
        document.getElementById("editDueDate").disabled = false;
        document.getElementById("editModifiedDate").disabled = false;
        document.querySelector(".btn-primary").style.display = "inline-block";
    };

    // Handle marking as complete
    document.getElementById("markCompleted").addEventListener("change", function () {
        if (this.checked) {
            const today = new Date().toISOString().split("T")[0];
            document.getElementById("editCompletionDate").value = today;
            disableEditing();

            // Send update request to backend
            fetch(`/api/milestones/${selectedGoalId}/complete`, {
                method: "POST",
                body: JSON.stringify({ completion_date: today }),
                headers: { "Content-Type": "application/json" }
            }).then(() => {
                // Update the milestone in UI and refresh table
                const milestone = milestones.find(m => m.id === selectedGoalId);
                if (milestone) {
                    milestone.is_completed = true;
                    milestone.completionDate = today;
                    populateMilestones();
                }
            });
        }
    });

    // Populate table on page load
    populateMilestones();
});


//Deals Dropdown Dynamically in add goal
document.addEventListener("DOMContentLoaded", function () {
    const dealsDropdown = document.getElementById("milestoneDeals");

    // Sample Deals Array (Replace with API or Dynamic Data Fetching)
    const deals = [
        { id: 1, name: "Tech Innovators" },
        { id: 2, name: "Green Energy Corp" }
    ];

    // Function to Populate Dropdown
    function populateDealsDropdown() {
        dealsDropdown.innerHTML = '<option value="" disabled selected>Select deals</option>'; // Reset first
        deals.forEach(deal => {
            let option = document.createElement("option");
            option.value = deal.id;
            option.textContent = deal.name;
            dealsDropdown.appendChild(option);
        });
    }

    // Call Function to Populate Deals
    populateDealsDropdown();
});



