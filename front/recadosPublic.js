import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Credenciais do seu console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCv2OnvCDvrg1j32XTPYCtvljCVxp-XtNg",
  authDomain: "telaloginescola.firebaseapp.com",
  projectId: "telaloginescola",
  storageBucket: "telaloginescola.firebasestorage.app",
  messagingSenderId: "217690166227",
  appId: "1:217690166227:web:aca818ba088e6b0a76d526"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const publicNoticeList = document.getElementById('public-notice-list');

// Query: filtra apenas comunicados ATIVOS do mais recente para o mais antigo [8]
const q = query(
  collection(db, "recados"),
  where("status", "==", "active"),
  orderBy("criadoEm", "desc")
);

// Escuta em tempo real [8]
onSnapshot(q, (snapshot) => {
  publicNoticeList.innerHTML = ''; // Limpa a lista atual

  if (snapshot.empty) {
    publicNoticeList.innerHTML = '<p class="empty" style="text-align: center; width: 100%; color: #64748b; padding: 20px 0;">Não há comunicados importantes no momento.</p>';
    return;
  }

  snapshot.forEach((docSnap) => {
    const recado = docSnap.data();
    
    // Converte a data (AAAA-MM-DD para DD/MM/AAAA)
    const dataFormatada = recado.dataPublicacao 
      ? recado.dataPublicacao.split('-').reverse().join('/') 
      : 'Sem data';

    // Cria o card idêntico e alinhado ao CSS que criamos
    const card = document.createElement('div');
    card.className = 'notice-card active'; // Atribui a borda verde institucional

    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${recado.titulo}</h3>
        <span class="status-badge">Comunicado</span>
      </div>
      <p class="card-date">Publicado em: ${dataFormatada}</p>
      <p class="card-message">${recado.mensagem}</p>
    `;

    publicNoticeList.appendChild(card);
  });
}, (error) => {
  console.error("Erro ao escutar recados públicos:", error);
});