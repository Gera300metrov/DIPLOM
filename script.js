let booking = { service: null, master: null, date: null, time: null };
let currentModalStep = 1;

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
    updateModalProgress(1);
}

function updateModalProgress(step) {
    for (let i = 1; i <= 4; i++) {
        let badge = document.getElementById(`step${i}-badge`);
        // Удаляем все возможные классы цвета и текста
        badge.classList.remove(
            'bg-gray-700', 'bg-green-600', 'bg-gold-500', 'bg-gold-600',
            'text-gray-300', 'text-white', 'text-black'
        );
        
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
    
    // Обновление линий (оставляем как было)
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
    document.getElementById(`step${currentModalStep}_modal`).classList.add('hidden');
    document.getElementById(`step${step}_modal`).classList.remove('hidden');
    currentModalStep = step;
    updateModalProgress(step);
    if (step === 3) generateTimeSlotsModal();
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
    const times = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    times.forEach(time => {
        const btn = document.createElement('button');
        btn.textContent = time;
        btn.className = 'slot-time border border-gray-700 rounded-lg py-1 text-sm bg-black text-white hover:border-gold-500';
        btn.onclick = function() {
            document.querySelectorAll('#timeSlotsModal button').forEach(b => b.classList.remove('selected', 'bg-gold-600', 'text-black'));
            this.classList.add('selected', 'bg-gold-600', 'text-black');
            booking.time = time;
            document.getElementById('nextStep3').disabled = false;
        };
        container.appendChild(btn);
    });
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) dateInput.onchange = () => { booking.date = dateInput.value; };
}

function submitBookingModal() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    if (!name || !phone || !booking.service || !booking.master || !booking.date || !booking.time) {
        alert('Заполните все поля и выберите услугу/мастера/время');
        return;
    }
    alert(`Заявка принята! ${name}, мы свяжемся с вами.`);
    document.getElementById('step4_modal').classList.add('hidden');
    document.getElementById('success_modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => { closeBookingModal(); }, 3000);
}

function quickSubmit(e) {
    e.preventDefault();
    alert('Спасибо! Мы перезвоним вам.');
    document.getElementById('quickForm').reset();
}

function selectMaster(name) {
    openBookingModal();
    setTimeout(() => {
        const masterDiv = Array.from(document.querySelectorAll('.master-card')).find(el => el.innerText.includes(name));
        if (masterDiv) masterDiv.click();
        nextStepModal(2);
    }, 200);
}

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

// ========== СЛАЙДЕР ДЛЯ РАЗДЕЛА "О СТУДИИ" ==========
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

// ========== ПРОСМОТРЩИК ИЗОБРАЖЕНИЙ (ГАЛЕРЕЯ) ==========
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

// ========== ИНИЦИАЛИЗАЦИЯ SWIPER ДЛЯ ГАЛЕРЕИ РАБОТ ==========
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

// ========== ЗАПУСК ВСЕГО ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initFloatingCards();
    initStyleFilter();
    initPainMap();
    initAboutSlider();
    initSwiperGallery();  // <-- запуск галереи Swiper
});