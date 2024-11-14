window.addEventListener('popstate', RunPageChange)
document.addEventListener('DOMContentLoaded', RunPageChange);

const routeConfig = {
    'home':{
        html: './pages/home/home.html',
        js:[],
        css: './pages/home/home.css'
    },
    'elementStressTest': {
        html: './pages/elementStressTest/elementStressTest.html',
        js: ['./pages/elementStressTest/elementStressTest.js'],
        css: './pages/elementStressTest/elementStressTest.css',
        init: 'elementStressTestInitialize'
    },
    'snake': {
        html: './pages/snake/snake.html',
        js: ['./pages/snake/snake.js'],
        css: './pages/snake/snake.css',
        init: 'snakeInitialize' 
    }
};

function RunPageChange() {
    function loadPage(page) {
    const contentDiv = document.getElementById('content');
    const route = routeConfig[page];

    if (!route) {
        contentDiv.innerHTML = '<p>Page not found.</p>';
        return;
    }

    fetch(route.html)
        .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            return Promise.reject('Page not found');
        }
        })
        .then(data => {
        contentDiv.innerHTML = data;

        // Load the JS files for this page
        if (route.js.length > 0) {
            route.js.forEach(js => {
            // Load the script and pass the initialization function
            loadScript(js, route.init);
            });
        }

        // Load CSS for this page
        if (route.css) {
            loadCss(route.css);
        }

        // Update the browser's history state
        history.pushState({ page: page }, page, `#${page}`);
        })
        .catch(error => {
        contentDiv.innerHTML = `<p>Error loading page: ${error}</p>`;
        });
    }

    function loadScript(scriptUrl, initFunction) {
    // Check if the script is already loaded
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
        console.log(`${scriptUrl} is already loaded.`);
        // If already loaded, immediately call the initialization function
        if (initFunction && typeof window[initFunction] === 'function') {
        console.log(`Calling ${initFunction}() after script is already loaded.`);
        window[initFunction](); // Dynamically call the page-specific Initialize function
        }
        return;
    }

    // Create a new script element if it's not already loaded
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';

    script.onload = () => {
        console.log(`${scriptUrl} loaded successfully`);
        // Once the script is loaded, call the corresponding initialization function
        if (initFunction && typeof window[initFunction] === 'function') {
        console.log(`Calling ${initFunction}() after script is loaded.`);
        window[initFunction]();  // Dynamically call the Initialize function
        }
    };

    script.onerror = () => {
        console.error(`Error loading ${scriptUrl}`);
    };

    document.body.appendChild(script);
    }

    function loadCss(cssUrl) {
    // Check if the CSS file is already loaded
    const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
    if (existingLink) {
        console.log(`${cssUrl} is already loaded.`);
        return;
    }

    // Create a new link element to load the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;

    link.onload = () => {
        console.log(`${cssUrl} loaded successfully`);
    };

    link.onerror = () => {
        console.error(`Error loading ${cssUrl}`);
    };

    document.head.appendChild(link);
    }

    // Add event listeners to all links with the data-route attribute
    const links = document.querySelectorAll('a[data-route]');
    links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-route');
        loadPage(page);
    });
    });

    // Load the initial page based on the URL's hash or default to 'home'
    const initialPage = window.location.hash.slice(1) || 'home';
    loadPage(initialPage);

    // Handle browser history navigation (back/forward buttons)
    window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        loadPage(e.state.page);
    }
    });
};
