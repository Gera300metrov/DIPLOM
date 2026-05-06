// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ВАЛИДАЦИИ ==========
function isValidName(name) {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 30) return false;
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s\-\.]+$/;
    return regex.test(trimmed);
}

function isValidRussianPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    return cleaned[0] === '7' || cleaned[0] === '8';
}

function formatPhoneForDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3-$4-$5');
    }
    return phone;
}

function isValidEmail(email) {
    if (!email.trim()) return true;
    const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return regex.test(email);
}

function isValidDate(dateStr) {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return selected >= today && selected <= maxDate;
}

function showError(inputElement, message) {
    const parent = inputElement.parentElement;
    let errorDiv = parent.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-xs text-red-400 mt-1';
        parent.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    inputElement.classList.add('border-red-500');
}

function clearError(inputElement) {
    const parent = inputElement.parentElement;
    const errorDiv = parent.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
    inputElement.classList.remove('border-red-500');
}

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let booking = { service: null, master: null, date: null, time: null };
let currentModalStep = 1;

// ========== НАВИГАЦИЯ И МОДАЛКИ ==========
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function openBookingModal() {
    document.getElementById('bookingModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetModal();
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function resetModal() {
    booking = { service: null, master: null, date: null, time: null };
    currentModalStep = 1;
    document.getElementById('step1_modal').classList.remove('hidden');
    document.getElementById('step2_modal').classList.add('hidden');
    document.getElementById('step3_modal').classList.add('hidden');
    document.getElementById('step4_modal').classList.add('hidden');
    document.getElementById('success_modal').classList.add('hidden');
    document.querySelectorAll('.service-card-modal').forEach(c => c.classList.remove('border-gold-500'));
    document.querySelectorAll('.master-card').forEach(c => c.classList.remove('border-gold-500'));
    document.getElementById('nextStep1').disabled = true;
    document.getElementById('nextStep2').disabled = true;
    document.getElementById('nextStep3').disabled = true;
    
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const commentInput = document.getElementById('clientComment');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (emailInput) emailInput.value = '';
    if (commentInput) commentInput.value = '';
    [nameInput, phoneInput, emailInput].forEach(field => {
        if (field) clearError(field);
    });
    
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) dateInput.value = '';
    const timeContainer = document.getElementById('timeSlotsModal');
    if (timeContainer) timeContainer.innerHTML = '';
    
    updateModalProgress(1);
}

function updateModalProgress(step) {
    for (let i = 1; i <= 4; i++) {
        let badge = document.getElementById(`step${i}-badge`);
        badge.classList.remove('bg-gray-700', 'bg-green-600', 'bg-gold-500', 'bg-gold-600', 'text-gray-300', 'text-white', 'text-black');
        if (i < step) {
            badge.classList.add('bg-gold-600', 'text-black');
            badge.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else if (i === step) {
            badge.classList.add('bg-gold-500', 'text-black');
            badge.innerHTML = i;
        } else {
            badge.classList.add('bg-gray-700', 'text-gray-300');
            badge.innerHTML = i;
        }
    }
    let line1 = document.getElementById('line1'), line2 = document.getElementById('line2'), line3 = document.getElementById('line3');
    if (step > 1) line1.classList.add('bg-gold-500'); else line1.classList.remove('bg-gold-500');
    if (step > 2) line2.classList.add('bg-gold-500'); else line2.classList.remove('bg-gold-500');
    if (step > 3) line3.classList.add('bg-gold-500'); else line3.classList.remove('bg-gold-500');
    if (window.lucide) lucide.createIcons();
}

function selectServiceModal(service, element) {
    booking.service = service;
    document.querySelectorAll('.service-card-modal').forEach(c => c.classList.remove('border-gold-500'));
    element.classList.add('border-gold-500');
    document.getElementById('nextStep1').disabled = false;
}

function selectMasterModal(master, element) {
    booking.master = master;
    document.querySelectorAll('.master-card').forEach(c => c.classList.remove('border-gold-500'));
    element.classList.add('border-gold-500');
    document.getElementById('nextStep2').disabled = false;
}

function nextStepModal(step) {
    if (step === 3) {
        generateTimeSlotsModal();
    }
    document.getElementById(`step${currentModalStep}_modal`).classList.add('hidden');
    document.getElementById(`step${step}_modal`).classList.remove('hidden');
    currentModalStep = step;
    updateModalProgress(step);
    if (window.lucide) lucide.createIcons();
}

function prevStepModal(step) {
    document.getElementById(`step${currentModalStep}_modal`).classList.add('hidden');
    document.getElementById(`step${step}_modal`).classList.remove('hidden');
    currentModalStep = step;
    updateModalProgress(step);
    if (window.lucide) lucide.createIcons();
}

function generateTimeSlotsModal() {
    const container = document.getElementById('timeSlotsModal');
    if (!container) return;
    container.innerHTML = '';
    
    const dateInput = document.getElementById('bookingDate');
    const selectedDate = dateInput.value;
    
    if (!selectedDate) {
        container.innerHTML = '<div class="text-gray-400 col-span-3 text-center">Сначала выберите дату</div>';
        document.getElementById('nextStep3').disabled = true;
        return;
    }
    
    if (!isValidDate(selectedDate)) {
        container.innerHTML = '<div class="text-red-400 col-span-3 text-center">Дата не может быть в прошлом или более чем через 3 месяца</div>';
        document.getElementById('nextStep3').disabled = true;
        return;
    }
    
    const times = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const now = new Date();
    const isToday = new Date(selectedDate).toDateString() === now.toDateString();
    const currentHour = now.getHours();
    
    times.forEach(time => {
        const [hour] = time.split(':').map(Number);
        const isPast = isToday && hour <= currentHour;
        
        const btn = document.createElement('button');
        btn.textContent = time;
        btn.className = `slot-time border border-gray-700 rounded-lg py-1 text-sm bg-black text-white hover:border-gold-500 ${isPast ? 'disabled opacity-40 cursor-not-allowed' : ''}`;
        
        if (!isPast) {
            btn.onclick = function() {
                document.querySelectorAll('#timeSlotsModal button').forEach(b => b.classList.remove('selected', 'bg-gold-600', 'text-black'));
                this.classList.add('selected', 'bg-gold-600', 'text-black');
                booking.time = time;
                document.getElementById('nextStep3').disabled = false;
            };
        }
        container.appendChild(btn);
    });
    
    booking.time = null;
    document.getElementById('nextStep3').disabled = true;
}

// === НОВАЯ ВЕРСИЯ С ОТПРАВКОЙ НА PHP/БД ===
async function submitBookingModal() {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const commentInput = document.getElementById('clientComment');
    
    const name = nameInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;
    
    let isValid = true;
    
    if (!isValidName(name)) {
        showError(nameInput, 'Введите реальное имя (от 2 до 30 букв, без цифр)');
        isValid = false;
    } else {
        clearError(nameInput);
    }
    
    if (!isValidRussianPhone(phone)) {
        showError(phoneInput, 'Введите корректный российский номер (например: +7 999 123-45-67)');
        isValid = false;
    } else {
        clearError(phoneInput);
    }
    
    if (email.trim() !== '' && !isValidEmail(email)) {
        showError(emailInput, 'Введите корректный email (например: name@domain.ru)');
        isValid = false;
    } else {
        clearError(emailInput);
    }
    
    if (!booking.service) {
        alert('Выберите услугу на первом шаге');
        isValid = false;
    }
    if (!booking.master) {
        alert('Выберите мастера на втором шаге');
        isValid = false;
    }
    if (!booking.date || !isValidDate(booking.date)) {
        alert('Выберите корректную дату (от сегодня и не более 3 месяцев)');
        isValid = false;
    }
    if (!booking.time) {
        alert('Выберите время записи');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const requestData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        comment: commentInput.value,
        service: booking.service,
        master: booking.master,
        date: booking.date,
        time: booking.time
    };
    
    try {
        // Убедитесь, что пути к save_booking.php правильные (если файл в той же папке, оставьте как есть)
        const response = await fetch('save_booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('step4_modal').classList.add('hidden');
            document.getElementById('success_modal').classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
            setTimeout(() => closeBookingModal(), 3000);
        } else {
            alert('Ошибка: ' + (result.error || 'Не удалось сохранить заявку'));
        }
    } catch (err) {
        console.error(err);
        alert('Ошибка сети. Попробуйте позже.');
    }
}

async function quickSubmit(e) {
    e.preventDefault();
    const name = document.querySelector('#quickForm input[placeholder="Ваше имя"]').value;
    const phone = document.querySelector('#quickForm input[placeholder="Телефон"]').value;
    const idea = document.querySelector('#quickForm textarea').value;
    
    if (!name || !phone) {
        alert('Заполните имя и телефон');
        return;
    }
    
    try {
        const response = await fetch('save_quick.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, idea })
        });
        const result = await response.json();
        if (result.success) {
            alert('Спасибо! Мы свяжемся с вами.');
            document.getElementById('quickForm').reset();
        } else {
            alert('Ошибка: ' + (result.error || 'Попробуйте ещё раз'));
        }
    } catch (err) {
        alert('Ошибка соединения');
    }
}

function selectMaster(name) {
    openBookingModal();
    setTimeout(() => {
        const masterDiv = Array.from(document.querySelectorAll('.master-card')).find(el => el.innerText.includes(name));
        if (masterDiv) masterDiv.click();
        nextStepModal(2);
    }, 200);
}

// ========== ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ==========
function initFloatingCards() {
    const cards = document.querySelectorAll('.hover-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

function initStyleFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.style-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            items.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
}

function initPainMap() {
    const painData = {
        head: { name: "Голова", level: 8, description: "Очень чувствительная зона, боль выше среднего" },
        chest: { name: "Грудная клетка", level: 7, description: "Кости близко к коже, ощутимо" },
        belly: { name: "Живот", level: 6, description: "Средняя боль, но зависит от веса" },
        back: { name: "Спина / Поясница", level: 5, description: "Терпимо, но длительные сеансы утомляют" },
        'left-arm': { name: "Левая рука", level: 4, description: "Одна из наименее болезненных зон" },
        'right-arm': { name: "Правая рука", level: 4, description: "Аналогично левой" },
        'left-leg': { name: "Левая нога", level: 5, description: "Мышцы смягчают боль, но кости голени чувствительны" },
        'right-leg': { name: "Правая нога", level: 5, description: "То же, что и левая" }
    };
    
    const parts = document.querySelectorAll('.body-part');
    const resultDiv = document.getElementById('painResult');
    
    parts.forEach(part => {
        part.addEventListener('click', () => {
            const partKey = part.getAttribute('data-part');
            const data = painData[partKey];
            if (data) {
                let stars = '';
                for (let i = 1; i <= 10; i++) stars += i <= data.level ? '🔥' : '⚫';
                resultDiv.innerHTML = `
                    <div class="bg-gold-500/10 p-4 rounded-xl border-l-4 border-gold-500 animate-fadeIn">
                        <p class="text-xl font-bold text-white">${data.name}</p>
                        <p class="text-2xl text-gold-500 my-2">${data.level} / 10</p>
                        <p class="text-sm text-gray-300">${stars}</p>
                        <p class="text-sm text-gray-400 mt-3">${data.description}</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<p class="text-gray-400">Информация скоро появится</p>`;
            }
        });
    });
}

function initAboutSlider() {
    const track = document.getElementById('slider-track');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = Array.from(track.children);
    const slideCount = slides.length;
    let currentIndex = 0;
    
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-gold-500 w-4' : 'bg-gray-400'}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }
    
    function updateDots() {
        const dots = document.querySelectorAll('#slider-dots button');
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.remove('bg-gray-400', 'w-2');
                dot.classList.add('bg-gold-500', 'w-4');
            } else {
                dot.classList.remove('bg-gold-500', 'w-4');
                dot.classList.add('bg-gray-400', 'w-2');
            }
        });
    }
    
    function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        currentIndex = index;
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
    }
    
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    
    let autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    const sliderContainer = document.getElementById('about-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        sliderContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });
    }
}

function openImageViewer(imageSrc) {
    let viewer = document.getElementById('image-viewer');
    if (!viewer) {
        viewer = document.createElement('div');
        viewer.id = 'image-viewer';
        viewer.className = 'fixed inset-0 z-[70] hidden modal-backdrop items-center justify-center';
        viewer.style.display = 'none';
        viewer.innerHTML = `
            <div class="fixed inset-0 bg-black/90" onclick="closeImageViewer()"></div>
            <div class="relative max-w-4xl mx-4">
                <img id="viewer-img" src="" class="max-w-full max-h-[90vh] rounded-lg border-2 border-gold-500 shadow-2xl">
                <button onclick="closeImageViewer()" class="absolute -top-10 right-0 text-white hover:text-gold-500 text-2xl">✕</button>
            </div>
        `;
        document.body.appendChild(viewer);
    }
    const img = document.getElementById('viewer-img');
    img.src = imageSrc;
    viewer.style.display = 'flex';
    viewer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
    const viewer = document.getElementById('image-viewer');
    if (viewer) {
        viewer.style.display = 'none';
        viewer.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function initSwiperGallery() {
    if (document.querySelector('.mySwiper')) {
        new Swiper('.mySwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }
}

// ========== ЗАПУСК ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initFloatingCards();
    initStyleFilter();
    initPainMap();
    initAboutSlider();
    initSwiperGallery();
    
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        
        dateInput.addEventListener('change', () => {
            booking.date = dateInput.value;
            generateTimeSlotsModal();
        });
    }
    
    const nameField = document.getElementById('clientName');
    const phoneField = document.getElementById('clientPhone');
    const emailField = document.getElementById('clientEmail');
    
    if (nameField) {
        nameField.addEventListener('input', () => {
            if (nameField.value.trim() === '') return;
            if (!isValidName(nameField.value)) {
                showError(nameField, 'Только буквы, пробелы и дефисы (2-30 символов)');
            } else {
                clearError(nameField);
            }
        });
    }
    
    if (phoneField) {
        phoneField.addEventListener('input', () => {
            let value = phoneField.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 0 && !value.startsWith('7') && !value.startsWith('8') && !value.startsWith('9')) {
                value = '7' + value;
            }
            let formatted = '';
            if (value.length > 0) {
                if (value[0] === '8') formatted = '8';
                else formatted = '+7';
                const rest = (value[0] === '8' || value[0] === '7') ? value.slice(1) : value;
                if (rest.length > 0) formatted += ' ' + rest.slice(0, 3);
                if (rest.length > 3) formatted += ' ' + rest.slice(3, 6);
                if (rest.length > 6) formatted += '-' + rest.slice(6, 8);
                if (rest.length > 8) formatted += '-' + rest.slice(8, 10);
            }
            phoneField.value = formatted;
            
            if (!isValidRussianPhone(phoneField.value)) {
                showError(phoneField, 'Примеры: +79991234567, 89991234567');
            } else {
                clearError(phoneField);
            }
        });
    }
    
    if (emailField) {
        emailField.addEventListener('blur', () => {
            const val = emailField.value;
            if (val !== '' && !isValidEmail(val)) {
                showError(emailField, 'Неверный формат email');
            } else {
                clearError(emailField);
            }
        });
    }
});