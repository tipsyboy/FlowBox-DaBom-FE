const modal = document.getElementById('proposalModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const confirmModalBtn = document.getElementById('confirmModalBtn');
const toast = document.getElementById('toast');

function openModal() {
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 1400);
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

confirmModalBtn.addEventListener('click', () => {
  closeModal();
  showToast('공통 모달 동작 확인 완료');
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
