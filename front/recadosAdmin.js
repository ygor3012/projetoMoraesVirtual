import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";



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
const auth = getAuth(app);
const storage = getStorage(app);

// elementos do html
const form = document.getElementById('notice-form');
const messageInput = document.getElementById('message');
const charCount = document.getElementById('char-count');

// protecao de rota
onAuthStateChanged(auth, (user) => {
  if (!user){
    window.location.href = "telaLogin.html";
  }
});

//contador de caracteres
messageInput.addEventListener('input', ()=>{
  charCount.textContent = messageInput.value.length;
});

//salvar recado no firebase
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const status = document.getElementById('status').value;
  const message = messageInput.value;
  

  try{
    await addDoc(collection(db, "recados"), {
      titulo: title,
      dataPublicacao: date,
      status: status,
      mensagem: message,
      criadoEm: serverTimestamp()
    });
    form.reset();
    charCount.textContent = "0";
  } catch (error){
    console.error("Erro ao salvar o recado: ", error);
    alert("Erro ao publicar o recado. Verifique a sua conexão ou regras.")
  }
});

// MOSTRAR OS RECADOS NA AREA DE RECADOS PUBLICADOS

// Mapeamento dos elementos de listagem do HTML
const noticeList = document.getElementById('notice-list');
const noticeCount = document.getElementById('notice-count');

// Criar a query para buscar os recados ordenados pelo mais recente
const q = query(collection(db, "recados"), orderBy("criadoEm", "desc"));

// Escutar mudanças no Firestore em tempo real
onSnapshot(q, (snapshot) => {
  noticeList.innerHTML = ''; 
  noticeCount.textContent = `${snapshot.size} recado(s)`;

  if (snapshot.empty) {
    noticeList.innerHTML = '<p style="text-align: center; color: #777;">Nenhum recado cadastrado.</p>';
    return;
  }

    snapshot.forEach((docSnap) => {
    const recado = docSnap.data();
    const id = docSnap.id; // ID único do documento no Firestore
    
    const dataFormatada = recado.dataPublicacao 
      ? recado.dataPublicacao.split('-').reverse().join('/') 
      : 'Sem data';

    const card = document.createElement('div');
    card.className = `notice-card ${recado.status}`; // Adiciona classes dinâmicas (.active ou .inactive)

    // Botão dinâmico: mostra "Inativar" se estiver ativo, ou "Ativar" se estiver inativo
    const botaoStatus = recado.status === 'active' 
      ? '<button class="btn-action btn-inativar">Inativar</button>' 
      : '<button class="btn-action btn-ativar">Ativar</button>';

    card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${recado.titulo}</h3>
      <span class="status-badge">${recado.status === 'active' ? 'Ativo' : 'Rascunho'}</span>
    </div>
    <p class="card-date">📅 Publicação: ${dataFormatada}</p>
    <p class="card-message">${recado.mensagem}</p>
  
    <div class="card-actions">
      ${botaoStatus}
      <button class="btn-action btn-apagar">Apagar</button>
    </div>
    `;

    noticeList.appendChild(card);

    // Evento para Inativar o recado
    const btnInativar = card.querySelector('.btn-inativar');
    if (btnInativar) {
      btnInativar.addEventListener('click', async () => {
        try {
          const recadoRef = doc(db, "recados", id);
          await updateDoc(recadoRef, { status: "inactive" }); // Atualiza no Firestore para inativo [7]
        } catch (error) {
          console.error("Erro ao inativar:", error);
        }
      });
    }

    // Evento para Ativar o recado
    const btnAtivar = card.querySelector('.btn-ativar');
    if (btnAtivar) {
      btnAtivar.addEventListener('click', async () => {
        try {
          const recadoRef = doc(db, "recados", id);
          await updateDoc(recadoRef, { status: "active" }); // Atualiza no Firestore para ativo [7]
        } catch (error) {
          console.error("Erro ao ativar:", error);
        }
      });
    }

    // Evento para Apagar o recado
    const btnApagar = card.querySelector('.btn-apagar');
    btnApagar.addEventListener('click', async () => {
      if (confirm("Tem certeza que deseja apagar este recado permanentemente?")) {
        try {
          const recadoRef = doc(db, "recados", id);
          await deleteDoc(recadoRef); // Remove do Firestore [7]
        } catch (error) {
          console.error("Erro ao apagar:", error);
        }
      }
    });
  });
}, (error) => {
  console.error("Erro ao carregar recados:", error);
});



// Seletor para o campo de busca
const searchInput = document.getElementById('search');

// Evento disparado a cada letra digitada
searchInput.addEventListener('input', (e) => {
  const termoBusca = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.notice-card');
  let recadosVisiveis = 0;

  cards.forEach((card) => {
    // Busca o texto dentro do título e da mensagem do card
    const titulo = card.querySelector('.card-title').textContent.toLowerCase();
    const mensagem = card.querySelector('.card-message').textContent.toLowerCase();

    // Se o termo estiver no título ou na mensagem, exibe o card. Caso contrário, esconde.
    if (titulo.includes(termoBusca) || mensagem.includes(termoBusca)) {
      card.style.display = 'block';
      recadosVisiveis++;
    } else {
      card.style.display = 'none';
    }
  });

  // Atualiza o contador de recados com base no que está visível na busca
  const noticeCount = document.getElementById('notice-count');
  noticeCount.textContent = `${recadosVisiveis} recado(s) encontrado(s)`;
});