(function() {
    'use strict';
    
    // Load Futura PT font from CDN Fonts
    function loadFuturaFont() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.cdnfonts.com/css/futura-pt?styles=117667';
        document.head.appendChild(link);
    }
    
    // Create and inject CSS to override only Nunito fonts
    function injectFontCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Target only explicit Nunito declarations */
            [style*="font-family: Nunito"],
            [style*="font-family:Nunito"],
            [style*="font-family: 'Nunito'"],
            [style*='font-family: "Nunito"'],
            .nunito,
            [class*="nunito"] {
                font-family: 'Futura PT', sans-serif !important;
                font-weight: 300 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Check if an element explicitly uses Nunito font (avoid computed styles)
    function usesNunitoFont(element) {
        // Check inline styles first
        if (element.style.fontFamily) {
            const inlineFont = element.style.fontFamily.toLowerCase();
            if (inlineFont.includes('alga')) return false;
            if (inlineFont.includes('nunito')) return true;
        }
        
        // Check class names
        const className = element.className || '';
        if (className.toLowerCase().includes('nunito')) return true;
        
        // Check computed style only if no explicit indicators found
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily.toLowerCase();
        
        // Exclude elements that explicitly use Alga
        if (fontFamily.includes('alga')) return false;
        
        // Only target if Nunito is explicitly mentioned
        return fontFamily.includes('nunito');
    }
    
    // Function to process existing elements - only Nunito users
    function replaceExistingFonts() {
        // Target common text elements instead of all elements for speed
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label, input, textarea');
        
        textElements.forEach(el => {
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
                            // Check the node itself
                            if (usesNunitoFont(node)) {
                                node.style.setProperty('font-family', 'Futura PT, sans-serif', 'important');
                                node.style.setProperty('font-weight', '300', 'important');
                            }
                            
                            // Check text elements within the node
                            const textElements = node.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
                            textElements.forEach(el => {
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
