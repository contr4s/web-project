(function() {
    var startTime = new Date().getTime();

    window.addEventListener('load', function() {
        var endTime = new Date().getTime();
        var loadTime = endTime - startTime;
        const loadStatsElement = document.getElementById('load-stats');
        loadStatsElement.innerHTML = `Время загрузки страницы: ${loadTime} мс`;
    });
})();
