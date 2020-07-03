function onClickLogIn() {
  //window.open("booking", "_self");
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  checkUser(email, password);
}
async function checkUser(email, password) {
  const url = "/login";
  var data = { email: email, password: password };
  var options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    body: JSON.stringify(data)
  };
  var response = await fetch('login', options);
  var resp;
  response.json().then((value) => {
    resp = value;
  if (resp.isExist == true) {
    sessionStorage.setItem('imie', resp.imie );
    sessionStorage.setItem('nazwisko', resp.nazwisko);
    window.open("booking", "_self");
  }
  else {
    alert("Błędne hasło lub email");
  }
  });
}