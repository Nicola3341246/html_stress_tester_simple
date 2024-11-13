document.addEventListener('DOMContentLoaded', () => {
    // Object to define routes and their associated files
    const routeConfig = {
      'home': {
        html: '/pages/elementStressTest/elementStressTest.html',
        js: '/pages/elementStressTest/elementStressTest.js',
        css: '/pages/elementStressTest/elementStressTest.css'
      },
      'snake': {
        html: '/pages/snake/snake.html',
        js: '/pages/snake/snake.js',
        css: '/pages/snake/snake.css'  // Add the CSS reference here
      }
    };
  
    // Function to load the HTML content of the page
    function loadPage(page) {
      const contentDiv = document.getElementById('content');
      const route = routeConfig[page];
  
      if (!route) {
        contentDiv.innerHTML = '<p>Page not found.</p>';
        return;
      }
  
      // Load HTML content
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
  
          // Dynamically load associated JavaScript (if any)
          if (route.js) {
            loadScript(route.js);
          }
  
          // Dynamically load associated CSS (if any)
          if (route.css) {
            loadCss(route.css);
          }
  
          // Update the browser URL without reloading the page
          history.pushState({ page: page }, page, `#${page}`);
        })
        .catch(error => {
          contentDiv.innerHTML = `<p>Error loading page: ${error}</p>`;
        });
    }
  
    // Function to dynamically load the JavaScript file for a specific page
    function loadScript(scriptUrl) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.type = 'text/javascript';
      script.onload = () => {
        console.log(`${scriptUrl} loaded successfully`);
      };
      script.onerror = () => {
        console.error(`Error loading ${scriptUrl}`);
      };
      document.body.appendChild(script);
    }
  
    // Function to dynamically load the CSS file for a specific page
    function loadCss(cssUrl) {
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
  
    // Handle navigation link clicks
    const links = document.querySelectorAll('a[data-route]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-route');
        loadPage(page);
      });
    });
  
    // Load the initial page based on the URL hash or default to 'home'
    const initialPage = window.location.hash.slice(1) || 'home';
    loadPage(initialPage);
  
    // Listen for back/forward browser navigation
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        loadPage(e.state.page);
      }
    });
  });
  