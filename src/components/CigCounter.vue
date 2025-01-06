<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const count = ref(0);
const unsavedChanges = ref(false); 
const token = localStorage.getItem("token");
let saveTimeout = null;

const initializeCounter = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/daily-records?date=${today}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const record = await response.json();
      count.value = record?.cigarettesSmoked || 0;
      console.log("Compteur initial chargé :", count.value);
    } else if (response.status === 404) {
      count.value = 0;
      console.log("Aucune donnée trouvée pour aujourd'hui, compteur initialisé à zéro.");
    } else {
      throw new Error("Erreur lors de la récupération du compteur.");
    }
  } catch (error) {
    console.error("Erreur :", error.message);
  }
};

const saveCounterToBackend = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/daily-records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: today,
          cigarettesSmoked: count.value,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement.");
    }
    unsavedChanges.value = false; 
    console.log("Compteur sauvegardé :", count.value);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données :", error.message);
  }
};

const increment = () => {
  count.value += 1;
  unsavedChanges.value = true;
  triggerSave(); 
};

const decrement = () => {
  if (count.value > 0) {
    count.value -= 1;
    unsavedChanges.value = true;
    triggerSave(); 
  }
};

const triggerSave = () => {
  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    if (unsavedChanges.value) saveCounterToBackend();
  }, 10000);
};

onMounted(() => {
  initializeCounter();
  window.addEventListener("beforeunload", saveCounterToBackend);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", saveCounterToBackend);
  if (unsavedChanges.value) saveCounterToBackend();
});
</script>

<template>
  <v-container
    class="d-flex align-center justify-center"
    style="height: 100vh; width: 100vw"
  >
    <v-row class="justify-center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        class="d-flex flex-column align-center"
        style="max-width: 20rem"
      >
        <h1 class="count-title">Compteur</h1>
        <div class="circle d-flex justify-center align-center mt-5">
          {{ count }}
        </div>
        <div class="btns d-flex justify-space-between mt-6 w-100">
          <v-btn
            class="btn-moins"
            @click="decrement"
            aria-label="Décrémenter le compteur"
            >-</v-btn
          >
          <v-btn
            class="btn-plus"
            @click="increment"
            aria-label="Incrémenter le compteur"
            >+</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.count-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2.5rem;
  text-align: center;
}

.circle {
  height: 18.5rem;
  width: 18.5rem;
  border: 4px solid;
  border-radius: 50%;
  font-size: 9rem;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btns {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.v-btn {
  font-size: 2rem;
  font-weight: 900;
  width: 7rem;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-moins {
  background-color: red;
  color: white;
}

.btn-plus {
  background-color: blue;
  color: white;
}
</style>
