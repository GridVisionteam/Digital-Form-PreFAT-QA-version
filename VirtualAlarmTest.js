// Initialize with empty data structures
if (!window.virtualAlarmTestResults) window.virtualAlarmTestResults = {
    virtualAlarmTests: {}
};

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('virtualAlarmTestResults');
    if (savedResults) {
        window.virtualAlarmTestResults = JSON.parse(savedResults);
    }

    // Generate rows for virtual alarm tests
    generateVirtualAlarmTestRows();

    // Load any saved data
    loadVirtualAlarmTestData();
    
    // Add input restrictions to allow numbers and dash
    addVirtualAlarmInputRestrictions();
});

// Function to generate rows for Virtual Alarm Test
function generateVirtualAlarmTestRows() {
    const tbody = document.getElementById('VirtualAlarmTestTbody');
    if (!tbody) return;

    // Virtual Alarm Test items
    const virtualAlarmTests = [
        {
            alarm: "SOE Buffer Full",
            iec101IOA: "950",
            iec104IOA: "950",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "Time Sync Alarm",
            iec101IOA: "951",
            iec104IOA: "951",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "RTU Health/Comm Fail",
            iec101IOA: "953",
            iec104IOA: "953",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "DI Module Fail",
            iec101IOA: "954",
            iec104IOA: "954",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "DO Module Fail",
            iec101IOA: "955",
            iec104IOA: "955",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "AI Module Fail",
            iec101IOA: "956",
            iec104IOA: "956",
            editable: true,
            defaultIEC101Checked: false,
            defaultIEC104Checked: false
        },
        {
            alarm: "AO Module Fail",
            iec101IOA: "957",
            iec104IOA: "957",
            editable: true,
            defaultIEC101Checked: false,
            defaultIEC104Checked: false
        }
    ];

    virtualAlarmTests.forEach((item, index) => {
        const rowNumber = index + 1;
        const row = document.createElement('tr');
        
        // Create input fields for editable IOAs - changed from type="number" to type="text"
        const iec101IOACell = item.editable 
            ? `<td style="text-align: center;"><input type="text" name="virtualAlarm_${rowNumber}_iec101IOA" value="${item.iec101IOA}" style="width: 60px;" class="virtual-alarm-ioa-input"></td>`
            : `<td style="text-align: center;">${item.iec101IOA}</td>`;
            
        const iec104IOACell = item.editable 
            ? `<td style="text-align: center;"><input type="text" name="virtualAlarm_${rowNumber}_iec104IOA" value="${item.iec104IOA}" style="width: 60px;" class="virtual-alarm-ioa-input"></td>`
            : `<td style="text-align: center;">${item.iec104IOA}</td>`;

        // Use the default checked values from the item configuration
        const iec101Checked = '';  // Always empty (unchecked)
        const iec104Checked = '';  // Always empty (unchecked)

        row.innerHTML = `
            <td style="text-align: left;">${item.alarm}</td>
            ${iec101IOACell}
            <td style="text-align: center;">
                <label class="toggle-button">
                    <input type="checkbox" name="virtualAlarm_${rowNumber}_iec101" ${iec101Checked}>
                    <span class="toggle-text"></span>
                </label>
            </td>
            ${iec104IOACell}
            <td style="text-align: center;">
                <label class="toggle-button">
                    <input type="checkbox" name="virtualAlarm_${rowNumber}_iec104" ${iec104Checked}>
                    <span class="toggle-text"></span>
                </label>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Save virtual alarm test data
function saveVirtualAlarmTestData() {
    // Ensure the test results object has the proper structure
    window.virtualAlarmTestResults = window.virtualAlarmTestResults || {};
    window.virtualAlarmTestResults.virtualAlarmTests = window.virtualAlarmTestResults.virtualAlarmTests || {};

    // Save Virtual Alarm Test results
    for (let itemNum = 1; itemNum <= 7; itemNum++) {
        const iec101Checked = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101"]`)?.checked || false;
        const iec104Checked = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104"]`)?.checked || false;
        
        // Get IOA values if they exist (for editable fields)
        const iec101IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101IOA"]`);
        const iec104IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104IOA"]`);
        
        const iec101IOA = iec101IOAInput ? iec101IOAInput.value : null;
        const iec104IOA = iec104IOAInput ? iec104IOAInput.value : null;

        window.virtualAlarmTestResults.virtualAlarmTests[`item_${itemNum}`] = {
            iec101: iec101Checked ? 'OK' : 'NO',
            iec104: iec104Checked ? 'OK' : 'NO',
            iec101IOA: iec101IOA,
            iec104IOA: iec104IOA
        };
    }

    // Save to session storage
    localStorage.setItem('virtualAlarmTestResults', JSON.stringify(window.virtualAlarmTestResults));
}

// Load virtual alarm test data
function loadVirtualAlarmTestData() {
    // Ensure we have a valid virtualAlarmTestResults object with the expected structure
    window.virtualAlarmTestResults = window.virtualAlarmTestResults || {};
    window.virtualAlarmTestResults.virtualAlarmTests = window.virtualAlarmTestResults.virtualAlarmTests || {};

    // Load Virtual Alarm Test results
    for (let itemNum = 1; itemNum <= 7; itemNum++) {
        const testResult = window.virtualAlarmTestResults.virtualAlarmTests[`item_${itemNum}`];
        
        // Set IEC101 checkbox
        const iec101Checkbox = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101"]`);
        if (iec101Checkbox && testResult) {
            iec101Checkbox.checked = testResult.iec101 === 'OK';
        }
        
        // Set IEC104 checkbox
        const iec104Checkbox = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104"]`);
        if (iec104Checkbox && testResult) {
            iec104Checkbox.checked = testResult.iec104 === 'OK';
        }
        
        // Set IEC101 IOA value
        const iec101IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101IOA"]`);
        if (iec101IOAInput) {
            if (testResult && testResult.iec101IOA !== undefined && testResult.iec101IOA !== null) {
                // Load saved value (including empty string)
                iec101IOAInput.value = testResult.iec101IOA;
            } 
        }
        
        // Set IEC104 IOA value
        const iec104IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104IOA"]`);
        if (iec104IOAInput) {
            if (testResult && testResult.iec104IOA !== undefined && testResult.iec104IOA !== null) {
                // Load saved value (including empty string)
                iec104IOAInput.value = testResult.iec104IOA;
            } 
        }
    }
}

// Navigation functions
window.goToPreviousPage = function() {
    // Save the current test data
    saveVirtualAlarmTestData();
    window.location.href = 'FunctionalityAIPage.html'; // Update with actual previous page
};

function handleVirtualAlarmTestSubmission() {
    // First validate the form
    if (!validateVirtualAlarmTests()) {
        return; // Stop navigation if validation fails
    }

    // Validate IOA index fields for IEC101 and IEC104
    if (!validateVirtualAlarmIOAIndexFields()) {
        return; // Stop if validation fails
    }
    
    // Save the current test data
    saveVirtualAlarmTestData();
    navigationGuard.markPageAsCompleted();
    window.location.href = 'ChannelRedundacyTest.html'; // Update with actual next page
}

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

function validateVirtualAlarmTests() {
    let isValid = true;
    let errors = [];
    
    // Get module counts from localStorage (saved from BQ page)
    const diModulesToTest = parseInt(localStorage.getItem('diModulesToTest')) || 0;
    const doModulesToTest = parseInt(localStorage.getItem('doModulesToTest')) || 0;
    const aiModulesToTest = parseInt(localStorage.getItem('aiModulesToTest')) || 0;
    const aoModulesToTest = parseInt(localStorage.getItem('aoModulesToTest')) || 0;
    
    // Reset all error styles first
    const allIOAInputs = document.querySelectorAll('input.virtual-alarm-ioa-input');
    allIOAInputs.forEach(input => {
        input.style.border = '';
    });

    // Define which items are always required (must have IOA values)
    const alwaysRequiredItems = [1, 2, 3]; // SOE Buffer Full, Time Sync Alarm, RTU Health/Comm Fail
    
    // Define conditional items based on BQ
    const conditionalItems = [
        { itemNum: 4, required: diModulesToTest > 0, name: "DI Module Fail" },
        { itemNum: 5, required: doModulesToTest > 0, name: "DO Module Fail" },
        { itemNum: 6, required: aiModulesToTest > 0, name: "AI Module Fail" },
        { itemNum: 7, required: aoModulesToTest > 0, name: "AO Module Fail" }
    ];

    // Check each test item (1-7)
    for (let itemNum = 1; itemNum <= 7; itemNum++) {
        const iec101IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101IOA"]`);
        const iec104IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104IOA"]`);
        
        // Get alarm name for error messages
        const row = iec101IOAInput ? iec101IOAInput.closest('tr') : 
                    iec104IOAInput ? iec104IOAInput.closest('tr') : null;
        const alarmName = row ? row.querySelector('td:first-child').textContent.trim() : `Alarm ${itemNum}`;

        // Determine if this item should be validated
        let shouldValidate = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldValidate = true;
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldValidate = true;
            }
        }

        if (!shouldValidate) continue;

        // Validate IEC101 IOA field - now accepts "-"
        if (iec101IOAInput) {
            const hasValue = iec101IOAInput.value.trim() !== "";
            if (!hasValue) {
                iec101IOAInput.style.border = '2px solid red';
                errors.push(`IEC101 ${alarmName}: IOA value is required (use "-" for empty fields)`);
                isValid = false;
            }
        }
        
        // Validate IEC104 IOA field - now accepts "-"
        if (iec104IOAInput) {
            const hasValue = iec104IOAInput.value.trim() !== "";
            if (!hasValue) {
                iec104IOAInput.style.border = '2px solid red';
                errors.push(`IEC104 ${alarmName}: IOA value is required (use "-" for empty fields)`);
                isValid = false;
            }
        }
    }
    
    if (!isValid) {
        alert('Validation failed - IOA values required:\n\n' + errors.join('\n'));
    }
    
    return isValid;
}

function validateVirtualAlarmIOAIndexFields() {
    // Get module counts from localStorage (saved from BQ page)
    const diModulesToTest = parseInt(localStorage.getItem('diModulesToTest')) || 0;
    const doModulesToTest = parseInt(localStorage.getItem('doModulesToTest')) || 0;
    const aiModulesToTest = parseInt(localStorage.getItem('aiModulesToTest')) || 0;
    const aoModulesToTest = parseInt(localStorage.getItem('aoModulesToTest')) || 0;
    
    // Get all IEC101 and IEC104 input fields
    const iec101Inputs = document.querySelectorAll('input[name*="iec101IOA"]');
    const iec104Inputs = document.querySelectorAll('input[name*="iec104IOA"]');
    
    let isValid = true;
    let emptyFields = [];
    let duplicateFields = [];
    let formatErrors = [];

    // Define which items are always required
    const alwaysRequiredItems = [1, 2, 3];
    
    // Define conditional items
    const conditionalItems = [
        { itemNum: 4, required: diModulesToTest > 0 },
        { itemNum: 5, required: doModulesToTest > 0 },
        { itemNum: 6, required: aiModulesToTest > 0 },
        { itemNum: 7, required: aoModulesToTest > 0 }
    ];

    // Reset previous red borders
    [...iec101Inputs, ...iec104Inputs].forEach(input => {
        input.style.border = '';
    });

    // Check IEC101 fields - validate format and non-emptiness
    iec101Inputs.forEach(input => {
        const inputName = input.name;
        const itemNumMatch = inputName.match(/virtualAlarm_(\d+)_iec101IOA/);
        if (!itemNumMatch) return;
        
        const itemNum = parseInt(itemNumMatch[1]);
        const value = input.value.trim();

        // Determine if this item should be validated
        let shouldValidate = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldValidate = true;
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldValidate = true;
            }
        }

        if (!shouldValidate) return;

        // Check for empty value
        if (value === "") {
            input.style.border = '2px solid red';
            isValid = false;
            const alarmName = getAlarmNameFromInput(input);
            emptyFields.push(`IEC101 ${alarmName}: IOA value is required (use "-" for empty fields)`);
        }
        // Validate format (only numbers or dash allowed)
        else if (!isValidVirtualAlarmIOAValue(value)) {
            input.style.border = '2px solid red';
            isValid = false;
            const alarmName = getAlarmNameFromInput(input);
            formatErrors.push(`IEC101 ${alarmName}: Value "${value}" contains invalid characters. Only numbers or "-" allowed.`);
        }
    });
    
    // Check IEC104 fields - validate format and non-emptiness
    iec104Inputs.forEach(input => {
        const inputName = input.name;
        const itemNumMatch = inputName.match(/virtualAlarm_(\d+)_iec104IOA/);
        if (!itemNumMatch) return;
        
        const itemNum = parseInt(itemNumMatch[1]);
        const value = input.value.trim();

        // Determine if this item should be validated
        let shouldValidate = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldValidate = true;
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldValidate = true;
            }
        }

        if (!shouldValidate) return;

        // Check for empty value
        if (value === "") {
            input.style.border = '2px solid red';
            isValid = false;
            const alarmName = getAlarmNameFromInput(input);
            emptyFields.push(`IEC104 ${alarmName}: IOA value is required (use "-" for empty fields)`);
        }
        // Validate format (only numbers or dash allowed)
        else if (!isValidVirtualAlarmIOAValue(value)) {
            input.style.border = '2px solid red';
            isValid = false;
            const alarmName = getAlarmNameFromInput(input);
            formatErrors.push(`IEC104 ${alarmName}: Value "${value}" contains invalid characters. Only numbers or "-" allowed.`);
        }
    });

    if (emptyFields.length > 0 || formatErrors.length > 0) {
        let errorMessage = '';
        if (emptyFields.length > 0) {
            errorMessage += `Empty fields:\n${emptyFields.join('\n')}\n\n`;
        }
        if (formatErrors.length > 0) {
            errorMessage += `Invalid format:\n${formatErrors.join('\n')}\n\n`;
        }
        alert(`Validation failed:\n\n${errorMessage}`);
        return false;
    }

    // Check for duplicate values in IEC101 column (only for values that are not "-")
    const iec101Values = [];
    const iec101ValueMap = new Map();
    
    iec101Inputs.forEach(input => {
        const itemNumMatch = input.name.match(/virtualAlarm_(\d+)_iec101IOA/);
        if (!itemNumMatch) return;
        
        const itemNum = parseInt(itemNumMatch[1]);
        const value = input.value.trim();
        
        // Determine if this item should be considered for duplicates
        let shouldConsider = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldConsider = true;
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldConsider = true;
            }
        }

        if (shouldConsider && value !== "" && value !== "-") {
            iec101Values.push(value);
            
            // Store location info for error message
            if (!iec101ValueMap.has(value)) {
                iec101ValueMap.set(value, []);
            }
            const alarmName = getAlarmNameFromInput(input);
            iec101ValueMap.get(value).push(`IEC101 ${alarmName}`);
        }
    });

    const iec101Duplicates = findDuplicatesWithLocations(iec101Values, iec101ValueMap);
    if (iec101Duplicates.length > 0) {
        isValid = false;
        iec101Inputs.forEach(input => {
            if (iec101Duplicates.some(d => d.value === input.value.trim())) {
                input.style.border = '2px solid red';
            }
        });
        
        iec101Duplicates.forEach(dup => {
            duplicateFields.push(`IEC101: Value "${dup.value}" appears ${dup.count} times:\n${dup.locations.join('\n')}`);
        });
    }

    // Check for duplicate values in IEC104 column (only for values that are not "-")
    const iec104Values = [];
    const iec104ValueMap = new Map();
    
    iec104Inputs.forEach(input => {
        const itemNumMatch = input.name.match(/virtualAlarm_(\d+)_iec104IOA/);
        if (!itemNumMatch) return;
        
        const itemNum = parseInt(itemNumMatch[1]);
        const value = input.value.trim();
        
        // Determine if this item should be considered for duplicates
        let shouldConsider = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldConsider = true;
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldConsider = true;
            }
        }

        if (shouldConsider && value !== "" && value !== "-") {
            iec104Values.push(value);
            
            // Store location info for error message
            if (!iec104ValueMap.has(value)) {
                iec104ValueMap.set(value, []);
            }
            const alarmName = getAlarmNameFromInput(input);
            iec104ValueMap.get(value).push(`IEC104 ${alarmName}`);
        }
    });

    const iec104Duplicates = findDuplicatesWithLocations(iec104Values, iec104ValueMap);
    if (iec104Duplicates.length > 0) {
        isValid = false;
        iec104Inputs.forEach(input => {
            if (iec104Duplicates.some(d => d.value === input.value.trim())) {
                input.style.border = '2px solid red';
            }
        });
        
        iec104Duplicates.forEach(dup => {
            duplicateFields.push(`IEC104: Value "${dup.value}" appears ${dup.count} times:\n${dup.locations.join('\n')}`);
        });
    }

    if (duplicateFields.length > 0) {
        alert(`Duplicate IOA index values found:\n\n${duplicateFields.join('\n\n')}\n\n` +
              `Note: Duplicate values are not allowed. Each IOA must be unique.`);
        return false;
    }

    return true;
}

// Helper function to get alarm name from input element
function getAlarmNameFromInput(input) {
    const row = input.closest('tr');
    if (row) {
        return row.querySelector('td:first-child').textContent.trim();
    }
    return 'Unknown';
}

// Helper function to find duplicate values with locations
function findDuplicatesWithLocations(values, valueMap) {
    const duplicates = [];
    const countMap = {};
    
    values.forEach(value => {
        countMap[value] = (countMap[value] || 0) + 1;
    });
    
    for (const [value, count] of Object.entries(countMap)) {
        if (count > 1) {
            duplicates.push({
                value: value,
                count: count,
                locations: valueMap.get(value) || []
            });
        }
    }
    
    return duplicates;
}

// Helper function to find duplicate values in an array (kept for backward compatibility)
function findDuplicates(arr) {
    const duplicates = [];
    const seen = {};
    
    arr.forEach(value => {
        if (seen[value]) {
            if (!duplicates.includes(value)) {
                duplicates.push(value);
            }
        } else {
            seen[value] = true;
        }
    });
    
    return duplicates;
}

// Function to validate IOA value format (only numbers or "-")
function isValidVirtualAlarmIOAValue(value) {
    // Allow single dash
    if (value === "-") return true;
    
    // Check if the value contains only numbers (no letters or special characters)
    return /^\d+$/.test(value);
}

// Function to restrict input to numbers and dash for Virtual Alarm IOA inputs
function restrictVirtualAlarmIOAInput(event) {
    const input = event.target;
    const value = input.value;
    
    // Allow backspace, delete, tab, escape, enter, arrow keys, home, end
    const key = event.key;
    if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 9 || 
        event.keyCode === 27 || event.keyCode === 13 || event.keyCode === 37 || 
        event.keyCode === 39 || event.keyCode === 35 || event.keyCode === 36) {
        return true;
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey && (key === 'a' || key === 'c' || key === 'v' || key === 'x')) {
        return true;
    }
    
    // Allow numbers and dash
    if (!/^[\d-]$/.test(key)) {
        event.preventDefault();
        return false;
    }
    
    // Prevent multiple dashes
    if (key === '-' && value.includes('-')) {
        event.preventDefault();
        return false;
    }
    
    return true;
}

// Function to add input restrictions to all Virtual Alarm IOA inputs
function addVirtualAlarmInputRestrictions() {
    // Wait a bit for DOM to be fully ready
    setTimeout(function() {
        document.querySelectorAll('.virtual-alarm-ioa-input').forEach(input => {
            // Remove any existing event listeners by cloning and replacing
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
            
            // Add keydown event listener
            newInput.addEventListener('keydown', restrictVirtualAlarmIOAInput);
            
            // Validate on paste
            newInput.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                // Only allow numbers and dash
                if (/^[\d-]+$/.test(pastedText)) {
                    // Prevent multiple dashes
                    if (pastedText.includes('-') && pastedText.indexOf('-') !== pastedText.lastIndexOf('-')) {
                        alert('Only one dash character is allowed per field');
                        return;
                    }
                    this.value = pastedText;
                } else {
                    alert('Only numbers and dash character are allowed');
                }
            });
            
            // Validate on blur to ensure format
            newInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value !== "" && !isValidVirtualAlarmIOAValue(value) && value !== "-") {
                    this.style.border = '2px solid red';
                    alert(`Invalid value "${value}". Only numbers or "-" are allowed.`);
                } else {
                    this.style.border = '';
                }
            });
        });
    }, 100);
}