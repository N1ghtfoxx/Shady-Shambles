document.getElementById('registerBtn').addEventListener('click', () => {
    const userName = document.getElementById('UN').value;
    const passWord = document.getElementById('PW').value;
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: passWord })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
});