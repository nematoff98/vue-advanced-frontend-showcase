<script setup>
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import { computed, onMounted, ref } from 'vue';
import { MessageSender } from '@/services/chat';
import { colors } from '@/utils';

const emits = defineEmits(['open-transcript']);
const props = defineProps({
  audioSrc: String,
  message: Object,
  bars: { type: Number, default: 50 },
  fillColor: { type: String, default: colors?.gray?.[400] || '#999' },
  fullWidth: { type: Boolean, default: false },
});

const defaultColor = computed(() => {
  const rgba = props.fillColor.replace(/^#/, '').match(/.{1,2}/g).map((x) => parseInt(x, 16));
  return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0.45)`;
});

const dynamicWidth = computed(() => props.bars * 3.5);

const audioRef = ref(null);
const waveformRef = ref(null);
const isPlaying = ref(false);
const transcriptModalOpen = ref(false);
const normalizedData = ref([]);
const progressIndex = ref(0);
const duration = ref(0);
const formattedTime = ref('0:00');
const formattedDuration = ref('0:00');

const speedOptions = [0.5, 1, 1.5, 2];
const playbackRate = ref(1);
const changePlaybackSpeed = (rate) => {
  playbackRate.value = rate;
  if (audioRef.value) {
    audioRef.value.playbackRate = rate;
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const setDuration = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
    formattedDuration.value = formatTime(duration.value);
  }
};

const updateProgress = () => {
  if (!audioRef.value || !audioRef.value.duration) return;
  formattedTime.value = formatTime(audioRef.value.currentTime);
  progressIndex.value = Math.floor(
    (audioRef.value.currentTime / audioRef.value.duration) * props.bars,
  );
};

const togglePlay = () => {
  if (!audioRef.value) return;
  if (audioRef.value.paused) {
    audioRef.value.play();
    isPlaying.value = true;
  } else {
    audioRef.value.pause();
    isPlaying.value = false;
  }
};

const seekAudio = (event) => {
  if (!audioRef.value || !audioRef.value.duration || !waveformRef.value) return;

  const rect = waveformRef.value.getBoundingClientRect();
  let clickX = event.clientX - rect.left;
  clickX = Math.max(0, Math.min(clickX, rect.width));

  const clickPercentage = clickX / rect.width;
  const newTime = clickPercentage * audioRef.value.duration;
  audioRef.value.currentTime = newTime;

  formattedTime.value = formatTime(newTime);
  progressIndex.value = Math.floor(clickPercentage * props.bars);
  audioRef.value.play();
  isPlaying.value = true;
};

const openTranscriptModal = () => {
  if (!props.message?.id) return;
  emits('open-transcript', props.message.id);
  transcriptModalOpen.value = true;
};

onMounted(() => {
  normalizedData.value = Array.from({ length: props.bars }, () => Math.max(0.2, Math.random()));
});
</script>

<template>
  <div
    v-if="audioSrc"
    :class="{ 'min-minMobile:max-w-[500px] max-w-[300px]': !fullWidth }"
    class="audio-wave-wrapper bg-white p-3 rounded-xl"
  >
    <audio ref="audioRef" :src="audioSrc" hidden @loadedmetadata="setDuration" @timeupdate="updateProgress">
      <track default kind="captions" label="English captions" srclang="en" />
    </audio>

    <div class="audio-controls flex items-center min-minMobile:gap-3 max-minMobile:gap-1 max-minMobile:flex-col max-minMobile:items-start">
      <div class="flex items-center gap-3">
        <a-button
          v-if="message?.sender === MessageSender.CUSTOMER"
          :size="32"
          class="flex items-center justify-center bg-gray-400"
          shape="circle"
          @click="togglePlay"
        >
          <template #icon>
            <Icon v-if="isPlaying" :icon="Icons.PAUSE" class="text-white" size="14" />
            <Icon v-else :icon="Icons.PLAY" class="text-white" size="12" />
          </template>
        </a-button>
        <a-button
          v-if="message?.sender === MessageSender.WORKER || message?.sender === MessageSender.AI || message?.sender === MessageSender.AUTO_MESSAGE"
          :size="32"
          class="flex items-center justify-center bg-primary-500 border-none"
          shape="circle"
          @click="togglePlay"
        >
          <template #icon>
            <Icon v-if="isPlaying" :icon="Icons.PAUSE" class="text-white" size="14" />
            <Icon v-else :icon="Icons.PLAY" class="text-white" size="12" />
          </template>
        </a-button>

        <div class="waveform-container max-[500px]:max-w-[75%]" @click="seekAudio">
          <svg ref="waveformRef" :viewBox="`0 0 ${dynamicWidth} 13`" class="waveform" preserveAspectRatio="none">
            <rect
              v-for="(val, index) in normalizedData"
              :key="index"
              :fill="index <= progressIndex ? fillColor : defaultColor"
              :x="index * 3.5"
              :y="13 - (val * 13)"
              height="13"
              rx="1.5"
              ry="1.5"
              width="1.5"
            />
          </svg>

          <svg ref="waveformRef" :viewBox="`0 0 ${dynamicWidth} 13`" class="waveform flipped w-full overflow-hidden" preserveAspectRatio="none">
            <rect
              v-for="(val, index) in normalizedData"
              :key="index"
              :fill="index <= progressIndex ? fillColor : defaultColor"
              :x="index * 3.5"
              :y="13 - (val * 13)"
              height="13"
              rx="1.5"
              ry="1.5"
              width="1.5"
            />
          </svg>
        </div>
      </div>

      <div
        :class="message?.sender === MessageSender.CUSTOMER ? 'text-gray-400 border-gray-300' : 'text-primary-500 border-primary-300'"
        class="audio-timer text-xxs font-medium whitespace-nowrap min-w-16 max-[500px]:ml-11"
      >
        {{ formattedTime }} / {{ formattedDuration }}
      </div>
    </div>

    <div class="audio-options justify-between flex mt-3">
      <div class="flex">
        <p
          :class="message?.sender === !MessageSender.CUSTOMER ? 'text-primary-500 border-primary-300' : 'text-gray-400 border-gray-300'"
          class="flex items-center pr-2 mr-2 border-r cursor-pointer"
          @click="openTranscriptModal"
        >
          <Icon :icon="Icons.TRANSCRIPTION" class="mr-1" size="16" />
          <span class="max-minMobile:hidden">Transcription</span>
        </p>
        <a
          :class="message?.sender === MessageSender.CUSTOMER ? 'text-gray-400 border-gray-300' : 'text-primary-500 border-primary-300'"
          :href="audioSrc"
          class="text-gray-400 flex items-center gap-2 hover:text-primary"
          download="audio.mp3"
        >
          <Icon :icon="Icons.DOWNLOAD" class="mr-1" size="14" />
          <span class="max-minMobile:hidden">Download</span>
        </a>
      </div>
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="rate in speedOptions" :key="rate" @click="changePlaybackSpeed(rate)">
              {{ rate }}x
            </a-menu-item>
          </a-menu>
        </template>
        <a-button
          :class="message?.sender === MessageSender.CUSTOMER ? 'text-gray-400 border-gray-300' : 'text-primary-500 border-primary-300'"
          class="audio-speed-config flex items-center gap-2"
          size="small"
        >
          {{ playbackRate }}x
          <Icon :icon="Icons.CHEVRON_DOWN" size="10" />
        </a-button>
      </a-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.waveform {
  height: 13px;
}

.waveform.flipped {
  transform: scaleY(-1);
}

.audio-speed-config {
  background: var(--color-gray-50);
  border-radius: 50px;
  height: 20px;
  border: none
}
</style>
