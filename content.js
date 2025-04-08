chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkPhishing') {
        // Get the current page URL
        var currentUrl = window.location.href;

        // Send the URL to Flask backend for phishing prediction
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: currentUrl })
        })
        .then(response => response.json())
        .then(data => {
            var prediction = data.prediction;

            // Update the page based on the prediction
            if (prediction === 'phishing') {
                console.log('Warning: This site might be phishing!');
                document.body.style.backgroundColor = 'red';  // Mark phishing site visually
                alert("Warning: This site may be a phishing attempt!");
            } else {
                console.log('This site is safe.');
                document.body.style.backgroundColor = 'green';  // Mark safe site visually
            }

            // Send back prediction result to the extension
            sendResponse({ prediction: prediction });
        })
        .catch(error => {
            console.error('Error communicating with Flask backend:', error);
            // Send response with error message if fetch fails
            sendResponse({ prediction: 'error' });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
