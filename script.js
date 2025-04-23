// Dados simulados (em uma aplicação real, isso viria de um backend)
let users = [];
let pets = [];
let appointments = [];
let currentUser = null;

// Elementos do DOM
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authForms = document.getElementById('auth-forms');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const petModal = document.getElementById('petModal');
const closeModal = document.querySelector('.close');
const addPetBtn = document.getElementById('addPetBtn');
const petForm = document.getElementById('petForm');
const petsGrid = document.getElementById('petsGrid');
const petSelect = document.getElementById('petSelect');
const scheduleForm = document.getElementById('scheduleForm');
const appointmentsList = document.getElementById('appointmentsList');

// Event Listeners
loginBtn.addEventListener('click', () => showAuthForm('login'));
registerBtn.addEventListener('click', () => showAuthForm('register'));
logoutBtn.addEventListener('click', logout);
closeModal.addEventListener('click', () => petModal.style.display = 'none');
addPetBtn.addEventListener('click', () => petModal.style.display = 'block');
window.addEventListener('click', (e) => {
  if (e.target === petModal) petModal.style.display = 'none';
});

// Alternar entre formulários de login e registro
document.querySelectorAll('.switch-form').forEach(button => {
  button.addEventListener('click', () => {
    if (loginForm.style.display === 'none') {
      showAuthForm('login');
    } else {
      showAuthForm('register');
    }
  });
});

// Formulário de Login
loginForm.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    updateUI();
    showMessage('Login realizado com sucesso!', 'success');
  } else {
    showMessage('E-mail ou senha incorretos', 'error');
  }
});

// Formulário de Registro
registerForm.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  if (password !== confirmPassword) {
    showMessage('As senhas não coincidem', 'error');
    return;
  }
  
  if (users.some(u => u.email === email)) {
    showMessage('E-mail já cadastrado', 'error');
    return;
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    phone,
    password
  };
  
  users.push(newUser);
  currentUser = newUser;
  updateUI();
  showMessage('Conta criada com sucesso!', 'success');
});

// Formulário de Adicionar Pet
petForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('petName').value;
  const species = document.getElementById('petSpecies').value;
  const breed = document.getElementById('petBreed').value;
  const age = document.getElementById('petAge').value;
  const imageFile = document.getElementById('petImage').files[0];
  
  let imageUrl = '';
  if (imageFile) {
    imageUrl = URL.createObjectURL(imageFile);
  }
  
  const newPet = {
    id: Date.now(),
    ownerId: currentUser.id,
    name,
    species,
    breed,
    age,
    imageUrl
  };
  
  pets.push(newPet);
  updatePetsList();
  petModal.style.display = 'none';
  petForm.reset();
  showMessage('Pet adicionado com sucesso!', 'success');
});

// Formulário de Agendamento
scheduleForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const petId = parseInt(document.getElementById('petSelect').value);
  const serviceType = document.getElementById('serviceType').value;
  const date = document.getElementById('scheduleDate').value;
  const notes = document.getElementById('notes').value;
  
  const pet = pets.find(p => p.id === petId);
  
  if (!pet) {
    showMessage('Selecione um pet válido', 'error');
    return;
  }
  
  const newAppointment = {
    id: Date.now(),
    userId: currentUser.id,
    petId,
    petName: pet.name,
    serviceType,
    date,
    notes,
    status: 'Agendado'
  };
  
  appointments.push(newAppointment);
  updateAppointmentsList();
  scheduleForm.reset();
  showMessage('Agendamento realizado com sucesso!', 'success');
});

// Funções auxiliares
function showAuthForm(formType) {
  authForms.style.display = 'block';
  dashboard.style.display = 'none';
  
  if (formType === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

function updateUI() {
  if (currentUser) {
    authForms.style.display = 'none';
    dashboard.style.display = 'block';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    updatePetsList();
    updateAppointmentsList();
  } else {
    authForms.style.display = 'none';
    dashboard.style.display = 'none';
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
}

function updatePetsList() {
  if (!currentUser) return;
  
  const userPets = pets.filter(pet => pet.ownerId === currentUser.id);
  
  petsGrid.innerHTML = '';
  petSelect.innerHTML = '<option value="">-- Selecione --</option>';
  
  userPets.forEach(pet => {
    // Adicionar ao grid de pets
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    petCard.innerHTML = `
      ${pet.imageUrl ? `<img src="${pet.imageUrl}" alt="${pet.name}">` : ''}
      <h3>${pet.name}</h3>
      <p>Espécie: ${pet.species}</p>
      ${pet.breed ? `<p>Raça: ${pet.breed}</p>` : ''}
      ${pet.age ? `<p>Idade: ${pet.age} anos</p>` : ''}
    `;
    petsGrid.appendChild(petCard);
    
    // Adicionar ao select de agendamento
    const option = document.createElement('option');
    option.value = pet.id;
    option.textContent = pet.name;
    petSelect.appendChild(option);
  });
}

function updateAppointmentsList() {
  if (!currentUser) return;
  
  const userAppointments = appointments.filter(app => app.userId === currentUser.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  appointmentsList.innerHTML = '';
  
  if (userAppointments.length === 0) {
    appointmentsList.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
    return;
  }
  
  userAppointments.forEach(app => {
    const pet = pets.find(p => p.id === app.petId);
    const appCard = document.createElement('div');
    appCard.className = 'appointment-card';
    appCard.innerHTML = `
      <h3>${app.serviceType} para ${app.petName}</h3>
      <p>Data: ${formatDateTime(app.date)}</p>
      <p>Status: ${app.status}</p>
      ${app.notes ? `<p>Observações: ${app.notes}</p>` : ''}
    `;
    appointmentsList.appendChild(appCard);
  });
}

function logout() {
  currentUser = null;
  updateUI();
}

function showMessage(message, type) {
  const messageElement = document.createElement('div');
  messageElement.className = type;
  messageElement.textContent = message;
  
  const container = document.querySelector('.container');
  container.insertBefore(messageElement, container.firstChild);
  
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}

function formatDateTime(dateTimeString) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateTimeString).toLocaleDateString('pt-BR', options);
}

// Inicialização
updateUI();
