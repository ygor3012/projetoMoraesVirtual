      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
      import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

      const userEmailEl = document.getElementById('userEmail');
      const btnSair = document.getElementById('btnSair');

      // Proteção de rota
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userEmailEl.textContent = `Logado como: ${user.email}`;
        } else {
          window.location.href = 'telaLogin.html';
        }
      });

      // Botão de Logout
      btnSair.addEventListener('click', async () => {
        try {
          await signOut(auth);
          window.location.href = 'telaLogin.html';
        } catch (error) {
          console.error("Erro ao sair:", error);
        }
      });