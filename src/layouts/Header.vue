<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const openMenuAnimation = () => {
  gsap.fromTo(
    ".menu",
    { y: "-100%", opacity: 0, pointerEvents: "none" },
    { y: "0%", opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.out" }
  );
};

const closeMenuAnimation = () => {
  gsap.to(".menu", {
    y: "-100%",
    opacity: 0,
    pointerEvents: "none",
    duration: 0.5,
    ease: "power2.in",
  });
};

watch(isMenuOpen, (newVal) => {
  if (newVal) {
    openMenuAnimation();
  } else {
    closeMenuAnimation();
  }
});
</script>

<template>
  <header class="top-nav">
    <input id="menu-toggle" type="checkbox" v-model="isMenuOpen" />
    <label class="menu-button-container" for="menu-toggle">
      <div class="menu-button"></div>
    </label>

    <ul class="menu">
      <li><a href="/Home">Accueil</a></li>
      <li><a href="/Goals">Ajouter un objectif</a></li>
      <li><a href="/AllGoals">Tous les objectifs</a></li>
    </ul>
  </header>
</template>

<style scoped>
/* Header Styles */
.top-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: transparent; /* Pas de fond */
}

/* Menu */
.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  background-color: rgba(0, 0, 0, 0.8); /* Fond légèrement transparent */
  padding: 0;
  margin: 0;
  z-index: 999;
  opacity: 0; /* Initialement caché */
  pointer-events: none; /* Désactiver les interactions */
  transition: opacity 0.5s ease, pointer-events 0.5s ease;
}

.menu > li {
  margin: 1rem 0;
}

.menu > li a {
  color: white;
  text-decoration: none;
  font-size: 2rem;
}

.menu > li a:hover {
  color: #f0a500;
}

/* Burger Menu Styles */
.menu-button-container {
  display: flex;
  height: 40px;
  width: 30px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* Bouton au-dessus du menu */
}

#menu-toggle {
  display: none;
}

.menu-button,
.menu-button::before,
.menu-button::after {
  display: block;
  background-color: white; /* Les barres sont blanches */
  position: absolute;
  height: 4px;
  width: 30px;
  transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
  border-radius: 2px;
}

.menu-button::before {
  content: "";
  margin-top: -8px;
}

.menu-button::after {
  content: "";
  margin-top: 8px;
}

#menu-toggle:checked + .menu-button-container .menu-button::before {
  margin-top: 0px;
  transform: rotate(405deg);
}

#menu-toggle:checked + .menu-button-container .menu-button {
  background: rgba(255, 255, 255, 0);
}

#menu-toggle:checked + .menu-button-container .menu-button::after {
  margin-top: 0px;
  transform: rotate(-405deg);
}
</style>
