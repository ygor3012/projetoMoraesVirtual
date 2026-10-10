import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCv2OnvCDvrg1j32XTPYCtvljCVxp-XtNg",
  authDomain: "telaloginescola.firebaseapp.com",
  projectId: "telaloginescola",
  storageBucket: "telaloginescola.firebasestorage.app",
  messagingSenderId: "217690166227",
  appId: "1:217690166227:web:aca818ba088e6b0a76d526"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.querySelector('form');
const emailInput = document.getElementById('usuario');
const passwordInput = document.getElementById('senha');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;

        window.location.href="admin.html";
    })
    .catch((error) => {
        console.error("Erro de autenticação: ", error.code);
        alert("Falha ao entrar. Verifique se o e-mail e a senha estão corretos.");
    })
})