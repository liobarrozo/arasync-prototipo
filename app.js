// Initialize Lucide icons
lucide.createIcons();

// --- Elements ---
const view1 = document.getElementById('view1');
const view2 = document.getElementById('view2');
const view3 = document.getElementById('view3');

const goToView3Btn = document.getElementById('goToView3Btn');
const backToView2Btn = document.getElementById('backToView2Btn');

const contactForm = document.getElementById('contactForm');
const loaderArea = document.getElementById('loaderArea');
const contactNameInput = document.getElementById('contactName');
const contactSchoolInput = document.getElementById('contactSchool');
const contactGradeInput = document.getElementById('contactGrade');
const contactPhoneInput = document.getElementById('contactPhone');

// Sidebar Elements
const detailsSidebar = document.getElementById('details-sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const sidebarIcon = document.getElementById('sidebarIcon');
const sidebarContent = document.getElementById('sidebar-content');

// Detail Fields
const detailName = document.getElementById('detail-name');
const detailSchool = document.getElementById('detail-school');
const detailPhone = document.getElementById('detail-phone');
const detailInfo = document.getElementById('detail-info');
const detailStatus = document.getElementById('detail-status');

// Tutorial Elements
const tutorialBackdrop = document.getElementById('tutorial-backdrop');
const tutorialSpotlight = document.getElementById('tutorial-spotlight');
const tutorialTooltip = document.getElementById('tutorial-tooltip');
const nextTutorialBtn = document.getElementById('nextTutorial');
const prevTutorialBtn = document.getElementById('prevTutorial');
const skipTutorialBtn = document.getElementById('skipTutorial');
const tutorialTitle = document.getElementById('tutorial-title');
const tutorialText = document.getElementById('tutorial-text');
const tutorialStepCount = document.getElementById('tutorial-step-count');

// Loader Elements
const loaderSpinner1 = document.getElementById('loaderSpinner1');
const checkIcon1 = document.getElementById('checkIcon1');
const loaderText1 = document.getElementById('loaderText1');

const loaderSpinner2 = document.getElementById('loaderSpinner2');
const checkIcon2 = document.getElementById('checkIcon2');
const loaderText2 = document.getElementById('loaderText2');

// Stats Elements
const progressCircle = document.getElementById('progressCircle');
const progressText = document.getElementById('progressText');
const contactCount = document.getElementById('contactCount');
const remainingCount = document.getElementById('remainingCount');
const weeklyCount = document.getElementById('weeklyCount');

// Kanban Elements
const colNuevos = document.getElementById('colNuevos');
const rotateOverlay = document.getElementById('rotateOverlay');
const dismissRotateOverlay = document.getElementById('dismissRotateOverlay');

// Variables
let currentContacts = 5;
const dailyGoal = 15;
let currentWeekContacts = 25;

// --- Form Submission Logic ---
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactNameInput.value.trim();
    if (!name) return;

    const school = contactSchoolInput ? contactSchoolInput.value.trim() : '';
    const grade = contactGradeInput ? contactGradeInput.value : '';
    const phone = contactPhoneInput ? contactPhoneInput.value.trim() : '';


    // 1. Hide form, show loader
    contactForm.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        loaderArea.classList.remove('hidden');
        loaderArea.classList.add('flex');
    }, 300);

    // Initial Toast
    Toastify({
        text: "Iniciando sincronización...",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        style: { background: "#0ea5e9", borderRadius: "8px", fontWeight: "bold" }
    }).showToast();

    // 2. Step 1: Enviando ubicación (1.5s)
    setTimeout(() => {
        loaderSpinner1.classList.add('hidden');
        checkIcon1.classList.remove('hidden');
        loaderText1.classList.replace('text-slate-600', 'text-brand-emerald');
        
        loaderSpinner2.classList.remove('invisible');
        loaderText2.classList.replace('text-slate-400', 'text-slate-600');

        // 3. Step 2: Enviando contacto (1.5s)
        setTimeout(() => {
            loaderSpinner2.classList.add('hidden');
            checkIcon2.classList.remove('hidden');
            loaderText2.classList.replace('text-slate-600', 'text-brand-emerald');

            // 4. Update Stats
            currentContacts++;
            currentWeekContacts++;
            
            contactCount.textContent = currentContacts;
            weeklyCount.textContent = currentWeekContacts;
            remainingCount.textContent = dailyGoal - currentContacts;
            
            const percentage = Math.round((currentContacts / dailyGoal) * 100);
            progressText.textContent = `${percentage}%`;
            
            // Assuming 100 for circumference dasharray mapping
            const offset = 100 - percentage;
            progressCircle.style.strokeDasharray = `${percentage}, 100`;

            Toastify({
                text: "Lead sincronizado con éxito ✅",
                duration: 3000,
                gravity: "bottom",
                position: "center",
                style: { background: "#10b981", borderRadius: "8px", fontWeight: "bold" }
            }).showToast();

            // 5. Add to Kanban Board
            addNewLeadToKanban(name, school, grade, phone);

            // 6. Transition to View 2
            setTimeout(() => {
                transitionToView2();
            }, 3000);

        }, 1500);
    }, 1500);
});

// --- View Transition Logic ---
function transitionToView2() {
    // Fade out View 1
    view1.classList.add('opacity-0');
    
    setTimeout(() => {
        view1.classList.add('hidden');
        view1.classList.remove('flex');
        
        // Show View 2
        view2.classList.remove('hidden');
        view2.classList.add('flex');
        
        // Trigger reflow
        void view2.offsetWidth;
        
        // Fade in View 2
        view2.classList.remove('opacity-0');
        
        // Handle Mobile Rotation
        const waitingForRotation = checkAndApplyRotation();

        // Trigger Tutorial if not shown before (or every time for demo)
        if (!waitingForRotation) {
            setTimeout(() => {
                startTutorial();
            }, 1000);
        }

    }, 500);
}

// --- Mobile Rotation Logic ---
function checkAndApplyRotation() {
    if (window.innerWidth < 1024) {
        // Show the overlay telling them to rotate
        rotateOverlay.classList.remove('hidden');
        rotateOverlay.classList.add('flex');
        return true;
    }
    return false;
}

// Listen for actual orientation changes
window.addEventListener('orientationchange', () => {
    if (window.orientation === 90 || window.orientation === -90) {
        // Landscape
        view2.classList.remove('force-rotate-view');
        rotateOverlay.classList.add('hidden');
        rotateOverlay.classList.remove('flex');
    } else if (window.innerWidth < 1024 && !view1.classList.contains('flex')) {
        // Portrait
        view2.classList.add('force-rotate-view');
        rotateOverlay.classList.remove('hidden');
        rotateOverlay.classList.add('flex');
    }
});

dismissRotateOverlay.addEventListener('click', () => {
    rotateOverlay.classList.add('opacity-0');
    
    // Force rotate view 2 so they can use it horizontally
    view2.classList.add('force-rotate-view');
    // Ensure reflow so transformation takes place smoothly
    void view2.offsetWidth;

    setTimeout(() => {
        rotateOverlay.classList.add('hidden');
        rotateOverlay.classList.remove('flex');
        
        // After view is finally rotated and overlay is gone, start tutorial
        setTimeout(() => {
            startTutorial();
        }, 300);
    }, 300);
});

// --- View 3 Transition Logic ---
if (goToView3Btn) {
    goToView3Btn.addEventListener('click', () => {
        // Fade out View 2
        view2.classList.add('opacity-0');
        
        setTimeout(() => {
            view2.classList.add('hidden');
            view2.classList.remove('flex');
            
            // Show View 3
            view3.classList.remove('hidden');
            view3.classList.add('flex');
            
            // Trigger reflow
            void view3.offsetWidth;
            
            // Fade in View 3
            view3.classList.remove('opacity-0');
        }, 500);
    });
}

if (backToView2Btn) {
    backToView2Btn.addEventListener('click', () => {
        // Fade out View 3
        view3.classList.add('opacity-0');
        
        setTimeout(() => {
            view3.classList.add('hidden');
            view3.classList.remove('flex');
            
            // Show View 2
            view2.classList.remove('hidden');
            view2.classList.add('flex');
            
            // Trigger reflow
            void view2.offsetWidth;
            
            // Fade in View 2
            view2.classList.remove('opacity-0');
            
            // Handle Mobile Rotation if needed
            checkAndApplyRotation();
        }, 500);
    });
}

// --- Kanban Logic ---
function addNewLeadToKanban(name) {
    const colTarget = document.getElementById('col-nuevos');
    if(!colTarget) return;

    const leadHTML = `
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#38b2ac] flex flex-col gap-3 hover:shadow-md transition-shadow animate-pulse border border-t border-r border-b border-gray-200">
            <div class="text-sm font-bold text-[#1e3a5f] leading-tight flex justify-between items-start">
                <span>Aramendi: ${name}.<br>
                <span class="font-medium text-slate-500 text-xs">Escuela Nacional, 5° Sec.</span></span>
                <span class="bg-brand-emerald text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold animate-pulse">Nuevo</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
                <button class="kanban-btn w-full bg-[#0c6b8c] hover:bg-[#095069] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-colors text-center" data-action="Iniciar Bienvenida">
                    Iniciar Bienvenida
                </button>
                <button class="kanban-btn w-full bg-[#0c6b8c] hover:bg-[#095069] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-colors text-center" data-action="Enviar Itinerario">
                    Enviar Itinerario
                </button>
            </div>
        </div>
    `;

    // Insert at the top
    colTarget.insertAdjacentHTML('afterbegin', leadHTML);
    // Re-bind buttons
    bindKanbanButtons();
}

function bindKanbanButtons() {
    const buttons = document.querySelectorAll('.kanban-btn');
    buttons.forEach(btn => {
        // Prevent multiple bindings
        btn.removeEventListener('click', btnClickHandler);
        btn.addEventListener('click', btnClickHandler);
    });
}

function btnClickHandler(e) {
    const action = e.currentTarget.getAttribute('data-action');
    if(action) {
        Toastify({
            text: `Acción: ${action} enviada 🚀`,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#0284c7", borderRadius: "8px", fontWeight: "bold" }
        }).showToast();
    }
}

// --- Tutorial Logic ---
let currentTutorialStep = 0;
const tutorialSteps = [
    {
        target: 'step-kanban-cols',
        title: 'Gestión por Columnas',
        text: 'Aquí verás el flujo de ventas. Tus leads se mueven de izquierda a derecha según avancen en el proceso.',
        position: 'right'
    },
    {
        target: 'step-details-header',
        title: 'Detalles del Lead',
        text: 'Al hacer clic en una tarjeta, verás toda la información detallada de ese padre o contacto aquí mismo.',
        position: 'left'
    },
    {
        target: 'step-actions',
        title: 'Acciones Rápidas',
        text: 'Desde aquí puedes enviar la bienvenida por WhatsApp, enviar el catálogo o cerrar la venta con un solo clic.',
        position: 'top'
    },
    {
        target: 'goToView3Btn',
        title: 'Visión Estratégica',
        text: '¡Por último! Haz clic aquí para ver el Panel del Gerente y supervisar las métricas globales del equipo.',
        position: 'bottom'
    }
];

function startTutorial() {
    currentTutorialStep = 0;
    document.body.classList.add('tutorial-active');
    tutorialBackdrop.classList.remove('hidden');
    tutorialSpotlight.classList.remove('hidden');
    tutorialTooltip.classList.remove('hidden');
    setTimeout(() => {
        tutorialTooltip.classList.replace('opacity-0', 'opacity-100');
        tutorialTooltip.classList.replace('scale-95', 'scale-100');
    }, 10);
    showTutorialStep();
}

function getLocalRect(el, container) {
    let top = 0, left = 0;
    let width = el.offsetWidth;
    let height = el.offsetHeight;
    let current = el;
    
    while (current && current !== container) {
        top += current.offsetTop || 0;
        left += current.offsetLeft || 0;
        current = current.offsetParent;
    }
    
    current = el.parentElement;
    while (current && current !== container && current !== document.body) {
        if (current.scrollTop) top -= current.scrollTop;
        if (current.scrollLeft) left -= current.scrollLeft;
        current = current.parentElement;
    }
    
    return { top, left, width, height, right: left + width, bottom: top + height };
}

function showTutorialStep() {
    const step = tutorialSteps[currentTutorialStep];
    const targetEl = document.getElementById(step.target);
    
    // Position spotlight and tooltip
    if (targetEl) {
        const rect = getLocalRect(targetEl, view2);
        
        // Spotlight dimensions
        const padding = 8;
        tutorialSpotlight.style.top = `${rect.top - padding}px`;
        tutorialSpotlight.style.left = `${rect.left - padding}px`;
        tutorialSpotlight.style.width = `${rect.width + padding * 2}px`;
        tutorialSpotlight.style.height = `${rect.height + padding * 2}px`;

        tutorialSpotlight.classList.replace('opacity-0', 'opacity-100');
        
        // Position tooltip
        positionTooltip(rect, step.position);
    }

    // Update content
    tutorialTitle.textContent = step.title;
    tutorialText.textContent = step.text;
    tutorialStepCount.textContent = `PASO ${currentTutorialStep + 1} / ${tutorialSteps.length}`;

    // Buttons visibility
    prevTutorialBtn.classList.toggle('hidden', currentTutorialStep === 0);
    nextTutorialBtn.textContent = currentTutorialStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente';
    
    // Animate tooltip
    tutorialTooltip.classList.replace('opacity-0', 'opacity-100');
    tutorialTooltip.classList.replace('scale-95', 'scale-100');
}

function positionTooltip(rect, pos) {
    const padding = 20;
    let top, left;

    if (pos === 'right') {
        top = rect.top + rect.height / 2 - tutorialTooltip.offsetHeight / 2;
        left = rect.right + padding;
    } else if (pos === 'left') {
        top = rect.top + rect.height / 2 - tutorialTooltip.offsetHeight / 2;
        left = rect.left - tutorialTooltip.offsetWidth - padding;
    } else if (pos === 'top') {
        top = rect.top - tutorialTooltip.offsetHeight - padding;
        left = rect.left + rect.width / 2 - tutorialTooltip.offsetWidth / 2;
    } else { // bottom
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2 - tutorialTooltip.offsetWidth / 2;
    }

    tutorialTooltip.style.top = `${Math.max(10, top)}px`;
    tutorialTooltip.style.left = `${Math.max(10, left)}px`;
}

nextTutorialBtn.addEventListener('click', () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
        currentTutorialStep++;
        showTutorialStep();
    } else {
        endTutorial();
    }
});

prevTutorialBtn.addEventListener('click', () => {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        showTutorialStep();
    }
});

skipTutorialBtn.addEventListener('click', endTutorial);

function endTutorial() {
    document.body.classList.remove('tutorial-active');
    tutorialSpotlight.classList.replace('opacity-100', 'opacity-0');
    tutorialTooltip.classList.replace('opacity-100', 'opacity-0');
    tutorialTooltip.classList.replace('scale-100', 'scale-95');
    setTimeout(() => {
        tutorialSpotlight.classList.add('hidden');
        tutorialBackdrop.classList.add('hidden');
        tutorialTooltip.classList.add('hidden');
    }, 300);
}

// --- Sidebar Toggling ---
toggleSidebarBtn.addEventListener('click', () => {
    const isCollapsed = detailsSidebar.classList.toggle('sidebar-collapsed');
    sidebarIcon.classList.toggle('rotate-180', !isCollapsed);
    sidebarIcon.classList.toggle('rotate-0', isCollapsed);
});

// --- Dynamic Lead Selection ---
function bindLeadSelection() {
    const cards = document.querySelectorAll('.kanban-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't select if clicking a button inside the card
            if (e.target.closest('.kanban-btn')) return;

            // Highlight selected card
            cards.forEach(c => c.classList.remove('ring-2', 'ring-brand-sky', 'bg-sky-50'));
            card.classList.add('ring-2', 'ring-brand-sky', 'bg-sky-50');

            // Update Sidebar Data
            detailName.textContent = card.dataset.name;
            detailSchool.textContent = card.dataset.school;
            detailPhone.value = card.dataset.phone;
            detailInfo.value = `${card.dataset.school} | Grado: 5°`;
            detailStatus.value = `En ${card.dataset.status || 'Proceso'}`;

            // Pulse effect to show update
            sidebarContent.classList.add('animate-pulse');
            setTimeout(() => sidebarContent.classList.remove('animate-pulse'), 500);

            // Auto-expand if collapsed
            if (detailsSidebar.classList.contains('sidebar-collapsed')) {
                toggleSidebarBtn.click();
            }
        });
    });
}

// Update addNewLeadToKanban to support selection
const originalAddNewLeadToKanban = addNewLeadToKanban;
addNewLeadToKanban = function(name, school, grade, phone) {
    const colTarget = document.getElementById('col-nuevos');
    if(!colTarget) return;

    const id = Date.now();
    const displayPhone = phone || '+1 000 000 0000';
    let displaySchool = [];
    if (school) displaySchool.push(school);
    if (grade) displaySchool.push(grade);
    const finalSchoolStr = displaySchool.length > 0 ? displaySchool.join(', ') : 'Sin datos de colegio';

    const leadHTML = `
        <div class="kanban-card bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#38b2ac] flex flex-col gap-3 hover:shadow-md transition-all cursor-pointer group animate-pulse border border-gray-200" data-id="${id}" data-name="${name}" data-school="${finalSchoolStr}" data-phone="${displayPhone}" data-status="Nuevos Leads">
            <div class="text-sm font-bold text-[#1e3a5f] leading-tight group-hover:text-brand-sky flex justify-between items-start">
                <span>AraSync: ${name}.<br>
                <span class="font-medium text-slate-500 text-xs">${finalSchoolStr}</span></span>
                <span class="bg-brand-emerald text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold">Nuevo</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
                <button class="kanban-btn w-full bg-[#0c6b8c] hover:bg-[#095069] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-colors text-center" data-action="Iniciar Bienvenida">
                    Iniciar Bienvenida
                </button>
            </div>
        </div>
    `;

    colTarget.insertAdjacentHTML('afterbegin', leadHTML);
    bindKanbanButtons();
    bindLeadSelection();
};

// Initial binding
bindKanbanButtons();
bindLeadSelection();
