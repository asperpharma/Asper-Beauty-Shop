/**
 * Performance Optimization Utilities
 * 
 * Collection of utilities to improve site performance including
 * preloading, lazy loading, and resource prioritization.
 */

/**
 * Preload critical images for faster LCP (Largest Contentful Paint)
 */
export const preloadCriticalImages = (imageUrls: string[]) => {
    if (typeof window === 'undefined') return;

    imageUrls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
    });
};

/**
 * Preconnect to external domains for faster resource loading
 */
export const preconnectDomains = (domains: string[]) => {
    if (typeof window === 'undefined') return;

    domains.forEach((domain) => {
        // Preconnect
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = domain;
        document.head.appendChild(preconnect);

        // DNS-prefetch as fallback
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = domain;
        document.head.appendChild(dnsPrefetch);
    });
};

/**
 * Lazy load images when they enter viewport
 * Uses Intersection Observer API for better performance
 */
export const setupLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach((img) => {
            imageObserver.observe(img);
        });
    }
};

/**
 * Defer non-critical scripts for better initial page load
 */
export const deferNonCriticalScripts = () => {
    if (typeof window === 'undefined') return;

    // Defer analytics, social widgets, etc. until after page load
    window.addEventListener('load', () => {
        // Add any third-party scripts here
        console.log('Non-critical resources loaded');
    });
};

/**
 * Prefetch next page resources for instant navigation
 */
export const prefetchNextPage = (url: string) => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Report Web Vitals for monitoring
 */
export const reportWebVitals = () => {
    if ('PerformanceObserver' in window) {
        try {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as any;
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                        console.log('CLS:', clsScore);
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.error('Web Vitals reporting error:', error);
        }
    }
};

/**
 * Initialize all performance optimizations
 */
export const initPerformanceOptimizations = () => {
    // Preconnect to critical domains
    preconnectDomains([
        'https://cdn.shopify.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
    ]);

    // Setup lazy loading for images
    setupLazyLoading();

    // Defer non-critical scripts
    deferNonCriticalScripts();

    // Report web vitals in development
    if (import.meta.env.DEV) {
        reportWebVitals();
    }
};
