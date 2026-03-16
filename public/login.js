document.getElementById('loginBtn').addEventListener('click', () => {                                
     const userName = document.getElementById('UN').value;                                
     const passWord = document.getElementById('PW').value;                           
     fetch('/login', {                                              
        method: 'POST',                                                    
        headers: { 'Content-Type': 'application/json' },                                                    
        body: JSON.stringify({ username: userName, password: passWord })     
    })                         
    .then(response => {
        if (response.ok) {
            window.location.href = 'home.html'; // Redirect to home.html after successful login
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
    });
});