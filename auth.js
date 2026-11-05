const firebaseConfig = {
  apiKey: "AIzaSyA15le2nYFkosPTW7Ebx2lPo7sQgEf7kt8", 
      authDomain: "fc-online-simulator.firebaseapp.com",
      databaseURL: "https://fc-online-simulator-default-rtdb.firebaseio.com",
      projectId: "fc-online-simulator",
      storageBucket: "fc-online-simulator.firebasestorage.app",
      messagingSenderId: "220897790682",
      appId: "1:220897790682:web:3f92984ae37d58603cf3e3"
    };


firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123";
const INITIAL_BP = 100000000000;

let currentUser = null;
let userData = { bp: INITIAL_BP, inventory: [] };

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  if (username.toLowerCase() === ADMIN_USERNAME && password !== ADMIN_PASSWORD) {
    alert("Sai mật khẩu Admin!");
    return;
  }
  authLogin(username, password);
});

function authLogin(username, password) {
  currentUser = username;
  document.getElementById('displayUsername').innerText = username;
  document.getElementById('loginModal').style.display = 'none';

  db.ref('users/' + username).once('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      if (username.toLowerCase() !== ADMIN_USERNAME && data.password && data.password !== password) {
        alert("Sai mật khẩu!");
        location.reload();
        return;
      }
      userData = data;
      if (!userData.inventory) userData.inventory = [];
      if (userData.bp === undefined) {
        userData.bp = INITIAL_BP;
        authSaveData();
      }
    } else {
      userData = { password: password, bp: INITIAL_BP, inventory: [] };
      authSaveData();
    }
    if (typeof updateUI === 'function') updateUI();
  });
}

function authLogout() {
  location.reload();
}

function authSaveData() {
  if (currentUser) {
    db.ref('users/' + currentUser).set(userData);
  }
}
