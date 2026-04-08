let currentRoleMode = 'edit';
let initialRoleNameVal = 'test';
let roleCheckboxesDirty = false;

function getIsRoleDirty() {
    if (currentRoleMode !== 'edit' && currentRoleMode !== 'add') return false;
    const currentName = 'test2'; // mocked
    return (currentName !== initialRoleNameVal) || roleCheckboxesDirty;
}

function attemptBackToRole() {
    if (getIsRoleDirty()) {
        console.log("show modal");
    } else {
        console.log("force back");
    }
}
attemptBackToRole();
