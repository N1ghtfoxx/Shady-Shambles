// processes the registration of a new user
document.getElementById('registerBtn').addEventListener('click', () => {
    // get the username and password from the input fields
    const userName = document.getElementById('UN').value;
    const passWord = document.getElementById('PW').value;
    // POST-request to server: create new account with the provided username and password
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: passWord })
    })
    // process the response from the server, 
    // converting it to JSON and checking if the registration was successful
    .then(response => {
        return response.json().then(data => {
            return { ok: response.ok, data: data };
        });
    })
    .then(result => {
        if (result.ok) {
            // if registration is successful, clear the input fields and redirect to login page
            document.getElementById('UN').value = '';
            document.getElementById('PW').value = '';
            window.location.href = 'login.html';
        } else {
            // if registration fails, show an alert with the error message
            alert(result.data.message);
        }
    });
});