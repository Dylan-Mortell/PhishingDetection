chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkPhishing') {
        // Define a list of words to look for
        var searches = ["urgent", "calls", "paid", "gift", "gifts", "cards", "card", 
            "urgently", "response", "needed", "login", "expiring", "soon", "immediate", 
            "immediately", "free", "detetct", "pay", "job", "access", "expire", "friend", 
            "lowest", "price", "serious", "action", "database", "winner", "refund", "files", 
            "activate", "activated", "wage", "vital", "irregular", "docs", "invited", "account", 
            "employment", "notice", "service", "bcourse", "employee", "phone", "information", "dirks"];

        var totalPoints = 0;

        // Search the page content for phishing-related keywords
        for (var search of searches) {
            let re = new RegExp(search, 'gi');
            let matches = document.body.innerText.match(re);  // Changed to innerText for better accuracy
            if (matches != null) {
                totalPoints += matches.length;  // Increase points for each match
            }
        }

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

            // Send back phishing score and prediction to the extension
            sendResponse({ count: totalPoints, prediction: prediction });
        })
        .catch(error => {
            console.error('Error communicating with Flask backend:', error);
            // Send response with error message if fetch fails
            sendResponse({ count: totalPoints, prediction: 'error' });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
