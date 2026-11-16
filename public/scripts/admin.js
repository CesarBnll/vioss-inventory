// Edit user modal
document.getElementById('editUserModal').addEventListener('show.bs.modal', event => {
  const d = event.relatedTarget.dataset;
  const isSelf = d.self === 'true';

  document.getElementById('editOriginalEmail').value = d.email;
  document.getElementById('editName').value = d.name;
  document.getElementById('editPhone').value = d.phone;
  document.getElementById('editEmail').value = d.email;
  document.getElementById('editPasswd').value = '';

  const typeSelect = document.getElementById('editType');
  typeSelect.value = d.type;
  typeSelect.disabled = isSelf;
  document.getElementById('editSelfNote').classList.toggle('d-none', !isSelf);
});

// Delete user modal
document.getElementById('deleteUserModal').addEventListener('show.bs.modal', event => {
  const d = event.relatedTarget.dataset;
  document.getElementById('deleteUserEmail').value = d.email;
  document.getElementById('deleteUserName').textContent = d.name;
});

// Auto-dismiss the feedback alert
const alertElement = document.getElementById('admin-feedback');
if (alertElement) {
  setTimeout(() => bootstrap.Alert.getOrCreateInstance(alertElement).close(), 5000);
}