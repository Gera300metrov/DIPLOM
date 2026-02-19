'use strict'
// Booking System State
let bookingState = {
    service: null,
    serviceName: null,
    servicePrice: null,
    master: null,
    masterStyle: null,
    date: null,
    time: null
};

let currentStep = 1;

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                let formatted = '+7';
                if (value.length > 0) {
                    formatted += ' (' + value.substring(0, 3);
                }
                if (value.length >= 3) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length >= 6) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.substring(8, 10);
                }
                e.target.value = formatted;
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-xrom-black/95', 'backdrop-blur-md');
            nav.classList.remove('bg-transparent');
        } else {
            nav.classList.remove('bg-xrom-black/95', 'backdrop-blur-md');
            nav.classList.add('bg-transparent');
        }
    });
});

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function openBookingModal() {
    document.getElementById('bookingModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetBooking();
    lucide.createIcons();
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function resetBooking() {
    bookingState = {
        service: null,
        serviceName: null,
        servicePrice: null,
        master: null,
        masterStyle: null,
        date: null,
        time: null
    };
    currentStep = 1;
    
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step4').classList.add('hidden');
    document.getElementById('bookingSuccess').classList.add('hidden');
    
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    
    document.getElementById('btn-step1').disabled = true;
    document.getElementById('btn-step2').disabled = true;
    document.getElementById('btn-step3').disabled = true;
    
    updateProgress(1);
}

function nextStep(step) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${step}`).classList.remove('hidden');
    document.getElementById(`step${step}`).classList.add('fade-in');
    
    updateProgress(step);
    currentStep = step;
    lucide.createIcons();
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${step}`).classList.remove('hidden');
    document.getElementById(`step${step}`).classList.add('fade-in');
    
    updateProgress(step);
    currentStep = step;
    lucide.createIcons();
}

function updateProgress(step) {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        if (i < step) {
            indicator.className = 'w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold';
            indicator.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else if (i === step) {
            indicator.className = 'w-8 h-8 rounded-full bg-xrom-red text-white flex items-center justify-center text-sm font-bold';
            indicator.innerHTML = i;
        } else {
            indicator.className = 'w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center text-sm font-bold';
            indicator.innerHTML = i;
        }
    }
    
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    
    if (step > 1) line1.classList.add('bg-xrom-red');
    else line1.classList.remove('bg-xrom-red');
    
    if (step > 2) line2.classList.add('bg-xrom-red');
    else line2.classList.remove('bg-xrom-red');
    
    if (step > 3) line3.classList.add('bg-xrom-red');
    else line3.classList.remove('bg-xrom-red');
    
    lucide.createIcons();
}

function selectService(id, name, price) {
    bookingState.service = id;
    bookingState.serviceName = name;
    bookingState.servicePrice = price;
    
    document.querySelectorAll('#step1 .service-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    document.getElementById('btn-step1').disabled = false;
}

function selectMasterOption(name, style) {
    bookingState.master = name;
    bookingState.masterStyle = style;
    
    document.querySelectorAll('#step2 .service-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    document.getElementById('btn-step2').disabled = false;
}

function selectMaster(name) {
    openBookingModal();
    bookingState.master = name;
    setTimeout(() => {
        nextStep(2);
        const cards = document.querySelectorAll('#step2 .service-card');
        cards.forEach(card => {
            if (card.textContent.includes(name)) {
                card.click();
            }
        });
    }, 200);
}

function onDateChange() {
    const date = document.getElementById('bookingDate').value;
    bookingState.date = date;
    generateTimeSlots();
}

function generateTimeSlots() {
    const container = document.getElementById('timeSlots');
    container.innerHTML = '';
    
    const times = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const disabledTimes = Math.random() > 0.5 ? ['14:00', '17:00'] : ['12:00', '16:00'];
    
    times.forEach(time => {
        const isDisabled = disabledTimes.includes(time);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `booking-slot border border-white/10 rounded-lg py-2 text-sm font-medium ${isDisabled ? 'disabled text-gray-500' : 'text-gray-300 bg-xrom-black hover:border-xrom-red'}`;
        btn.textContent = time;
        btn.disabled = isDisabled;
        
        if (!isDisabled) {
            btn.onclick = function() {
                document.querySelectorAll('.booking-slot').forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                bookingState.time = time;
                document.getElementById('selectedDateTime').textContent = `${formatDate(bookingState.date)} в ${time}`;
                document.getElementById('btn-step3').disabled = false;
            };
        }
        
        container.appendChild(btn);
    });
}

function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

function submitBooking() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните обязательные поля');
        return;
    }
    
    document.getElementById('summaryService').textContent = bookingState.serviceName || '—';
    document.getElementById('summaryMaster').textContent = bookingState.master || '—';
    document.getElementById('summaryDateTime').textContent = bookingState.date && bookingState.time ? `${formatDate(bookingState.date)} в ${bookingState.time}` : '—';
    
    const submitBtn = document.querySelector('#step4 button[type="button"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Отправка...';
    submitBtn.disabled = true;
    lucide.createIcons();
    
    setTimeout(() => {
        document.getElementById('step4').classList.add('hidden');
        document.getElementById('bookingSuccess').classList.remove('hidden');
        lucide.createIcons();
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}