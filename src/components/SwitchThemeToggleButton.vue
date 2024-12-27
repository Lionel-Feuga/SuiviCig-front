<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify"; 

const theme = useTheme(); 

const toggleTheme = () => {
  theme.global.name.value = theme.global.name.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <div class="theme-toggle">
    <div class="toggle-container">
      <label class="toggle-switch">
        <input type="checkbox" @change="toggleTheme" />
        <span class="slider"></span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
