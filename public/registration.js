document.getElementById('registerBtn').addEventListener('click', () => {
    const userName = document.getElementById('UN').value;
    const passWord = document.getElementById('PW').value;
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: passWord })
    })
    .then(response => {
        return response.json().then(data => {
            return { ok: response.ok, data: data };
        });
    })
    .then(result => {
        if (result.ok) {
            document.getElementById('UN').value = '';
            document.getElementById('PW').value = '';
            window.location.href = 'login.html';
        } else {
            alert(result.data.message);
        }
    });
});