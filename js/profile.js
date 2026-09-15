/* ============================================================
   ProjectSIS – Profile page logic
   ============================================================ */

initPage('profile');
EmailStore.init();
NotificationStore.init();

function renderProfileCard() {
  const profile = Profile.get();
  const avatarEl = document.getElementById('profileAvatar');
  const nameEl = document.getElementById('profileName');
  const roleEl = document.getElementById('profileRole');
  const totalEl = document.getElementById('statTotal');
  const unreadEl = document.getElementById('statUnread');
  const starredEl = document.getElementById('statStarred');

  if (avatarEl) {
    if (profile.avatar) {
      avatarEl.innerHTML = `<img src="${profile.avatar}" alt="${profile.name || 'User'}" />`;
      avatarEl.style.background = 'transparent';
      avatarEl.style.padding = '0';
    } else {
      avatarEl.innerHTML = initials(profile.name || 'Guest User');
      avatarEl.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
      avatarEl.style.padding = '0';
    }
  }

  if (nameEl) nameEl.textContent = profile.name || 'Guest User';
  if (roleEl) roleEl.textContent = profile.role || 'Staff';

  const stats = EmailStore.getStats();
  if (totalEl) totalEl.textContent = stats.total;
  if (unreadEl) unreadEl.textContent = stats.unread;
  if (starredEl) starredEl.textContent = stats.starred;
}

function populateForm() {
  const profile = Profile.get();
  const fields = {
    inputName: profile.name || '',
    inputRole: profile.role || '',
    inputEmail: profile.email || '',
    inputPhone: profile.phone || '',
    inputSchool: profile.school || ''
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });
}

renderProfileCard();
populateForm();

const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const updated = {
      name: document.getElementById('inputName').value.trim() || 'Guest User',
      role: document.getElementById('inputRole').value.trim() || 'Staff',
      email: document.getElementById('inputEmail').value.trim(),
      phone: document.getElementById('inputPhone').value.trim(),
      school: document.getElementById('inputSchool').value.trim()
    };

    Profile.update(updated);
    renderProfileCard();
    Toast.show('Profile saved', 'Your account details were updated successfully.', 'success');
  });
}

window.addEventListener('sis:google-user-updated', () => {
  renderProfileCard();
  populateForm();
});
