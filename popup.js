document.addEventListener('DOMContentLoaded', function () {
    var checkButton = document.getElementById('phishingDetection');
    var resultElement = document.getElementById('result');
    var urlInput = document.getElementById('urlInput'); // Get the search bar element

    checkButton.addEventListener('click', function () {
        // Get URL from the search bar or the current active tab
        var url = urlInput.value.trim(); // Get value from search bar

        if (!url) {
            // If the search bar is empty, use the current active tab's URL
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                url = tabs[0].url; // Get the active tab's URL
                checkPhishing(url);  // Check phishing for the active tab's URL
            });
        } else {
            // If the search bar has a URL, check phishing for that URL
            checkPhishing(url);
        }
    });

    // Function to check phishing by sending the URL to the backend
    function checkPhishing(url) {
        var data = { url: url };

        // Sending the URL to the server for phishing check
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
    }
});
