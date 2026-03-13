// Initialize with empty data structures
if (!window.preRequisiteTestResults) window.preRequisiteTestResults = {
    approvedDrawings: []
};

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('preRequisiteTestResults');
    if (savedResults) {
        try {
            window.preRequisiteTestResults = JSON.parse(savedResults);
        } catch (e) {
            console.error('Error parsing saved data:', e);
        }
    }

    // Generate rows for each table
    generateApprovedDrawingsRows();

    // Load any saved data
    loadPreRequisiteTestData();

    // Attach event listeners to navigation buttons
    attachNavigationEvents();
});

// Function to attach navigation event listeners
function attachNavigationEvents() {
    // Attach to Previous button
    const prevBtn = document.querySelector('button[onclick*="previous"], button[onclick*="Previous"], #prevBtn, .prev-btn');
    if (prevBtn) {
        // Remove existing onclick and add proper event listener
        prevBtn.onclick = null;
        prevBtn.addEventListener('click', goToPreviousPage);
    } else {
        // If no specific button found, check for any button that might navigate
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('previous') || 
                btn.textContent.toLowerCase().includes('back')) {
                btn.onclick = null;
                btn.addEventListener('click', goToPreviousPage);
            }
        });
    }

    // Attach to Next button
    const nextBtn = document.querySelector('button[onclick*="next"], button[onclick*="Next"], #nextBtn, .next-btn');
    if (nextBtn) {
        // Remove existing onclick and add proper event listener
        nextBtn.onclick = null;
        nextBtn.addEventListener('click', goToNext);
    } else {
        // If no specific button found, check for any button that might navigate
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes('next') || 
                btn.textContent.toLowerCase().includes('continue')) {
                btn.onclick = null;
                btn.addEventListener('click', goToNext);
            }
        });
    }

    // Also attach to any existing onclick handlers that might call these functions
    document.body.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            const onclickAttr = e.target.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('goToPreviousPage')) {
                e.preventDefault();
                e.target.onclick = null;
                goToPreviousPage();
            } else if (onclickAttr && onclickAttr.includes('goToNext')) {
                e.preventDefault();
                e.target.onclick = null;
                goToNext();
            }
        }
    });
}

// Function to generate Approved Drawings rows
function generateApprovedDrawingsRows() {
    const tbody = document.getElementById('ApprovedDrawingsTbody');
    if (!tbody) return;

    // Approved Drawings items (sample data - adjust as needed)
    const approvedDrawingsItems = [
        { title: "Telecontrol Overview Drawing", number: "GV TNBD 0614 B02 TOD", revision: "", date: "", ok: false },
        { title: "RTU Configuration Drawing", number: "GV TNBD 0614 B01 RCF", revision: "", date: "", ok: false },
        { title: "RTU Cubicle Internal Wiring Drawing", number: "GV TNBD 0614 V01 RIW", revision: "", date: "", ok: false },
        { title: "RTU Cubicle Drawing", number: "GV TNBD 0614 U01 CDW", revision: "", date: "", ok: false },
        { title: "RTU Parameter List", number: "GV TNBD 0614 T01 PM", revision: "", date: "", ok: false },
        { title: "RTU Cable Drawing", number: "GV TNBD 0614 T11 RCS", revision: "", date: "", ok: false }
    ];

    tbody.innerHTML = ''; // Clear existing rows

    approvedDrawingsItems.forEach((item, index) => {
        const rowNumber = index + 1;
        // Get saved data if it exists
        const savedData = window.preRequisiteTestResults.approvedDrawings && 
                         window.preRequisiteTestResults.approvedDrawings[index] ? 
                         window.preRequisiteTestResults.approvedDrawings[index] : {};
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${item.title}</td>
            <td style="text-align: center;">${item.number}</td>
            <td style="text-align: center;">
                <input type="number" name="approvedDrawing_revision_${rowNumber}" value="${savedData.revision || item.revision}" />
            </td>
            <td style="text-align: center;">
                <input type="date" name="approvedDrawing_date_${rowNumber}" value="${savedData.date || item.date}" />
            </td>
            <td style="text-align: center;">
                <label class="toggle-button">
                    <input type="checkbox" name="approvedDrawing_ok_${rowNumber}" ${(savedData.ok !== undefined ? savedData.ok : item.ok) ? 'checked' : ''}>
                    <span class="toggle-text"></span>
                </label>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Save pre-requisite test data
function savePreRequisiteTestData() {
    console.log('Saving pre-requisite test data...');
    
    // Ensure data structure exists
    if (!window.preRequisiteTestResults) {
        window.preRequisiteTestResults = {
            approvedDrawings: []
        };
    }

    // Clear arrays before saving new data (but preserve the structure)
    window.preRequisiteTestResults.approvedDrawings = [];

    // Save Approved Drawings data
    for (let i = 1; i <= 6; i++) {
        const revisionInput = document.querySelector(`input[name="approvedDrawing_revision_${i}"]`);
        const dateInput = document.querySelector(`input[name="approvedDrawing_date_${i}"]`);
        const okCheckbox = document.querySelector(`input[name="approvedDrawing_ok_${i}"]`);
        
        if (revisionInput && dateInput && okCheckbox) {
            window.preRequisiteTestResults.approvedDrawings.push({
                revision: revisionInput.value,
                date: dateInput.value,
                ok: okCheckbox.checked
            });
        }
    }

    // Save to localStorage
    try {
        localStorage.setItem('preRequisiteTestResults', JSON.stringify(window.preRequisiteTestResults));
        console.log('Data saved successfully:', window.preRequisiteTestResults);
        return true;
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
        return false;
    }
}

// Load pre-requisite test data
function loadPreRequisiteTestData() {
    // Data is already loaded in DOMContentLoaded event
    console.log('Data loaded from localStorage:', window.preRequisiteTestResults);
}

// Navigation functions
function goToPreviousPage() {
    console.log('Going to previous page...');
    
    // Save the data before navigating back
    if (savePreRequisiteTestData()) {
        console.log('Data saved successfully, navigating to BQ.html');
        // Navigate to previous page
        window.location.href = 'BQ.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

function goToNext() {
    console.log('Going to next page...');
    
    // First validate the form
    if (!validateRequiredFields()) {
        alert('Please complete all required fields before continuing & Pre-FAT Result must be passed.');
        return; // Stop navigation if validation fails
    }
    
    // Save the data
    if (savePreRequisiteTestData()) {
        console.log('Data saved successfully, navigating to ProductDeclaration.html');
        // Mark page as completed and navigate
        if (typeof navigationGuard !== 'undefined') {
            navigationGuard.markPageAsCompleted();
        }
        window.location.href = 'ProductDeclaration.html';
    } else {
        alert('Error saving data. Please try again.');
    }
}

// this function to validate required fields
function validateRequiredFields() {
    let isValid = true;
    
    // Reset all error styles first
    document.querySelectorAll('input, select').forEach(element => {
        element.style.borderColor = '';
    });

    // Validate Approved Drawings - ALL checkboxes must be checked
    for (let i = 1; i <= 6; i++) {
        const okCheckbox = document.querySelector(`input[name="approvedDrawing_ok_${i}"]`);
        
        if (!okCheckbox) continue; // Skip if element doesn't exist
        
        if (!okCheckbox.checked) {
            okCheckbox.parentElement.style.border = '1px solid red';
            isValid = false;
        } else {
            // If checkbox is checked, ONLY validate revision field (date is optional now)
            const revision = document.querySelector(`input[name="approvedDrawing_revision_${i}"]`);
            
            if (revision && !revision.value) {
                revision.style.borderColor = 'red';
                isValid = false;
            }
            // Date validation removed - date field is now optional
        }
    }

    // PANEL IP CERTIFICATE VALIDATION - COMMENTED OUT
    /*
    // Validate Panel IP Certificate - At least one must be selected
    const panelIPRadios = document.querySelectorAll('input[name="panelIPCertificate_applicable"]');
    let panelIPSelected = false;
    
    panelIPRadios.forEach(radio => {
        if (radio.checked) {
            panelIPSelected = true;
        }
    });
    
    if (!panelIPSelected) {
        // Highlight all radio buttons or their container to indicate error
        const panelIPContainer = document.querySelector('.Panel-IP-Certificate');
        // Also highlight each radio button
        panelIPRadios.forEach(radio => {
            radio.parentElement.style.border = '1px solid red';
            radio.parentElement.style.padding = '2px';
        });
        isValid = false;
    } else {
        // Remove error styling if valid
        const panelIPContainer = document.querySelector('.Panel-IP-Certificate');
        if (panelIPContainer) {
            panelIPContainer.style.border = '';
            panelIPContainer.style.padding = '';
        }
        panelIPRadios.forEach(radio => {
            radio.parentElement.style.border = '';
            radio.parentElement.style.padding = '';
        });
    }
    */

    // SOFTWARE RECORD VALIDATION - COMMENTED OUT
    /*
    // Validate Software Record - both must be OK
    const softwareOk1 = document.querySelector('input[name="software_ok_1"]');
    const softwareOk2 = document.querySelector('input[name="software_ok_2"]');
    
    if (softwareOk1 && softwareOk2) {
        if (!softwareOk1.checked || !softwareOk2.checked) {
            if (!softwareOk1.checked) softwareOk1.parentElement.style.border = '1px solid red';
            if (!softwareOk2.checked) softwareOk2.parentElement.style.border = '1px solid red';
            isValid = false;
        } else {
            document.querySelectorAll('input[name^="software_ok_"]').forEach(el => {
                el.parentElement.style.border = '';
            });
        }
    }
    */

    return isValid;
}

// Utility functions
function SelectAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function clearAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}