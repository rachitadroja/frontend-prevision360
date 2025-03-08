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

        // Filter milestones
        const filteredMilestones = milestones.filter(milestone => {
            if (selectedStatus === "all") return true;
            if (selectedStatus === "completed") return milestone.is_completed;
            return milestone.status === selectedStatus;
        });

        if (filteredMilestones.length === 0) {
            milestoneTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No results found</td></tr>`;
            return;
        }

        // Render filtered milestones
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
                const index = milestones.findIndex(m => m.id === id);
                if (index !== -1 && milestones[index].status === "draft") {
                    milestones.splice(index, 1);
                    populateMilestones();
                }
            });
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

    // Populate milestones on page load
    populateMilestones();
});
