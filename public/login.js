// handles the login process
document.getElementById('loginBtn').addEventListener('click', () => {   
    // get the username and password values from the input fields                             
    const userName = document.getElementById('UN').value;                                
    const passWord = document.getElementById('PW').value; 
    // send a POST request to the server with the username and password as JSON data                          
    fetch('/login', {                                              
        method: 'POST',                                                    
        headers: { 'Content-Type': 'application/json' },                                                    
        body: JSON.stringify({ username: userName, password: passWord })     
    })
    // handle the response from the server, parsing it as JSON and checking if the login was successful                         
    .then(response => {
        return response.json().then(data => {
            return { ok: response.ok, data: data };
        });
    })
    .then(result => {
        if (result.ok) {
            // if the login is successful, redirect the user to the home page
            window.location.href = 'home.html';
        } else {
            // if the login fails, display an alert with the error message from the server
            alert(result.data.message);
        }
    });
});