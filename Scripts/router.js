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
      html: '/pages/snake/snake.html',
      js: ['/pages/snake/snake.js'],
      css: '/pages/snake/snake.css',
      init: 'snakeInitialize'
    },
    'question': {
      html: '/pages/question/question.html',
      js: ['/pages/question/question.js'],
      css: '/pages/question/question.css',
      init: 'questionInitialize'
    },
    'minesweeper': {
        html: '/pages/minesweeper/minesweeper.html',
        js: ['/pages/minesweeper/minesweeper.js'],
        css: '/pages/minesweeper/minesweeper.css',
        init: 'initGame'
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

        if (route.js.length > 0) {
            route.js.forEach(js => {
            loadScript(js, route.init);
            });
        }

        if (route.css) {
            loadCss(route.css);
        }

        history.pushState({ page: page }, page, `#${page}`);
        })
        .catch(error => {
        contentDiv.innerHTML = `<p>Error loading page: ${error}</p>`;
        });
    }

    function loadScript(scriptUrl, initFunction) {
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
        console.log(`${scriptUrl} is already loaded.`);
        if (initFunction && typeof window[initFunction] === 'function') {
        console.log(`Calling ${initFunction}() after script is already loaded.`);
        window[initFunction]();
        }
        return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';

    script.onload = () => {
        console.log(`${scriptUrl} loaded successfully`);
        if (initFunction && typeof window[initFunction] === 'function') {
        console.log(`Calling ${initFunction}() after script is loaded.`);
        window[initFunction]();
        }
    };

    script.onerror = () => {
        console.error(`Error loading ${scriptUrl}`);
    };

    document.body.appendChild(script);
    }

    function loadCss(cssUrl) {
    const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
    if (existingLink) {
        console.log(`${cssUrl} is already loaded.`);
        return;
    }

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

    const links = document.querySelectorAll('a[data-route]');
    links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-route');
        loadPage(page);
    });
    });

    const initialPage = window.location.hash.slice(1) || 'home';
    loadPage(initialPage);

    window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        loadPage(e.state.page);
    }
    });
};
