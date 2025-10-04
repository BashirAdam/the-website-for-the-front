// Get all navigation links from both header and footer
const navLinks = document.querySelectorAll('.nav-link');
const footerLinks = document.querySelectorAll('.footer-link');
const allLinks = [...navLinks, ...footerLinks];

// Get the page content divs
const pages = {
    '#main-content': document.getElementById('main-content'),
    '#news-page': document.getElementById('news-page'),
    '#statements-page': document.getElementById('statements-page'),
    '#articles-page': document.getElementById('articles-page'),
    '#interviews-page': document.getElementById('interviews-page'),
    '#reports-page': document.getElementById('reports-page'),
    '#maps-page': document.getElementById('maps-page'),
    '#about-us-page': document.getElementById('about-us-page'),
    '#media-page': document.getElementById('media-page'),
    '#donations-page': document.getElementById('donations-page'),
    '#join-us-page': document.getElementById('join-us-page'),
    '#contact-page': document.getElementById('contact-page'),
    '#events-page': document.getElementById('events-page'),
    '#detail-page': document.getElementById('detail-page'),
};

// Global variables for the map
let map;
let marker;

// Simple search index built from page content
const searchableItems = [];
const buildSearchIndex = () => {
    searchableItems.length = 0;
    const sections = [
        { id: '#main-content', title: 'الرئيسية', element: pages['#main-content'] },
        { id: '#news-page', title: 'أخبار', element: pages['#news-page'] },
        { id: '#statements-page', title: 'بيانات', element: pages['#statements-page'] },
        { id: '#articles-page', title: 'مقالات', element: pages['#articles-page'] },
        { id: '#interviews-page', title: 'حوارات', element: pages['#interviews-page'] },
        { id: '#reports-page', title: 'تقارير', element: pages['#reports-page'] },
        { id: '#maps-page', title: 'خرائط', element: pages['#maps-page'] },
        { id: '#about-us-page', title: 'معلومات عنا', element: pages['#about-us-page'] },
        { id: '#media-page', title: 'وسائط', element: pages['#media-page'] },
        { id: '#donations-page', title: 'الدعم والتبرعات', element: pages['#donations-page'] },
        { id: '#join-us-page', title: 'انضم إلينا', element: pages['#join-us-page'] },
        { id: '#contact-page', title: 'إتصل بنا', element: pages['#contact-page'] },
        { id: '#events-page', title: 'الفعاليات', element: pages['#events-page'] },
    ];

    sections.forEach(section => {
        if (section.element) {
            const text = section.element.textContent.replace(/\s+/g, ' ').trim();
            searchableItems.push({ id: section.id, title: section.title, text });
        }
    });
};

// Function to hide all pages
const hideAllPages = () => {
    for (const pageId in pages) {
        pages[pageId].classList.add('hidden');
    }
};

// Function to remove all active link styles
const removeActiveStyles = () => {
    navLinks.forEach(link => link.classList.remove('active'));
};

// Function to initialize the map
const initializeMap = () => {
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof L !== 'undefined') {
        if (map) {
            map.remove();
        }
        const zagawahCoords = [13.5, 25.5];
        const zoomLevel = 8;
        
        map = L.map(mapContainer).setView(zagawahCoords, zoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const polygon = L.polygon([
            [14.2, 24.8],
            [14.8, 26.5],
            [13.0, 26.8],
            [12.5, 25.0]
        ]).addTo(map);
        
        map.fitBounds(polygon.getBounds());
        polygon.bindPopup("<b>إقليم دار زغاوة (إقليم بيربي)</b>").openPopup();
        
        window.addEventListener('resize', () => {
            if (pages['#maps-page'].classList.contains('hidden') === false) {
                map.invalidateSize();
            }
        });
    }
};

// Function to find the user's location
function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const zoomLevel = 13;

                map.setView([lat, lng], zoomLevel);

                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker([lat, lng]).addTo(map)
                    .bindPopup('موقعك الحالي').openPopup();

                showInfo(`خط الطول: ${lat.toFixed(5)}, خط العرض: ${lng.toFixed(5)}`);
            },
            (error) => {
                let message = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = "تم رفض طلب تحديد الموقع الجغرافي.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "معلومات الموقع غير متوفرة.";
                        break;
                    case error.TIMEOUT:
                        message = "انتهت مهلة طلب تحديد الموقع الجغرافي.";
                        break;
                    case error.UNKNOWN_ERROR:
                        message = "حدث خطأ غير معروف.";
                        break;
                }
                showInfo(message);
            }
        );
    } else {
        showInfo("متصفحك لا يدعم تحديد الموقع الجغرافي.");
    }
}

// Function to clear the location and marker
function clearLocation() {
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }
    map.setView([0, 0], 2);
    hideInfo();
}

// Function to show info box
function showInfo(message) {
    const infoBox = document.getElementById('infoBox');
    const infoText = document.getElementById('infoText');
    infoText.textContent = message;
    infoBox.classList.add('show');
}

// Function to hide info box
function hideInfo() {
    const infoBox = document.getElementById('infoBox');
    infoBox.classList.remove('show');
}

// Function to show region information
function showRegionInfo() {
    const infoText = document.getElementById('infoText');
    const infoBox = document.getElementById('infoBox');
    
    const regionInfo = `
        <strong>إقليم دار زغاوة (إقليم بيربي)</strong><br>
        <strong>الموقع:</strong> شمال وغرب دارفور، السودان<br>
        <strong>الإحداثيات:</strong> 13.5° شمالاً، 25.5° شرقاً<br>
        <strong>المساحة:</strong> حوالي 50,000 كيلومتر مربع<br>
        <strong>الشعب:</strong> الزغاوة<br>
        <strong>اللغة:</strong> الزغاوية<br>
        <strong>التراث:</strong> مملكة كانم التاريخية<br>
        <strong>الحدود:</strong> تشاد، ليبيا، السودان
    `;
    
    infoText.innerHTML = regionInfo;
    infoBox.classList.add('show');
}

// Universal event listener for all navigation links
allLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetPageId = event.target.getAttribute('href');
        
        // Hide all pages
        hideAllPages();
        
        // Show the target page
        if (pages[targetPageId]) {
            pages[targetPageId].classList.remove('hidden');
        }

        // Update active link styles for the header nav
        removeActiveStyles();
        const correspondingHeaderLink = document.querySelector(`.nav-link[href="${targetPageId}"]`);
        if (correspondingHeaderLink) {
            correspondingHeaderLink.classList.add('active');
        }
        
        // Update browser history
        const state = { page: targetPageId };
        const url = targetPageId === '#main-content' ? '#' : targetPageId;
        history.pushState(state, '', url);
        
        // If the maps page is shown, initialize the map
        if (targetPageId === '#maps-page') {
            initializeMap();
        }
    });
});

        // Toggle for "more" dropdown
        const moreMenuButton = document.getElementById('more-menu-button');
        const moreMenu = document.getElementById('more-menu');
        const moreMenuContainer = document.getElementById('more-menu-container');
        if (moreMenuButton && moreMenu && moreMenuContainer) {
            moreMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                moreMenu.classList.toggle('hidden');
            });
            document.addEventListener('click', (e) => {
                if (!moreMenuContainer.contains(e.target)) {
                    moreMenu.classList.add('hidden');
                }
            });
        }

        // Mobile menu functionality
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
                
                // Toggle hamburger icon
                const icon = mobileMenuButton.querySelector('svg');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                } else {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                }
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('svg');
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            });
            
            // Close mobile menu when clicking on a link
            const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('svg');
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                });
            });
        }

// Read-more handlers to open detail page
const openDetail = ({ title, meta = '', bodyHtml = '' }) => {
    hideAllPages();
    const titleEl = document.getElementById('detail-title');
    const metaEl = document.getElementById('detail-meta');
    const bodyEl = document.getElementById('detail-body');
    titleEl.textContent = title || '';
    metaEl.textContent = meta || '';
    bodyEl.innerHTML = bodyHtml || '';
    pages['#detail-page'].classList.remove('hidden');
    removeActiveStyles();
};

const bindReadMore = () => {
    document.querySelectorAll('[data-readmore]')
        .forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = link.getAttribute('data-title') || 'تفاصيل';
                const meta = link.getAttribute('data-meta') || '';
                const body = link.getAttribute('data-body') || link.getAttribute('data-body-html') || '';
                openDetail({ title, meta, bodyHtml: body });
            });
        });
};

// Initialize the map and search on page load
window.onload = () => {
    if (!pages['#maps-page'].classList.contains('hidden')) {
        initializeMap();
    }
    // Set the initial active link
    const initialLink = document.querySelector('.nav-link[href="#main-content"]');
    if (initialLink) {
        initialLink.classList.add('active');
    }

    // Build search index after DOM is ready
    buildSearchIndex();

    // Wire up search UI
    const searchButton = document.getElementById('search-button');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');
    const searchResults = document.getElementById('search-results');

    const openSearch = () => {
        searchModal.classList.remove('hidden');
        searchModal.classList.add('flex');
        searchInput.value = '';
        searchResults.innerHTML = '';
        setTimeout(() => searchInput.focus(), 0);
    };

    const closeSearch = () => {
        searchModal.classList.add('hidden');
        searchModal.classList.remove('flex');
    };

    const highlightMatch = (text, query) => {
        try {
            const safe = query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
            const re = new RegExp(`(${safe})`, 'gi');
            return text.replace(re, '<mark>$1<\/mark>');
        } catch (_) {
            return text;
        }
    };

    const renderResults = (items, query) => {
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }
        if (items.length === 0) {
            searchResults.innerHTML = '<p class="text-center text-gray-500">لا توجد نتائج</p>';
            return;
        }
        const html = items.slice(0, 20).map(item => {
            const excerpt = item.text.slice(0, 220);
            return `
                <a href="${item.id}" class="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition" data-target="${item.id}">
                    <div class="font-bold mb-1">${item.title}</div>
                    <div class="text-sm text-gray-700 leading-6">${highlightMatch(excerpt, query)}</div>
                </a>
            `;
        }).join('');
        searchResults.innerHTML = html;

        searchResults.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = a.getAttribute('data-target');
                hideAllPages();
                if (pages[target]) {
                    pages[target].classList.remove('hidden');
                }
                removeActiveStyles();
                const correspondingHeaderLink = document.querySelector(`.nav-link[href="${target}"]`);
                if (correspondingHeaderLink) {
                    correspondingHeaderLink.classList.add('active');
                }
                
                // Update browser history
                const state = { page: target };
                const url = target === '#main-content' ? '#' : target;
                history.pushState(state, '', url);
                
                if (target === '#maps-page') {
                    initializeMap();
                }
                closeSearch();
            });
        });
    };

    const doSearch = async (query) => {
        const q = (query || '').trim();
        if (!q) {
            renderResults([], q);
            return;
        }
        
        // Show loading state
        searchResults.innerHTML = '<div class="text-center py-4"><div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><p class="text-gray-500 mt-2">جاري البحث...</p></div>';
        
        try {
            // Try backend search first
            const backendResults = await searchBackend(q);
            if (backendResults && backendResults.length > 0) {
                renderBackendResults(backendResults, q);
                return;
            }
        } catch (error) {
            console.log('Backend search failed, using local search:', error);
        }
        
        // Fallback to local search
        const lower = q.toLowerCase();
        const results = searchableItems.filter(item => item.text.toLowerCase().includes(lower) || item.title.toLowerCase().includes(lower));
        renderResults(results, q);
    };

    const searchBackend = async (query) => {
        try {
            const response = await fetch(`http://localhost:1337/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Backend search failed');
            }
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Backend search error:', error);
            throw error;
        }
    };

    const renderBackendResults = (results, query) => {
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-center text-gray-500">لا توجد نتائج</p>';
            return;
        }
        
        const html = results.slice(0, 20).map(item => {
            const excerpt = (item.content || '').slice(0, 220);
            const typeLabels = {
                'news': 'أخبار',
                'statements': 'بيانات', 
                'articles': 'مقالات',
                'interviews': 'حوارات',
                'reports': 'تقارير',
                'media': 'وسائط',
                'events': 'فعاليات'
            };
            
            return `
                <a href="#" class="block p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition" data-target="${item.type}-page">
                    <div class="flex items-start justify-between mb-2">
                        <div class="font-bold text-gray-800">${highlightMatch(item.title, query)}</div>
                        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${typeLabels[item.type] || item.type}</span>
                    </div>
                    <div class="text-sm text-gray-700 leading-6">${highlightMatch(excerpt, query)}</div>
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded mt-2">` : ''}
                </a>
            `;
        }).join('');
        
        searchResults.innerHTML = html;
        
        // Add click handlers for backend results
        searchResults.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = a.getAttribute('data-target');
                hideAllPages();
                if (pages[target]) {
                    pages[target].classList.remove('hidden');
                }
                removeActiveStyles();
                const correspondingHeaderLink = document.querySelector(`.nav-link[href="${target}"]`);
                if (correspondingHeaderLink) {
                    correspondingHeaderLink.classList.add('active');
                }
                
                // Update browser history
                const state = { page: target };
                const url = target === '#main-content' ? '#' : target;
                history.pushState(state, '', url);
                
                if (target === '#maps-page') {
                    initializeMap();
                }
                closeSearch();
            });
        });
    };

    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    }
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) closeSearch();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', (e) => doSearch(e.target.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
            if (e.key === 'Enter') {
                const first = searchResults.querySelector('a');
                if (first) first.click();
            }
        });
    }

    // Bind read-more links after DOM ready
    bindReadMore();
    
    // Browser navigation support
    window.addEventListener('popstate', function(event) {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            const pageId = hash.replace('#', '');
            if (pages[`#${pageId}`]) {
                showPage(pageId);
            } else {
                showPage('main-content');
            }
        } else {
            showPage('main-content');
        }
    });
    
    // Handle initial page load based on URL hash
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            const pageId = hash.replace('#', '');
            if (pages[`#${pageId}`]) {
                showPage(pageId);
            }
        }
    });
};

// Copy to clipboard function for donations page
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('تم نسخ النص بنجاح!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification('تم نسخ النص بنجاح!');
        } else {
            showCopyNotification('فشل في نسخ النص');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showCopyNotification('فشل في نسخ النص');
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Contact form handler
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'جاري الإرسال...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        event.target.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showFormNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
    }, 2000);
}

function showFormNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
