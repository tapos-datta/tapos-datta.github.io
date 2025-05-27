// Contact Component
export class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.status = document.querySelector('.form-status');
        this.submitButton = this.form ? this.form.querySelector('.submit-button') : null;
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }

    async handleSubmit() {
        if (!this.form) return;
        // Simple validation
        const name = this.form.querySelector('input[name="name"]');
        const email = this.form.querySelector('input[name="email"]');
        const message = this.form.querySelector('textarea[name="message"]');

        if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
            this.showStatus('Please fill in all fields.', 'error');
            return;
        }
        if (!this.validateEmail(email.value.trim())) {
            this.showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Disable button
        if (this.submitButton) this.submitButton.disabled = true;
        this.showStatus('Sending...', '');

        // Simulate AJAX (replace with real endpoint as needed)
        try {
            // Example: await fetch('/api/contact', { ... })
            await new Promise(resolve => setTimeout(resolve, 1200));
            this.showStatus('Thank you! Your message has been sent.', 'success');
            this.form.reset();
        } catch (err) {
            this.showStatus('Sorry, there was an error. Please try again later.', 'error');
        } finally {
            if (this.submitButton) this.submitButton.disabled = false;
        }
    }

    validateEmail(email) {
        // Simple email regex
        return /^\S+@\S+\.\S+$/.test(email);
    }

    showStatus(message, type) {
        if (!this.status) {
            this.status = document.createElement('div');
            this.status.className = 'form-status';
            this.form.appendChild(this.status);
        }
        this.status.textContent = message;
        this.status.className = 'form-status';
        if (type) this.status.classList.add(type);
    }
}

// Export initialization function
export function initContactForm() {
    new ContactForm();
}
