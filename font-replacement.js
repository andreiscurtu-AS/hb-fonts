/* V2.00 - 25/07/2025 */

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
    
    // Create and inject CSS to override only spans with Nunito fonts
    function injectFontCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Target only spans with explicit Nunito declarations */
            span[style*="font-family: Nunito"],
            span[style*="font-family:Nunito"],
            span[style*="font-family: 'Nunito'"],
            span[style*='font-family: "Nunito"'] {
                font-family: 'Futura PT', sans-serif !important;
                font-weight: 300 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Check if a span element explicitly uses Nunito font
    function usesNunitoFont(element) {
        // Only process span elements
        if (element.tagName !== 'SPAN') return false;
        
        // Check inline styles only
        if (element.style.fontFamily) {
            const inlineFont = element.style.fontFamily.toLowerCase();
            return inlineFont.includes('nunito');
        }
        
        return false;
    }
    
    // Function to process existing spans - only those with Nunito
    function replaceExistingFonts() {
        // Target only span elements
        const spanElements = document.querySelectorAll('span');
        
        spanElements.forEach(el => {
            if (usesNunitoFont(el)) {
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
                            // Check the node itself if it's a span
                            if (usesNunitoFont(node)) {
                                node.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                                node.style.setProperty('font-weight', '300', 'important');
                            }
                            
                            // Check span elements within the node
                            const spanElements = node.querySelectorAll('span');
                            spanElements.forEach(el => {
                                if (usesNunitoFont(el)) {
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

//Prevent click on dropdown
// Prevent clicks on parent menu items that have submenus
document.addEventListener('DOMContentLoaded', function() {
    // Select the main links for Connect and Learn (items with submenus)
    const parentMenuItems = document.querySelectorAll('a[href="/page/connect"], a[href="/page/conversations"]');
    
    parentMenuItems.forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Prevent the default link behavior
            event.preventDefault();
            
            // Optionally, you can add some visual feedback or logging
            console.log('Click prevented on:', link.textContent.trim());
        });
    });
});
