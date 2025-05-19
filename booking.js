document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const serviceOptions = document.querySelectorAll('.service-option');
    const serviceInfo = document.getElementById('serviceInfo');
    const selectedServiceInput = document.getElementById('selectedService');
    const nextToStep2Button = document.getElementById('nextToStep2');
    const backToStep1Button = document.getElementById('backToStep1');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const bookingForm = document.getElementById('bookingForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const newBookingBtn = document.getElementById('newBookingBtn');

    // Service information object
    const serviceDetails = {
        'Hair Treatment': {
            description: 'Our professional hair treatments include deep conditioning, relaxing, and specialized care for damaged hair.',
            duration: '60-90 minutes',
            price: 'Starting from $50'
        },
        'Wig Purchase': {
            description: 'Browse our collection of premium quality wigs in various styles, colors, and lengths.',
            duration: 'Consultation: 30 minutes',
            price: 'Starting from $100'
        },
        'Home Decoration': {
            description: 'Professional interior design and decoration services to transform your living space.',
            duration: 'Consultation: 60 minutes',
            price: 'Custom quote based on requirements'
        },
        'Manicure/Pedicure': {
            description: 'Luxurious hand and foot care treatments to pamper yourself.',
            duration: '45-60 minutes',
            price: 'Starting from $35'
        },
        'Haircut for Men': {
            description: 'Stylish haircuts tailored specifically for men by our expert stylists.',
            duration: '30-45 minutes',
            price: 'Starting from $25'
        }
    };

    // Initialize
    function init() {
        // Add event listeners to service options
        serviceOptions.forEach(option => {
            option.addEventListener('click', selectService);
        });

        // Add event listeners to navigation buttons
        nextToStep2Button.addEventListener('click', goToStep2);
        backToStep1Button.addEventListener('click', goToStep1);
        
        // Form submission
        bookingForm.addEventListener('submit', handleFormSubmit);
        
        // New booking button
        newBookingBtn.addEventListener('click', resetForm);
        
        // Set minimum date for booking to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').min = today;
    }

    // Select service function
    function selectService() {
        // Remove selected class from all options
        serviceOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        this.classList.add('selected');
        
        // Get selected service
        const serviceName = this.getAttribute('data-service');
        selectedServiceInput.value = serviceName;
        
        // Update service info
        updateServiceInfo(serviceName);
        
        // Enable next button
        nextToStep2Button.disabled = false;
    }

    // Update service information
    function updateServiceInfo(serviceName) {
        const details = serviceDetails[serviceName];
        
        if (details) {
            serviceInfo.innerHTML = `
                <h4>${serviceName}</h4>
                <p>${details.description}</p>
                <p><strong>Duration:</strong> ${details.duration}</p>
                <p><strong>Price:</strong> ${details.price}</p>
                <p>Please proceed to provide your details for booking.</p>
            `;
            
            // Show with animation
            serviceInfo.style.display = 'block';
            serviceInfo.classList.add('animated');
            
            // Scroll to service info
            setTimeout(() => {
                serviceInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }

    // Navigation functions
    function goToStep2() {
        step1.classList.remove('active');
        step2.classList.add('active');
        
        // Scroll to top of form
        setTimeout(() => {
            step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function goToStep1() {
        step2.classList.remove('active');
        step1.classList.add('active');
    }

    // Form submission handler
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Basic form validation
        const requiredFields = ['name', 'email', 'phone', 'date', 'time'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                input.style.borderColor = '#ff3860';
                isValid = false;
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show loading indicator
        const submitBtn = document.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {};
        
        formData.forEach((value, key) => {
            bookingData[key] = value;
        });
        
        // Send data to server using fetch API
        fetch('process-booking.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            if (data.success) {
                // Show success confirmation
                showConfirmation(bookingData);
                showToast(data.message || 'Booking confirmed successfully!');
            } else {
                // Show error message
                alert('Error: ' + (data.message || 'Unknown error occurred'));
            }
        })
        .catch(error => {
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Show error message
            console.error('Error:', error);
            alert('There was a problem submitting your booking. Please try again later.');
        });
    }

    // Show confirmation message
    function showConfirmation(data) {
        // Format date and time
        const bookingDate = new Date(data.date);
        const formattedDate = bookingDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Create confirmation message
        confirmationDetails.innerHTML = `
            Thank you, <strong>${data.name}</strong>!<br>
            Your appointment for <strong>${data.service}</strong> has been scheduled for 
            <strong>${formattedDate}</strong> at <strong>${data.time}</strong>.<br>
            We've sent a confirmation email to <strong>${data.email}</strong>.
        `;
        
        // Hide form and show confirmation
        bookingForm.style.display = 'none';
        confirmationMessage.style.display = 'block';
        
        // Send notification (in a real app, this would be server-side)
        sendNotification(data);
    }
    
    // Send notification (simulated)
    function sendNotification(data) {
        // In a real application, this would be an API call to your backend
        // For now, we'll just simulate it with a console log
        console.log('Sending notification email to:', data.email);
        console.log('Sending SMS notification to:', data.phone);
        
        // You could also show a toast notification here
        showToast('Confirmation sent to your email and phone!');
    }
    
    // Show toast notification
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Add toast styles
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#4CAF50';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '4px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.zIndex = '1000';
        toast.style.animation = 'fadeIn 0.5s, fadeOut 0.5s 3.5s';
        
        // Add to document
        document.body.appendChild(toast);
        
        // Remove after 4 seconds
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 4000);
    }
    
    // Reset form for new booking
    function resetForm() {
        // Reset form fields
        bookingForm.reset();
        
        // Reset service selection
        serviceOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Reset service info
        serviceInfo.innerHTML = '<p>Please select a service to see more details</p>';
        
        // Disable next button
        nextToStep2Button.disabled = true;
        
        // Show form, hide confirmation
        bookingForm.style.display = 'block';
        confirmationMessage.style.display = 'none';
        
        // Go back to step 1
        step2.classList.remove('active');
        step1.classList.add('active');
    }

    // Initialize the booking system
    init();
});
