let toastContainer = null;

const ensureContainer = () => {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'nexus-toast-container';
    toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
    `;
    if (!document.getElementById('nexus-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'nexus-toast-styles';
        style.textContent = `
            @keyframes nexus-toast-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .nexus-toast {
                pointer-events: auto;
                min-width: 320px;
                max-width: 420px;
                background: #ffffff;
                border-radius: 14px;
                border: 1px solid #E2E8F0;
                box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
                overflow: hidden;
                animation: nexus-toast-in 0.3s ease-out;
                font-family: inherit;
            }
            .nexus-toast-body {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 16px;
            }
            .nexus-toast-icon {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .nexus-toast-icon svg { width: 19px; height: 19px; }
            .nexus-toast-content { flex: 1; min-width: 0; }
            .nexus-toast-title {
                font-size: 13px;
                font-weight: 700;
                color: #1E293B;
                line-height: 1.3;
            }
            .nexus-toast-msg {
                font-size: 12px;
                color: #64748B;
                margin-top: 2px;
                line-height: 1.4;
                overflow-wrap: anywhere;
            }
            .nexus-toast-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #94A3B8;
                padding: 4px;
                flex-shrink: 0;
                border-radius: 6px;
                transition: all 0.15s;
                display: flex;
            }
            .nexus-toast-close:hover { color: #475569; background: #F1F5F9; }
            .nexus-toast-close svg { width: 15px; height: 15px; }
            .nexus-toast-bar { height: 5px; }
        `;
        document.head.appendChild(style);
    }
    document.body.appendChild(toastContainer);
    return toastContainer;
};

const closeIcon = () => `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
`;

const checkIcon = () => `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
    </svg>
`;

const alertIcon = () => `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14.16A2 2 0 003.82 21h16.36a2 2 0 001.73-2.98L13.73 3.86a2 2 0 00-3.46 0z"></path>
    </svg>
`;

const infoIcon = () => `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <path stroke-linecap="round" d="M12 16v-4M12 8h.01"></path>
    </svg>
`;

const CONFIG = {
    success: { icon: checkIcon, bg: '#D1FAE5', color: '#059669', bar: '#10B981' },
    error:   { icon: alertIcon, bg: '#FEE2E2', color: '#DC2626', bar: '#EF4444' },
    info:    { icon: infoIcon,  bg: '#DBEAFE', color: '#2563EB', bar: '#3B82F6' },
    warning: { icon: alertIcon, bg: '#FEF3C7', color: '#D97706', bar: '#F59E0B' }
};

export const showToast = (message, type = 'success', title = '') => {
    const container = ensureContainer();
    const cfg = CONFIG[type] || CONFIG.success;
    const titles = {
        success: 'Success',
        error: 'Error',
        info: 'Information',
        warning: 'Warning'
    };
    const toastTitle = title || titles[type] || 'Success';

    const el = document.createElement('div');
    el.className = 'nexus-toast';
    el.innerHTML = `
        <div class="nexus-toast-body">
            <div class="nexus-toast-icon" style="background:${cfg.bg};color:${cfg.color}">
                ${cfg.icon()}
            </div>
            <div class="nexus-toast-content">
                <div class="nexus-toast-title">${toastTitle.replace('<', '&lt;')}</div>
                <div class="nexus-toast-msg">${String(message).replace('<', '&lt;')}</div>
            </div>
            <button class="nexus-toast-close" aria-label="Close">${closeIcon()}</button>
        </div>
        <div class="nexus-toast-bar" style="background:${cfg.bar}"></div>
    `;

    const remove = () => {
        if (!el.parentNode) return;
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        el.style.transform = 'translateX(100%)';
        el.style.opacity = '0';
        setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 300);
    };

    el.querySelector('.nexus-toast-close').addEventListener('click', remove);
    el.addEventListener('click', (e) => {
        if (e.target !== el.querySelector('.nexus-toast-close')) {
            // allow card click to dismiss as well
        }
    });

    container.appendChild(el);
    setTimeout(remove, 3500);

    return remove;
};

export default showToast;