<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";

const isMenuOpen = ref(false);

const openMenuAnimation = () => {
  gsap.fromTo(
    ".menu",
    { y: "-100%", opacity: 0, pointerEvents: "none" },
    {
      y: "0%",
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.5,
      ease: "power2.out",
    }
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

const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous êtes déjà déconnecté.");
      return;
    }

    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem("token"); 
      window.location.href = "/"; 
    } else {
      alert("Erreur lors de la déconnexion.");
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
    alert("Erreur réseau. Veuillez réessayer.");
  }
};

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
      <li><a href="/" @click.prevent="logout">Déconnexion</a></li>
    </ul>
  </header>
</template>

<style scoped>
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
  background-color: transparent;
}

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
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0;
  margin: 0;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
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

.menu-button-container {
  display: flex;
  height: 40px;
  width: 30px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

#menu-toggle {
  display: none;
}

.menu-button,
.menu-button::before,
.menu-button::after {
  display: block;
  background-color: white;
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
