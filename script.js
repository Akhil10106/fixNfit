const servicesGrid = document.querySelector('.services__grid');
const prevBtn = document.querySelector('.services__nav-btn.prev');
const nextBtn = document.querySelector('.services__nav-btn.next');

function updateNavButtons() {
    if (servicesGrid && prevBtn && nextBtn) {
        if (servicesGrid.scrollLeft <= 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }

        if (servicesGrid.scrollLeft + servicesGrid.clientWidth >= servicesGrid.scrollWidth - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
        }
    }
}

if (servicesGrid && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        servicesGrid.scrollBy({ left: -300, behavior: 'smooth' });
        setTimeout(updateNavButtons, 300);
    });

    nextBtn.addEventListener('click', () => {
        servicesGrid.scrollBy({ left: 300, behavior: 'smooth' });
        setTimeout(updateNavButtons, 300);
    });

    servicesGrid.addEventListener('scroll', updateNavButtons);
    window.addEventListener('resize', updateNavButtons);
    updateNavButtons();
}

function handleSubscribeSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    console.log('Subscribed with email:', email);
    alert('Thank you for subscribing!');
    document.getElementById('subscribe-form').reset();
}

function openFormPage(plan, price) {
    const subscriptionsContainer = document.getElementById('subscriptions-container');
    const formContainer = document.getElementById('business-form-container');
    const subscriptionPlanInput = document.getElementById('subscription-plan');
    if (subscriptionsContainer && formContainer && subscriptionPlanInput) {
        subscriptionsContainer.style.display = 'none';
        formContainer.style.display = 'block';
        subscriptionPlanInput.value = `${plan} - ${price}`;
    }
}

function closeFormPage() {
    const subscriptionsContainer = document.getElementById('subscriptions-container');
    const formContainer = document.getElementById('business-form-container');
    const form = document.getElementById('business-listing-form');
    if (subscriptionsContainer && formContainer && form) {
        subscriptionsContainer.style.display = 'block';
        formContainer.style.display = 'none';
        form.reset();
        document.querySelectorAll('.error').forEach(element => {
            element.style.display = 'none';
        });
    }
}

function handleBusinessSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Custom validations
    let isValid = true;
    const errors = {};

    // Full Name
    const fullName = formData.get('full-name');
    if (!/^[A-Za-z\s]{2,100}$/.test(fullName)) {
        errors['full-name'] = 'Please enter a valid name (2-100 characters, letters and spaces only).';
        isValid = false;
    }

    // Email
    const email = formData.get('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors['email'] = 'Please enter a valid email address.';
        isValid = false;
    }

    // Phone
    const phone = formData.get('phone');
    if (!/\+?[1-9]\d{1,14}/.test(phone)) {
        errors['phone'] = 'Please enter a valid phone number (e.g., +1234567890).';
        isValid = false;
    }

    // Address
    const address = formData.get('address');
    if (address.length < 10 || address.length > 200) {
        errors['address'] = 'Please enter a valid address (10-200 characters).';
        isValid = false;
    }

    // ID Document
    const idDocument = formData.get('id-document');
    if (idDocument && idDocument.size > 5 * 1024 * 1024) {
        errors['id-document'] = 'ID document must be less than 5MB.';
        isValid = false;
    }

    // Business Name
    const businessName = formData.get('business-name');
    if (businessName.length < 2 || businessName.length > 100) {
        errors['business-name'] = 'Please enter a valid business name (2-100 characters).';
        isValid = false;
    }

    // Service Type
    const serviceType = formData.get('service-type');
    if (!serviceType) {
        errors['service-type'] = 'Please select a service type.';
        isValid = false;
    }

    // Service Description
    const serviceDescription = formData.get('service-description');
    if (serviceDescription.length < 20 || serviceDescription.length > 500) {
        errors['service-description'] = 'Please enter a description (20-500 characters).';
        isValid = false;
    }

    // Price
    const price = formData.get('price');
    if (!/^\$?\d+(\.\d{2})?(\/hr)?$/.test(price)) {
        errors['price'] = 'Please enter a valid price (e.g., $50/hr or $300).';
        isValid = false;
    }

    // Certifications
    const certifications = formData.getAll('certifications');
    for (const file of certifications) {
        if (file && file.size > 5 * 1024 * 1024) {
            errors['certifications'] = 'Each certification file must be less than 5MB.';
            isValid = false;
            break;
        }
    }

    // Years of Experience
    const yearsExperience = parseInt(formData.get('years-experience'), 10);
    if (isNaN(yearsExperience) || yearsExperience < 0 || yearsExperience > 50) {
        errors['years-experience'] = 'Please enter a valid number (0-50).';
        isValid = false;
    }

    // Service Areas
    const serviceAreas = formData.getAll('service-areas');
    if (serviceAreas.length === 0 || serviceAreas.length > 5) {
        errors['service-areas'] = 'Please select 1-5 service areas.';
        isValid = false;
    }

    // License Number
    const licenseNumber = formData.get('license-number');
    if (!/^[A-Za-z0-9\-]{1,50}$/.test(licenseNumber)) {
        errors['license-number'] = 'Please enter a valid license number (alphanumeric, max 50 characters).';
        isValid = false;
    }

    // Website
    const website = formData.get('website');
    if (website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
        errors['website'] = 'Please enter a valid URL (e.g., https://www.example.com).';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.style.display = 'block';
        }
    });

    // Clear previous errors
    document.querySelectorAll('.error').forEach(element => {
        if (!errors[element.id.replace('-error', '')]) {
            element.style.display = 'none';
        }
    });

    if (!isValid) {
        return;
    }

    // Store data
    const businessData = {
        subscriptionPlan: formData.get('subscription-plan'),
        name: businessName,
        serviceType: serviceType,
        description: serviceDescription,
        price: price,
        fullName: fullName,
        email: email,
        phone: phone,
        address: address,
        yearsExperience: yearsExperience,
        serviceAreas: serviceAreas,
        licenseNumber: licenseNumber,
        website: website || ''
    };

    let businesses = JSON.parse(localStorage.getItem('businesses')) || [];
    businesses.push(businessData);
    localStorage.setItem('businesses', JSON.stringify(businesses));

    if (servicesGrid) {
        const newCard = document.createElement('div');
        newCard.className = 'services__card';
        newCard.innerHTML = `
            <div class="services__card__content">
                <h4>${businessData.name}</h4>
                <p>${businessData.description}</p>
                <span class="services__card__price">${businessData.price}</span>
            </div>
        `;
        servicesGrid.appendChild(newCard);
        updateNavButtons();
    }

    alert('Business listed successfully!');
    form.reset();
    closeFormPage();
    window.location.href = 'index.html';
}

window.addEventListener('load', () => {
    const businesses = JSON.parse(localStorage.getItem('businesses')) || [];
    if (servicesGrid) {
        businesses.forEach(business => {
            const newCard = document.createElement('div');
            newCard.className = 'services__card';
            newCard.innerHTML = `
                <div class="services__card__content">
                    <h4>${business.name}</h4>
                    <p>${business.description}</p>
                    <span class="services__card__price">${business.price}</span>
                </div>
            `;
            servicesGrid.appendChild(newCard);
        });
        updateNavButtons();
    }
});