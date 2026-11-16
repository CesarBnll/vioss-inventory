const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');

tabButtons.forEach(tabButton => {
  tabButton.addEventListener('shown.bs.tab', event => {
    const selectedTarget = event.target.getAttribute('data-bs-target');

    // Keep both navs (mobile + desktop) in sync
    tabButtons.forEach(button => {
      const isSelected = button.getAttribute('data-bs-target') === selectedTarget;
      button.classList.toggle('active', isSelected);
      button.setAttribute('aria-selected', String(isSelected));
    });

    // Remember the tab on refresh (works for /admin and /users)
    const tabName = selectedTarget.replace('#v-pills-', '');
    history.replaceState(null, '', `${location.pathname}?tab=${tabName}`);

    // Close the mobile sidebar after choosing a tab
    const sidebar = document.getElementById('adminSidebar');
    const offcanvas = bootstrap.Offcanvas.getInstance(sidebar);
    if (offcanvas) offcanvas.hide();
  });
});