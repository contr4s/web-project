(function() {
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        const loadStatsElement = document.getElementById('load-stats');
        loadStatsElement.innerHTML = `Время загрузки страницы: ${loadTime} мс`;
    });
})();
