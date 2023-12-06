document.getElementById('status-button').addEventListener('click', function() {
    const text = document.getElementById('status-text').innerText;
    
    fetch('/update-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 
            document.getElementById('status-text').innerText === 'Available' ? "Busy ;)" : "Available" })
    })
    .then(response => response.text())
    .then(data => {
        getStatus();

        if (document.getElementById('status-text').innerText !== 'Available') {
            openRatingPopup();
        }
    });
});

function getStatus() {
    fetch('/status')
        .then(response => response.text())
        .then(data => {
            const statusText = document.getElementById('status-text');
            statusText.innerText = data;
            
            if (data === 'Available') {
                document.body.style.color = '#21b300';
                statusText.style.color = '#21b300';
                document.getElementById('status-button').style.backgroundColor = '#21b300';
            } else {
                document.body.style.color = 'rgb(245, 13, 9)';
                statusText.style.color = 'rgb(245, 13, 9)';
                document.getElementById('status-button').style.backgroundColor = 'rgb(245, 13, 9)';
            }
        });
}

function openRatingPopup() {
    const popup = document.getElementById('rating-popup');
    popup.style.display = 'block';

    const submitButton = document.getElementById('submit-rating');
    submitButton.addEventListener('click', function() {
        const rating = document.querySelector('input[name="rating"]:checked').value;
        sendRating(rating);

        popup.style.display = 'none';
    });
}

function sendRating(rating) {
    fetch('/submit-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating })
    });
}

setInterval(getStatus, 5000);

getStatus();
