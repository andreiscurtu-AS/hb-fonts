(function() {
    'use strict';
    
    // Load Futura PT font from CDN Fonts
    function loadFuturaFont() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.cdnfonts.com/css/futura-pt?styles=117667';
        document.head.appendChild(link);
    }
    
    // Create and inject CSS to override all Nunito fonts
    function injectFontCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Override all Nunito fonts with Futura PT 300 */
            * {
                font-family: 'Futura PT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-weight: 300 !important;
            }
            
            /* Specific overrides for common elements */
            body, p, div, span, h1, h2, h3, h4, h5, h6, 
            .nunito, [style*="Nunito"], [class*="nunito"] {
                font-family: 'Futura PT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-weight: 300 !important;
            }
            
            /* Target elements that might have inline Nunito styles */
            [style*="font-family: Nunito"],
            [style*="font-family:Nunito"],
            [style*="font-family: 'Nunito'"],
            [style*='font-family: "Nunito"'] {
                font-family: 'Futura PT', sans-serif !important;
                font-weight: 300 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Function to process existing elements
    function replaceExistingFonts() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.fontFamily.includes('Nunito')) {
                el.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                el.style.setProperty('font-weight', '300', 'important');
            }
        });
    }
    
    // Observer to handle dynamically added content
    function observeNewElements() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const elements = [node, ...node.querySelectorAll('*')];
                        elements.forEach(el => {
                            if (el.style && el.style.fontFamily && el.style.fontFamily.includes('Nunito')) {
                                el.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                                el.style.setProperty('font-weight', '300', 'important');
                            }
                        });
                    }
                });
            });
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
        
        // Wait for fonts to load, then replace existing fonts
        document.fonts.ready.then(() => {
            replaceExistingFonts();
        });
        
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
