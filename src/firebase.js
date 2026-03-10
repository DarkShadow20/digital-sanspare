

// Form Handling Logic
const form = document.getElementById('quote-form');
const submitBtn = document.getElementById('submit-btn');
const spinner = document.getElementById('loading-spinner');
const toast = document.getElementById('toast');
const btnText = submitBtn.querySelector('span');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI Loading State
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.textContent = "Sending...";

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const requirement = document.getElementById('requirement').value;
    const message = document.getElementById('message').value;
    const formData = {
        name: name,
        phone: phone,
        requirement: requirement,
        message: message,
        createdAt: new Date().toISOString(),
    }
    const emailParams = {
        name: name,     // The user's name
        phone: phone,   // The user's email
        requirement: requirement,      
        message: message
    };
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_POINTER}`+'/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        await emailjs.send(import.meta.env.VITE_SERVICE_KEY_EMAILJS, import.meta.env.VITE_TEMPLATE_ID_EMAILJS, emailParams);
        // Success UI
        if(response.ok){
            form.reset();
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 5000);
        }
    } catch (error) {
        console.error("Error writing document: ", error);
        alert("Something went wrong. Please call us directly.");
    } finally {
        // Reset UI
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
        btnText.textContent = "Send Request";
    }
});