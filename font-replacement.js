/* V04.00 - 29/07/2025 */
 
// Fonts Replacement
(function() {
    'use strict';
    
    // Load Futura PT font from CDN Fonts
    function loadFuturaFont() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.cdnfonts.com/css/futura-pt?styles=117667';
        document.head.appendChild(link);
    }
    
    // Create and inject CSS to override only p tags with Inter fonts
    function injectFontCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Target only p tags with explicit Inter declarations */
            p[style*="font-family: Inter"],
            p[style*="font-family:Inter"],
            p[style*="font-family: 'Inter'"],
            p[style*='font-family: "Inter"'] {
                font-family: 'Futura PT', sans-serif !important;
                font-weight: 300 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Check if a p element explicitly uses Inter font
    function usesInterFont(element) {
        // Only process p elements
        if (element.tagName !== 'P') return false;
        
        // Check inline styles only
        if (element.style.fontFamily) {
            const inlineFont = element.style.fontFamily.toLowerCase();
            return inlineFont.includes('Inter');
        }
        
        return false;
    }
    
    // Function to process existing p tags - only those with Inter
    function replaceExistingFonts() {
        // Target only p elements
        const pElements = document.querySelectorAll('p');
        
        pElements.forEach(el => {
            if (usesInterFont(el)) {
                el.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                el.style.setProperty('font-weight', '300', 'important');
            }
        });
    }
    
    // Debounced observer to handle dynamically added content
    function observeNewElements() {
        let timeout;
        
        const observer = new MutationObserver(function(mutations) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check the node itself if it's a p
                            if (usesInterFont(node)) {
                                node.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                                node.style.setProperty('font-weight', '300', 'important');
                            }
                            
                            // Check p elements within the node
                            const pElements = node.querySelectorAll('p');
                            pElements.forEach(el => {
                                if (usesInterFont(el)) {
                                    el.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                                    el.style.setProperty('font-weight', '300', 'important');
                                }
                            });
                        }
                    });
                });
            }, 100); // 100ms debounce
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize the font replacement
    function init() {
        loadFuturaFont();
        injectFontCSS();
        
        // Process existing fonts immediately, don't wait for font loading
        replaceExistingFonts();
        
        // Start observing for new elements
        observeNewElements();
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

// Prevent click on dropdown
// Prevent clicks on dropdown parent items - improved version
(function() {
    'use strict';
    
    function preventParentClicks() {
        // More flexible selectors - adjust these to match your actual menu structure
        const parentMenuItems = document.querySelectorAll('a[href*="/page/connect"], a[href*="/page/conversations"]');
        
        parentMenuItems.forEach(function(link) {
            // Check if we've already added the listener to avoid duplicates
            if (!link.hasAttribute('data-click-prevented')) {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation(); // <--- This is the new line!
                    console.log('Click prevented on:', link.textContent.trim());
                });
                link.setAttribute('data-click-prevented', 'true');
            }
        });
    }
    
    // Observer for dynamically added menu items
    function observeMenuChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    preventParentClicks();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    function initClickPrevention() {
        preventParentClicks();
        observeMenuChanges();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClickPrevention);
    } else {
        initClickPrevention();
    }
})();
