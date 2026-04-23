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
        if (i < step) {
            badge.classList.remove('bg-gray-700', 'text-gray-300');
            badge.classList.add('bg-green-600', 'text-white');
            badge.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else if (i === step) {
            badge.classList.remove('bg-gray-700', 'text-gray-300');
            badge.classList.add('bg-gold-600', 'text-black');
            badge.innerHTML = i;
        } else {
            badge.classList.remove('bg-gold-600', 'bg-green-600', 'text-white');
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

function selectServiceModal(service) {
    booking.service = service;
    document.querySelectorAll('.service-card-modal').forEach(c => c.classList.remove('border-gold-500'));
    event.currentTarget.classList.add('border-gold-500');
    document.getElementById('nextStep1').disabled = false;
}

function selectMasterModal(master) {
    booking.master = master;
    document.querySelectorAll('.master-card').forEach(c => c.classList.remove('border-gold-500'));
    event.currentTarget.classList.add('border-gold-500');
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
        'left-arm': { name: "Левая рука (плечо/предплечье)", level: 4, description: "Одна из наименее болезненных зон" },
        'right-arm': { name: "Правая рука (плечо/предплечье)", level: 4, description: "Аналогично левой" },
        'left-leg': { name: "Левая нога (голень/бедро)", level: 5, description: "Мышцы смягчают боль, но кости голени чувствительны" },
        'right-leg': { name: "Правая нога (голень/бедро)", level: 5, description: "То же, что и левая" }
    };
    const parts = document.querySelectorAll('.body-part');
    const resultDiv = document.getElementById('painResult');
    parts.forEach(part => {
        part.addEventListener('click', (e) => {
            const partKey = part.getAttribute('data-part');
            const data = painData[partKey];
            if (data) {
                let stars = '';
                for (let i = 1; i <= 10; i++) stars += i <= data.level ? '🔥' : '⚫';
                resultDiv.innerHTML = `<div class="bg-gold-500/10 p-3 rounded-lg"><p class="text-xl font-bold text-white">${data.name}</p><p class="text-2xl text-gold-500 my-2">${data.level} / 10</p><p class="text-sm text-gray-300">${stars}</p><p class="text-sm text-gray-400 mt-2">${data.description}</p></div>`;
            } else {
                resultDiv.innerHTML = `<p class="text-gray-400">Информация скоро появится</p>`;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(inp => {
        inp.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 0) {
                if (val[0] === '7' || val[0] === '8') val = val.substring(1);
                let formatted = '+7';
                if (val.length > 0) formatted += ' (' + val.substring(0, 3);
                if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
                if (val.length >= 6) formatted += '-' + val.substring(6, 8);
                if (val.length >= 8) formatted += '-' + val.substring(8, 10);
                e.target.value = formatted;
            }
        });
    });
    window.addEventListener('scroll', function() {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-black/90', 'backdrop-blur-md');
            nav.classList.remove('bg-transparent');
        } else {
            nav.classList.remove('bg-black/90', 'backdrop-blur-md');
            nav.classList.add('bg-transparent');
        }
    });
});