const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");
const toggle = body.querySelector(".toggle");
const modeSwitch = body.querySelector(".theme-toggle");
const icon = document.getElementById('lights');

const arrow = body.querySelector('.arrow');
const subMenu = document.querySelector('.sub-menu');

const notificationsBtn = document.querySelector('.notifications-trigger');
const alertsPanel = document.querySelector('.alerts-panel');
const userBtn = document.querySelector('.user-trigger');
const userMenu = document.querySelector('.user-menu');

 
toggle.addEventListener("click", () =>{
    sidebar.classList.toggle("close");
});

arrow.addEventListener('click', () => {
    arrow.classList.toggle('rotate');
    subMenu.classList.toggle('show');
});

sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle')) { 
      subMenu.classList.remove('show');
      arrow.classList.remove('rotate');
    }
  });

  function toggleAlertsPanel() {
    userMenu.hidden = true;
    alertsPanel.hidden = !alertsPanel.hidden;
}

  function toggleUserMenu() {
      alertsPanel.hidden = true;
      userMenu.hidden = !userMenu.hidden;
  }

  notificationsBtn.addEventListener('click', toggleAlertsPanel);
  userBtn.addEventListener('click', toggleUserMenu);

    document.addEventListener('click', function(event) {
      const isClickInsideNotifications = notificationsBtn.contains(event.target) || 
                                       alertsPanel.contains(event.target);
      const isClickInsideUser = userBtn.contains(event.target) || 
                               userMenu.contains(event.target);

      if (!isClickInsideNotifications && !isClickInsideUser) {
          alertsPanel.hidden = true;
          userMenu.hidden = true;
      }
  });

modeSwitch.addEventListener("click", () =>{
    body.classList.toggle("dark");

    if (icon.classList.contains('bx-moon')) {
      icon.classList.replace('bx-moon', 'bxs-sun');
    } else {
        icon.classList.replace('bxs-sun', 'bx-moon');
    }

});

const deleteBtn = document.querySelector('.delete');
const overlayModal = document.querySelector('.modal-overlay');
const cancelOverlay = document.querySelector('.cancel-button');
const confirmDelete = document.querySelector('.delete-button');
const successContainer = document.querySelector('.success-container');
const removeSuccess = document.querySelector('.remove-success');


deleteBtn.addEventListener("click", () =>{
  overlayModal.classList.toggle("modal-show");
});

cancelOverlay.addEventListener("click", () =>{
  overlayModal.classList.remove("modal-show");
});

confirmDelete.addEventListener("click", () =>{
  successContainer.classList.toggle("show");
  overlayModal.classList.remove("modal-show");
});

removeSuccess.addEventListener("click", () =>{
  successContainer.classList.remove("show");
});








 