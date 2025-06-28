document.addEventListener('DOMContentLoaded', function () {
    var checkButton = document.getElementById('phishingDetection');  
    var resultElement = document.getElementById('result');

    checkButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var url = tabs[0].url;
        var model = document.getElementById('modelSelect').value;  
        var data = { url: url, model: model };

        fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.prediction === 'phishing') {
                resultElement.textContent = 'Warning: This site could be dangerous!';
                resultElement.className = 'phishing';
            } else {
                resultElement.textContent = 'This site seems safe.';
                resultElement.className = 'safe';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultElement.textContent = 'Error checking the site.';
            resultElement.className = '';
        });
    });
});
});
