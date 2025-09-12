<template>
  <section class="video-section container-lg">
    <!-- Title -->
    <div class="header">
      <h2 class="title">Videocursus met examenvragen</h2>
      <p class="subtitle">
        Bekijk de demo's en zie wat je kunt verwachten van de auto, bromfiets en motor videocursus.
      </p>
    </div>

    <!-- Videos -->
    <div class="videos">
      <q-card
        v-for="video in videos"
        :key="video.id"
        class="video-card"
        flat
        bordered
      >
        <div class="video-wrapper">
          <video :src="video.src" controls poster="video.thumbnail"></video>
          <div class="play-overlay" @click="play(video.id)">
            <q-icon name="play_circle" size="64px" color="white" />
          </div>
        </div>
      </q-card>
    </div>

    <!-- CTA -->
    <div class="cta-wrap">
      <q-btn
        no-caps
        unelevated
        color="primary"
        class="cta"
        label="Hoe werkt het?"
      />
    </div>


  </section>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "VideoSection",
  setup() {
    const videos = ref([
      { id: 1, src: "/videos/car.mp4", thumbnail: "/images/car.jpg" },
      { id: 2, src: "/videos/motor.mp4", thumbnail: "/images/motor.jpg" },
      { id: 3, src: "/videos/scooter.mp4", thumbnail: "/images/scooter.jpg" },
    ]);

    function play(id) {
      const videoEl = document.querySelector(`video[data-id="${id}"]`);
      if (videoEl) {
        videoEl.play();
      }
    }

    return { videos, play };
  },
});
</script>

<style scoped>
.video-section {
  padding: 50px 20px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
}

.header {
  max-width: 720px;
  margin: 0 auto 32px;
}
.title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 18px;
  color: #555;
}

.videos {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.video-card {
  width: 320px;
  border-radius: 16px;
  overflow: hidden;
}
.video-wrapper {
  position: relative;
}
video {
  width: 100%;
  border-radius: 16px;
}
.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0.9;
}

.cta-wrap {
  margin: 24px 0;
}
.cta {
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(90deg, #2261ff 0%, #2e7bff 100%);
  font-weight: 700;
  font-size: 16px;
}

</style>
