<script setup>
import {nextTick, reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import Modal from '@/components/ui/Modal.vue'
import api from '@/api/together/index.js'

const router = useRouter()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])
const roomBody = reactive({
  title: "",
  videoUrl: "",
  maxMemberNumber: "",
  isOpen: ""
})
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const errorMessage = ref('')
const errorTitle = 'Together 생성 에러'
const createdTogetherIdx = ref(null)

const closeErrorModal = () => {
  showErrorModal.value = false
}

const closeModal = () => {
  emit('close')
}

// 배경 클릭시 모달 닫기
const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const saveTogetherRoom = async () => {
  let res = await api.saveTogether(roomBody);
  if(res.code === 200) {
    return res.data.togetherIdx;
  }
  await nextTick()
  errorMessage.value = res.message
  showErrorModal.value = true
  return null;
}

// 방 만들기 버튼 클릭 시 데이터 전송
const sendApi = async () => {
  let idx = await saveTogetherRoom()
  if(!showErrorModal.value) {
    createdTogetherIdx.value = idx
    showSuccessModal.value = true
  }
}

const handleCreateSuccess = () => {
  showSuccessModal.value = false
  closeModal()
  router.push({ name: 'togetherRoom', params: {id: createdTogetherIdx.value}})
}
</script>

<template>
  <div 
    v-if="visible" 
    class="modal-backdrop" 
    @click="handleBackdropClick"
  ></div>
  
  <div class="create-room-modal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-plus"></i> Together 방 생성</h3>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <Modal v-if="showErrorModal" @confirm="closeErrorModal" :title="errorTitle" :message="errorMessage"  />
      <Modal
        v-if="showSuccessModal"
        @confirm="handleCreateSuccess"
        title="Together 방 생성"
        message="방을 생성했습니다."
      />
      <form class="create-room-form" @submit.prevent="sendApi">
        <!-- 방 이름 입력 -->
        <div class="form-group">
          <label for="roomName">방 이름 *</label>
          <input
            id="roomName"
            type="text"
            required
            maxlength="50"
            placeholder="방 이름을 입력하세요"
            v-model="roomBody.title"
          />
          <div class="char-count"><span>0</span>/50</div>
        </div>

        <!-- 동영상 URL 입력 -->
        <div class="form-group">
          <label for="videoUrl">동영상 URL</label>
          <input
            id="videoUrl"
            type="url"
            placeholder="함께 볼 동영상 URL을 입력하세요 (선택사항)"
            v-model="roomBody.videoUrl"
          />
          <div class="help-text">나중에 방에서 동영상을 선택할 수도 있습니다</div>
        </div>

        <!-- 최대 참가자 수 -->
        <div class="form-group">
          <label for="maxUser">최대 참가자 수 *</label>
          <input
            id="maxUser"
            type="text"
            placeholder="Together 최대 인원 수를 입력하세요"
            v-model="roomBody.maxMemberNumber"
          />
        </div>

        <!-- 공개 설정 -->
        <div class="form-group">
          <label>방 공개 설정</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="roomPrivacy" value="true" v-model="roomBody.isOpen" />
              <span class="radio-mark"></span>
              <div class="radio-content">
                <strong>공개 방</strong>
                <span>모든 사용자가 참가할 수 있습니다</span>
              </div>
            </label>
            <label class="radio-item">
              <input type="radio" name="roomPrivacy" value="false" v-model="roomBody.isOpen" />
              <span class="radio-mark"></span>
              <div class="radio-content">
                <strong>비공개 방</strong>
                <span>초대한 친구들만 참가할 수 있습니다</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 모달 푸터(버튼) -->
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeModal">취소</button>
          <button type="submit" class="btn-create">
            <i class="fas fa-plus"></i>
            방 만들기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Create Room Modal */
.createRoomBtn {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.create-room-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  padding: 1rem;
  box-sizing: border-box;
  z-index: 2000;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  border: 2px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-header h3 i {
  color: var(--primary-color);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
}

.modal-close:hover {
  background-color: var(--hover-color);
  color: var(--text-primary);
}

.create-room-form {
  padding: 2rem;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group > label {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.form-group input:not([type='radio']),
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary-color);
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.help-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  line-height: 1.4;
}

.radio-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.radio-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  cursor: pointer;
  min-height: 112px;
  padding: 1rem 1rem 1rem 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
    var(--dark-bg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.radio-group .radio-item {
  margin-bottom: 0;
}

.radio-item:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 71, 87, 0.45);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
}

.radio-item input[type='radio'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: 0;
  appearance: none;
}

.radio-mark {
  width: 22px;
  height: 22px;
  margin-top: 0.1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.radio-item input[type='radio']:checked + .radio-mark {
  border-color: var(--primary-color);
  background: radial-gradient(circle at center, #ffffff 0 24%, var(--primary-color) 28% 100%);
  transform: scale(1.04);
}

.radio-item input[type='radio']:checked + .radio-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
}

.radio-item:has(input[type='radio']:checked) {
  border-color: rgba(255, 71, 87, 0.7);
  background:
    linear-gradient(180deg, rgba(255, 71, 87, 0.12), rgba(255, 71, 87, 0.05)),
    var(--dark-bg);
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.22),
    inset 0 0 0 1px rgba(255, 71, 87, 0.18);
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.radio-content strong {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1rem;
}

.radio-content span {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.45;
}

@media (max-width: 640px) {
  .radio-group {
    grid-template-columns: 1fr;
  }
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: var(--transition);
}

.setting-item:hover {
  background-color: var(--hover-color);
}

.setting-item input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  transition: var(--transition);
}

.setting-item input[type='checkbox']:checked + .checkmark {
  border-color: var(--secondary-color);
  background-color: var(--secondary-color);
}

.setting-item input[type='checkbox']:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-create {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel {
  background-color: var(--hover-color);
  color: var(--text-primary);
}

.btn-cancel:hover {
  background-color: var(--border-color);
}

.btn-create {
  background: linear-gradient(135deg, var(--primary-color), #ff6b7a);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 71, 87, 0.3);
}

@media (max-width: 768px) {
  .create-room-modal {
    padding: 0.5rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header,
  .create-room-form,
  .modal-footer {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-create {
    width: 100%;
    justify-content: center;
  }
}
</style>
