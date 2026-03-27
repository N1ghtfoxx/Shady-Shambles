document.getElementById('loginBtn').addEventListener('click', () => {                                
     const userName = document.getElementById('UN').value;                                
     const passWord = document.getElementById('PW').value;                           
     fetch('/login', {                                              
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
            window.location.href = 'home.html';
        } else {
            alert(result.data.message);
        }
    });
});