document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    const totalSteps = 3;

    const updateProgress = () => {
        const progress = (currentStep / totalSteps) * 100;
        document.querySelector("#dealProgressBar").style.width = `${progress}%`;
        document.querySelector("#dealProgressBar").textContent = `Step ${currentStep} of ${totalSteps}`;
    };

    // Function to validate input fields
    const validateStep = (step) => {
        let isValid = true;

        if (step === 1) {
            isValid &= validateField("#dealName", "#dealNameError");
            isValid &= validateField("#dealDescription", "#dealDescriptionError"); // Validate Deal Description
            isValid &= validateField("#dealType", "#dealTypeError");
            isValid &= validateField("#proposalDate", "#proposalDateError");
            isValid &= validateField("#dealClosure", "#dealClosureError");
            isValid &= validateField("#fundingStage", "#fundingStageError");
            isValid &= validateField("#investmentAmount", "#investmentAmountError");
            isValid &= validateField("#equityStake", "#equityStakeError");
        }

        if (step === 2) {
            isValid &= validateField("#goalTitle", "#goalTitleError");
            isValid &= validateField("#goalDescription", "#goalDescriptionError");
            isValid &= validateField("#dueDate", "#dueDateError");
        }

        return isValid;
    };

    // Function to check if a field is empty and show error
    const validateField = (inputSelector, errorSelector) => {
        const input = document.querySelector(inputSelector);
        const error = document.querySelector(errorSelector);
        if (input.value.trim() === "") {
            error.classList.remove("d-none");
            return false;
        } else {
            error.classList.add("d-none");
            return true;
        }
    };

    // Step 1 -> Step 2
    document.querySelector("#nextStep1").addEventListener("click", () => {
        if (!validateStep(1)) return;

        document.querySelector(".step-1").classList.add("d-none");
        document.querySelector(".step-2").classList.remove("d-none");
        currentStep++;
        updateProgress();
    });

    // Step 2 -> Step 3
    document.querySelector("#nextStep2").addEventListener("click", () => {
        if (!validateStep(2)) return;

        document.querySelector(".step-2").classList.add("d-none");
        document.querySelector(".step-3").classList.remove("d-none");

        // Populate Review Section
        document.querySelector("#reviewDealName").textContent = document.querySelector("#dealName").value;
        document.querySelector("#reviewDealDescription").textContent = document.querySelector("#dealDescription").value; // Review Deal Description
        document.querySelector("#reviewDealType").textContent = document.querySelector("#dealType").value;
        document.querySelector("#reviewProposalDate").textContent = document.querySelector("#proposalDate").value;
        document.querySelector("#reviewDealClosure").textContent = document.querySelector("#dealClosure").value;
        document.querySelector("#reviewFundingStage").textContent = document.querySelector("#fundingStage").value;
        document.querySelector("#reviewInvestmentAmount").textContent = document.querySelector("#investmentAmount").value;
        document.querySelector("#reviewEquityStake").textContent = document.querySelector("#equityStake").value ;
        document.querySelector("#reviewDealResourceLink").textContent = document.querySelector("#dealResourceLink").value ;

        document.querySelector("#reviewGoalTitle").textContent = document.querySelector("#goalTitle").value;
        document.querySelector("#reviewGoalDescription").textContent = document.querySelector("#goalDescription").value;
        document.querySelector("#reviewDueDate").textContent = document.querySelector("#dueDate").value;

        currentStep++;
        updateProgress();
    });

    // Back to Step 1
    document.querySelector("#prevStep2").addEventListener("click", () => {
        document.querySelector(".step-2").classList.add("d-none");
        document.querySelector(".step-1").classList.remove("d-none");
        currentStep--;
        updateProgress();
    });

    // Back to Step 2
    document.querySelector("#prevStep3").addEventListener("click", () => {
        document.querySelector(".step-3").classList.add("d-none");
        document.querySelector(".step-2").classList.remove("d-none");
        currentStep--;
        updateProgress();
    });

    // Submit Form (Final Step)
    document.querySelector("#createDealForm").addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Deal Created Successfully!");
        document.querySelector("#createDealModal").classList.remove("show");
        location.reload();
    });
});

//table view
document.addEventListener("DOMContentLoaded", () => {
    const dealsTableBody = document.querySelector("#datatable tbody");
    const editDealModal = document.getElementById("editDealModal");

    // Mock Deals Data (Replace with API Fetch in real implementation)
    const deals = [
        { id: 1, name: "Tech Innovators", type: "Equity Investment", description: "Leading in AI and Robotics", proposalDate: "2024-02-15", createdDate: "2024-01-30", closureDate: "2024-04-10", fundingStage: "Seed Stage", investmentAmount: "$1,500,000", equityStake: "15%", externalResource: "https://www.youtube.com/" },
        { id: 2, name: "Green Energy Corp", type: "Convertible Note", description: "Renewable energy investments", proposalDate: "2024-03-10", createdDate: "2024-02-20", closureDate: "2024-05-05", fundingStage: "Series A", investmentAmount: "$3,200,000", equityStake: "10%", externalResource: "https://www.youtube.com/" }
    ];

    // Function to populate the deals table dynamically
    const populateDealsTable = () => {
        dealsTableBody.innerHTML = "";
        deals.forEach(deal => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="table-column-pe-0">
                    <div class="form-check">
                        <input class="form-check-input row-checkbox" type="checkbox">
                        <label class="form-check-label"></label>
                    </div>
                </td>
                <td>${deal.name}</td>
                <td>${deal.type}</td>
                <td>${deal.description}</td>
                <td>${deal.proposalDate}</td>
                <td>${deal.createdDate}</td>
                <td>${deal.closureDate}</td>
                <td>${deal.fundingStage}</td>
                <td>${deal.investmentAmount}</td>
                <td>${deal.equityStake}</td>
                <td>${deal.externalResource}</td>
                <td>
                    <button class="btn btn-md btn-sm edit-deal" data-bs-toggle="modal" data-bs-target="#editDealModal"
                        data-id="${deal.id}" data-deal-name="${deal.name}" data-deal-type="${deal.type}"
                        data-deal-description="${deal.description}" data-proposal-date="${deal.proposalDate}"
                        data-created-date="${deal.createdDate}" data-deal-closure="${deal.closureDate}"
                        data-funding-stage="${deal.fundingStage}" data-investment-amount="${deal.investmentAmount}"
                        data-equity-stake="${deal.equityStake}" data-external-resource="${deal.externalResource}">
                        <i class="bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-md btn-sm text-danger delete-deal" data-bs-toggle="modal" data-bs-target="#deleteDealModal" data-id="${deal.id}">
                        <i class="bi-trash"></i>
                    </button>
                </td>
            `;
            dealsTableBody.appendChild(row);
        });

        // Attach event listeners after populating the table
        attachEditListeners();
        attachDeleteListeners();
    };

    // Function to populate the Edit Modal when the edit button is clicked
    const attachEditListeners = () => {
        document.querySelectorAll(".edit-deal").forEach(button => {
            button.addEventListener("click", function () {
                const dealId = parseInt(this.getAttribute("data-id"));
                const deal = deals.find(d => d.id === dealId);
    
                if (deal) {
                    document.getElementById("editDealName").value = deal.name;
                    document.getElementById("editDealType").value = deal.type;
                    document.getElementById("editDealDescription").value = deal.description;
                    document.getElementById("editProposalDate").value = deal.proposalDate;
                    document.getElementById("editCreatedDate").value = deal.createdDate;
                    document.getElementById("editDealClosure").value = deal.closureDate;
                    document.getElementById("editFundingStage").value = deal.fundingStage;
                    document.getElementById("editInvestmentAmount").value = deal.investmentAmount;
                    document.getElementById("editPercentage").value = deal.equityStake; 
                    document.getElementById("editResourceLink").value = deal.externalResource; 
                }
            });
        });
    };
    
    
    // Function to attach delete listeners
    const attachDeleteListeners = () => {
        document.querySelectorAll(".delete-deal").forEach(button => {
            button.addEventListener("click", function () {
                const dealId = this.getAttribute("data-id");
                const deal = deals.find(d => d.id == dealId);

                if (deal) {
                    document.getElementById("dealToDeleteName").innerText = deal.name;
                }
            });
        });
    };

    // Function to set the selected value in a dropdown
    function setDropdownValue(dropdown, value) {
        if (dropdown) {
            for (let option of dropdown.options) {
                if (option.value === value) {
                    dropdown.value = value;
                    return;
                }
            }
        }
    }

    // Populate deals table on page load
    populateDealsTable();
});




//progress bar
document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    const totalSteps = 3;

    const updateProgress = () => {
        document.querySelectorAll(".step").forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add("completed");
            } else if (index + 1 === currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active", "completed");
            }
        });

        document.querySelectorAll(".line").forEach((line, index) => {
            if (index + 1 < currentStep) {
                line.classList.add("completed");
            } else {
                line.classList.remove("completed");
            }
        });
    };

    const validateStep = (step) => {
        let isValid = true;
        if (step === 1) {
            isValid &= validateField("#dealName", "#dealNameError");
            isValid &= validateField("#dealDescription", "#dealDescriptionError");
            isValid &= validateField("#dealType", "#dealTypeError");
            isValid &= validateField("#proposalDate", "#proposalDateError");
            isValid &= validateField("#dealClosure", "#dealClosureError");
            isValid &= validateField("#fundingStage", "#fundingStageError");
            isValid &= validateField("#investmentAmount", "#investmentAmountError");
            isValid &= validateField("#equityStake", "#equityStakeError");
        }
        if (step === 2) {
            isValid &= validateField("#goalTitle", "#goalTitleError");
            isValid &= validateField("#goalDescription", "#goalDescriptionError");
            isValid &= validateField("#dueDate", "#dueDateError");
        }

        return isValid;
    };

    const validateField = (inputSelector, errorSelector) => {
        const input = document.querySelector(inputSelector);
        const error = document.querySelector(errorSelector);
        if (input.value.trim() === "") {
            error.classList.remove("d-none");
            return false;
        } else {
            error.classList.add("d-none");
            return true;
        }
    };

    // Next Step
    document.querySelector("#nextStep1").addEventListener("click", () => {
        if (validateStep(1)) {
            document.querySelector(".step-1").classList.add("d-none");
            document.querySelector(".step-2").classList.remove("d-none");
            currentStep++;
            updateProgress();
        }
    });

    document.querySelector("#nextStep2").addEventListener("click", () => {
        if (validateStep(2)) {
            document.querySelector(".step-2").classList.add("d-none");
            document.querySelector(".step-3").classList.remove("d-none");
            currentStep++;
            updateProgress();
        }
    });

    // Back Buttons
    document.querySelector("#prevStep2").addEventListener("click", () => {
        document.querySelector(".step-2").classList.add("d-none");
        document.querySelector(".step-1").classList.remove("d-none");
        currentStep--;
        updateProgress();
    });

    document.querySelector("#prevStep3").addEventListener("click", () => {
        document.querySelector(".step-3").classList.add("d-none");
        document.querySelector(".step-2").classList.remove("d-none");
        currentStep--;
        updateProgress();
    });

    // Form Submission
    document.querySelector("#createDealForm").addEventListener("submit", (event) => {
        if (!validateStep(3)) {
            event.preventDefault();
            return;
        }
        alert("Deal Created Successfully!");
        document.querySelector("#createDealModal").classList.remove("show");
        location.reload();
    });

});



