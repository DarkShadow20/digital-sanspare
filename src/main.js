import './firebase.js'

const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
});

// Modal Logic
//const openModals = document.getElementById('openModal');
const modal = document.getElementById('quote-modal');
const modalText = document.getElementById('modal-interest');

function openModal(interest) {
    modalText.innerText = interest;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Close modal when clicking outside
//openModals.addEventListener('click',openModal)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Form Handling (Prevent Default)
function handleForm(e) {
    e.preventDefault();
    alert("Thank you! We will contact you shortly.");
}

window.openModal = openModal;
window.closeModal = closeModal;
window.handleForm = handleForm;
