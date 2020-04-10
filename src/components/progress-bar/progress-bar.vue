<template>
  <div>
    <div class="flexy-column">
      <div class="progress-factor flexy-item">
        <div class="progress-bar">
          <div class="bar has-rotation has-colors cyan ruler-3 move" role="progressbar" :aria-valuenow="valuenow" aria-valuemin="0" aria-valuemax="100">
            <div class="tooltip white"></div>
            <div class="bar-face face-position roof percentage"></div>
            <div class="bar-face face-position back percentage"></div>
            <div class="bar-face face-position floor percentage volume-lights"></div>
            <div class="bar-face face-position left"></div>
            <div class="bar-face face-position right"></div>
            <div class="bar-face face-position front percentage volume-lights shine"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['valuenow']
}
</script>
