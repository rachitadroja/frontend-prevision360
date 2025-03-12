document.addEventListener("DOMContentLoaded", () => {
    const dealsTableBody = document.querySelector("#datatable tbody");
    const createDealForm = document.getElementById("createDealForm");
    const editDealForm = document.getElementById("editDealForm");
    const confirmDeleteDealBtn = document.getElementById("confirmDeleteDeal");

    let deals = [
        { id: 1, name: "Tech Innovators", type: "Equity Investment", description: "Leading in AI and Robotics", proposalDate: "2024-02-15", createdDate: "2024-01-30", closureDate: "2024-04-10", fundingStage: "Seed Stage", investmentAmount: "$1,500,000", equityStake: "15%", externalResource: "https://www.youtube.com/", status: "active", is_closed: false },
        { id: 2, name: "Green Energy Corp", type: "Convertible Note", description: "Renewable energy investments", proposalDate: "2024-03-10", createdDate: "2024-02-20", closureDate: "2024-05-05", fundingStage: "Series A", investmentAmount: "$3,200,000", equityStake: "10%", externalResource: "https://www.youtube.com/", status: "inactive", is_closed: false },
        { id: 3, name: "Health Innovations", type: "Venture Debt", description: "Revolutionizing healthcare through technology", proposalDate: "2024-03-25", createdDate: "2024-03-01", closureDate: "2024-06-15", fundingStage: "Pre-Seed", investmentAmount: "$500,000", equityStake: "5%", externalResource: "https://www.youtube.com/", status: "draft", is_closed: false },
        { id: 4, name: "EduTech Solutions", type: "Equity Investment", description: "Improving education with technology", proposalDate: "2024-04-05", createdDate: "2024-03-15", closureDate: "2024-07-20", fundingStage: "Series B", investmentAmount: "$2,000,000", equityStake: "8%", externalResource: "https://www.youtube.com/", status: "closed", is_closed: true }
    ];

    let selectedDealId = null;

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

    const getStatusBadge = (status) => {
        const statusColors = {
            draft: "border border-danger text-danger",
            active: "border border-primary text-primary",
            inactive: "border border-info text-info",
            closed: "bg-success text-white"
        };
        return `<span class="badge ${statusColors[status]} px-3 py-1 fw-bold">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
    };

    const getActionButtons = (deal) => {
        let actions = "";
        if (deal.is_closed) {
            // If the deal is closed, show a disabled state or modify the buttons accordingly
            actions += `<div class="d-flex justify-content-center align-items-center">
            <i class="bi-lock-fill text-secondary fs-5" title="Deal Closed"></i>
        </div>`;
        } else {
            // Active or inactive buttons depending on the deal's status
            if (deal.status === "inactive") {
                actions += `<button class="btn btn-sm p-0 activate-deal" data-id="${deal.id}" title="Activate">
                                <i class="bi-play-circle-fill text-info fs-5"></i>
                            </button>`;
            }
            if (deal.status === "active") {
                actions += `<button class="btn btn-sm p-0 pause-deal" data-id="${deal.id}" title="Pause">
                                <i class="bi-pause-circle-fill text-primary fs-5 mx-1"></i>
                            </button>`;
            }
            // Edit and delete buttons are only shown if the deal is not closed
            actions += `<button class="btn btn-sm p-0 edit-deal" data-bs-toggle="modal" data-bs-target="#editDealModal" data-id="${deal.id}" title="Edit">
                            <i class="bi-pencil-fill fs-5 mx-1"></i>
                        </button>
                        <button class="btn btn-sm p-0 text-danger delete-deal" data-bs-toggle="modal" data-bs-target="#deleteDealModal" data-id="${deal.id}" title="Delete">
                            <i class="bi-trash-fill fs-5"></i>
                        </button>`;
        }
        return actions;
    };
    

    const populateDealsTable = () => {
        // Sort deals to ensure closed deals are at the bottom and others are sorted by createdDate descending
        deals.sort((a, b) => {
            // Prioritize open deals over closed ones
            if (!a.is_closed && b.is_closed) return -1;
            if (a.is_closed && !b.is_closed) return 1;
    
            // If both are open or both are closed, sort by createdDate descending
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
    
        // Clear the table
        dealsTableBody.innerHTML = "";
    
        // Populate the table with sorted deals
        deals.forEach(deal => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="deal-checkbox form-check-input"></td>
                <td>${deal.name}</td>
                <td>${deal.type}</td>
                <td>${deal.description}</td>
                <td>${deal.proposalDate}</td>
                <td>${deal.createdDate}</td>
                <td>${deal.closureDate}</td>
                <td>${deal.fundingStage}</td>
                <td>${deal.investmentAmount}</td>
                <td>${deal.equityStake}</td>
                <td><a href="${deal.externalResource}" target="_blank">View</a></td>
                <td>${getStatusBadge(deal.status)}</td>
                <td>${getActionButtons(deal)}</td>
            `;
            dealsTableBody.appendChild(row);
        });
    
        // Reattach event listeners for editing and deleting deals
        attachEditListeners();
        attachDeleteListeners();
        attachStatusListeners();
    };

    function validateCreateDealForm() {
        let isValid = true; // Flag to track overall form validity
        const form = document.getElementById("createDealForm");
        const name = form.querySelector("#dealName");
        const type = form.querySelector("#dealType");
        const description = form.querySelector("#dealDescription");
        const proposalDate = form.querySelector("#proposalDate");
        const closureDate = form.querySelector("#dealClosure");
        const fundingStage = form.querySelector("#fundingStage");
        const investmentAmount = form.querySelector("#investmentAmount");
        const equityStake = form.querySelector("#equityStake");
        const status = form.querySelector("#dealStatus");
    
        // Helper function to show error messages
        function showError(input, message) {
            const errorDiv = input.nextElementSibling;
            errorDiv.innerText = message;
            errorDiv.classList.remove("d-none");
            isValid = false;
        }
    
        // Clear all existing errors
        form.querySelectorAll(".text-danger").forEach(element => element.classList.add("d-none"));
    
        // Validation checks
        if (!name.value.trim()) showError(name, "Deal name is required.");
        if (type.selectedIndex === 0) showError(type, "Deal type is required.");
        if (!description.value.trim()) showError(description, "Description is required.");
        if (!proposalDate.value) showError(proposalDate, "Proposal date is required.");
        if (!closureDate.value) showError(closureDate, "Closure date is required.");
        if (fundingStage.selectedIndex === 0) showError(fundingStage, "Funding stage is required.");
        if (!investmentAmount.value || isNaN(investmentAmount.value) || Number(investmentAmount.value) <= 0)
            showError(investmentAmount, "Valid investment amount is required.");
        if (!equityStake.value || isNaN(equityStake.value) || Number(equityStake.value) < 0 || Number(equityStake.value) > 100)
            showError(equityStake, "Percentage must be between 0 and 100.");
        if (status.selectedIndex === 0) showError(status, "Status is required.");
    
        return isValid;
    }

    document.getElementById("createDealForm").addEventListener("submit", function(e) {
        e.preventDefault();
        if (validateCreateDealForm()) {
            const newDeal = {
                id: deals.length + 1, // Increment ID; consider using a more robust method in production
                name: document.getElementById("dealName").value,
                type: document.getElementById("dealType").value,
                description: document.getElementById("dealDescription").value,
                proposalDate: document.getElementById("proposalDate").value,
                createdDate: new Date().toISOString().split('T')[0], // Assume creation date is today
                closureDate: document.getElementById("dealClosure").value,
                fundingStage: document.getElementById("fundingStage").value,
                investmentAmount: document.getElementById("investmentAmount").value,
                equityStake: document.getElementById("equityStake").value,
                externalResource: document.getElementById("dealResourceLink").value,
                status: document.getElementById("dealStatus").value,
                is_closed: document.getElementById("dealStatus").value === "closed"
            };
    
            deals.push(newDeal);
            populateDealsTable();
            showToast("New deal created successfully!");
            bootstrap.Modal.getInstance(document.getElementById("createDealModal")).hide();
            this.reset(); // Reset the form after successful submission
        }
    });
    
    

    const attachEditListeners = () => {
        document.querySelectorAll(".edit-deal").forEach(button => {
            button.addEventListener("click", function () {
                selectedDealId = parseInt(this.getAttribute("data-id"));
                const deal = deals.find(d => d.id === selectedDealId);
                if (deal) {
                    console.log(deal);
                    $('#editDealModal').off('shown.bs.modal').on('shown.bs.modal', function () {
                        const deal = deals.find(d => d.id === selectedDealId);
                        if (deal) {
                            document.getElementById("editDealName").value = deal.name;
                            document.getElementById("editDealType").value = deal.type;
                            document.getElementById("editDealDescription").value = deal.description;
                            document.getElementById("editProposalDate").value = deal.proposalDate;
                            document.getElementById("editCreatedDate").value = deal.createdDate;
                            document.getElementById("editDealClosure").value = deal.closureDate;
                            document.getElementById("editFundingStage").value = deal.fundingStage;
                            document.getElementById("editInvestmentAmount").value = deal.investmentAmount.replace(/[^\d.-]/g, '');
                            document.getElementById("editPercentage").value = parseFloat(deal.equityStake.replace('%', ''));
                            document.getElementById("editResourceLink").value = deal.externalResource;
                            document.getElementById('editDealStatus').value = deal.status;  // Set status dropdown
                            document.getElementById('dealCloseCheckbox').checked = deal.is_closed;  // Set the checkbox based on is_closed status
                        }
                    });
                }
            });
        });
    };

    editDealForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const deal = deals.find(d => d.id === selectedDealId);
        if (deal) {
            deal.name = document.getElementById("editDealName").value;
            deal.type = document.getElementById("editDealType").value;
            deal.description = document.getElementById("editDealDescription").value;
            deal.proposalDate = document.getElementById("editProposalDate").value;
            deal.createdDate = document.getElementById("editCreatedDate").value;
            deal.closureDate = document.getElementById("editDealClosure").value;
            deal.fundingStage = document.getElementById("editFundingStage").value;
            deal.investmentAmount = document.getElementById("editInvestmentAmount").value.replace(/[^\d.-]/g, '');
            deal.equityStake = document.getElementById("editPercentage").value;
            deal.externalResource = document.getElementById("editResourceLink").value;
            // Check if the deal should be closed
            if (document.getElementById('dealCloseCheckbox').checked) {
                deal.status = 'closed';  // Set the status to 'closed'
                deal.is_closed = true;    // Mark the deal as closed
            } else {
                deal.status = document.getElementById('editDealStatus').value;  // Only update status from dropdown if not closing
                deal.is_closed = false;   // Ensure the deal is marked as not closed if the checkbox is not checked
            }

            populateDealsTable(); // Update the table to reflect the changes
            showToast("Deal updated successfully."); // Show toast notification

            let editModal = bootstrap.Modal.getInstance(document.getElementById("editDealModal"));
            editModal.hide(); // Hide the modal
        }
    });

    document.getElementById('dealCloseCheckbox').addEventListener('change', function() {
        const isClosed = this.checked;
        const statusDropdown = document.getElementById('editDealStatus');
        if (isClosed) {
            statusDropdown.value = 'closed';
            statusDropdown.disabled = true;
        } else {
            statusDropdown.disabled = false;
        }
    });
    

    const attachDeleteListeners = () => {
        document.querySelectorAll(".delete-deal").forEach(button => {
            button.addEventListener("click", function () {
                selectedDealId = parseInt(this.getAttribute("data-id"));
                const deal = deals.find(d => d.id === selectedDealId);
                if (deal) {
                    document.getElementById("dealToDeleteName").innerText = deal.name;
                }
            });
        });

    confirmDeleteDealBtn.addEventListener("click", () => {
            deals = deals.filter(deal => deal.id !== selectedDealId);
            populateDealsTable();
            showToast("Deal deleted successfully!");
            let deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteDealModal"));
            deleteModal.hide();
        });
    };

    const attachStatusListeners = () => {
        document.querySelectorAll(".activate-deal, .pause-deal").forEach(button => {
            button.addEventListener("click", function () {
                const dealId = parseInt(this.getAttribute("data-id"));
                const deal = deals.find(d => d.id === dealId);
                if (deal) {
                    deal.status = deal.status === "active" ? "inactive" : "active";
                    populateDealsTable();
                }
            });
        });
    };

    document.querySelectorAll('.deal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const totalSelected = document.querySelectorAll('.deal-checkbox:checked').length;
            document.getElementById('selectedCount').innerText = `${totalSelected} Selected`;  // Update the displayed count
        });
    });
    
    


    populateDealsTable();
});


