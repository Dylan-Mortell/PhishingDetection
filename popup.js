//  check if a string is a valid URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

//  try to normalize the input into a proper URL string
function normalizeUrl(input) {
  try {
    return new URL(input).href;
  } catch (_) {
    try {
      return new URL('http://' + input).href;
    } catch (_) {
      return null;
    }
  }
}

// check if the URL's hostname has a valid domain suffix (TLD)
function hasValidDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    // Basic check: hostname must have a dot followed by 2+ letter TLD, e.g., ".com", ".org"
    return /\.[a-z]{2,}$/i.test(hostname);
  } catch (_) {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const checkButton = document.getElementById('phishingDetection');
  const resultElement = document.getElementById('result');

  checkButton.addEventListener('click', function () {
    const urlInput = document.getElementById('urlInput').value.trim();
    const model = document.getElementById('modelSelect').value;

    if (urlInput) {
      const normalizedUrl = normalizeUrl(urlInput);

      if (!normalizedUrl || !isValidUrl(normalizedUrl) || !hasValidDomain(normalizedUrl)) {
        resultElement.textContent = 'Please enter a valid URL.';
        resultElement.className = 'phishing'; // Show warning style
        return;
      }

      sendPredictionRequest(normalizedUrl, model);
    } else {
      // No URL typed, get active tab's URL
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) {
          resultElement.textContent = 'Could not get the current tab URL.';
          resultElement.className = '';
          return;
        }
        const url = tabs[0].url;
        sendPredictionRequest(url, model);
      });
    }
  });

function sendPredictionRequest(url, model) {
  const data = { url: url, model: model };

  fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      if (
        result.prediction === 'phishing' ||
        result.prediction === 'phishing_url' ||
        result.prediction === 'phishing_url_alt'
      ) {
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

  // ChatGPT-style prompt logic
  const chatButton = document.getElementById('chatSend');
  const chatPrompt = document.getElementById('chatPrompt');
  const chatResponse = document.getElementById('chatResponse');

  chatButton.addEventListener('click', function () {
    const prompt = chatPrompt.value.trim();

    if (!prompt) {
      chatResponse.textContent = 'Please enter a question.';
      return;
    }

    chatResponse.textContent = 'Thinking...';

    fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          chatResponse.textContent = data.response;
        } else {
          chatResponse.textContent = 'No response received.';
        }
      })
      .catch(error => {
        console.error('Chat error:', error);
        chatResponse.textContent = 'Error contacting the AI.';
      });
  });
});
