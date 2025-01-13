<script setup>
import { ref, onMounted, computed } from "vue";

const count = ref(0);
const goal = ref(null);
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 55;
const token = localStorage.getItem("token");

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
    } else if (response.status === 404) {
      count.value = 0;
    } else {
      throw new Error(
        "Erreur lors de la récupération des données du compteur."
      );
    }

    const goalResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/goals`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (goalResponse.ok) {
      const goals = await goalResponse.json();
      goal.value =
        goals.find((g) => {
          const startDate = new Date(g.startDate);
          const endDate = new Date(g.endDate);
          const currentDate = new Date(today);
          return currentDate >= startDate && currentDate <= endDate;
        })?.maxCigarettesPerDay || null;
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation du compteur :",
      error.message
    );
  }
};

const updateDatabase = async (cigarettesSmoked) => {
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
          cigarettesSmoked,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de la base de données.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la base de données :",
      error.message
    );
  }
};

const increment = async () => {
  count.value += 1;
  await updateDatabase(count.value);
};

const decrement = async () => {
  if (count.value > 0) {
    count.value -= 1;
    await updateDatabase(count.value);
  }
};

const circleProgress = computed(() => {
  if (goal.value === null || goal.value <= 0) {
    return CIRCLE_CIRCUMFERENCE;
  }
  const percentage = Math.min(count.value / goal.value, 1) * 100;
  return CIRCLE_CIRCUMFERENCE * (1 - percentage / 100);
});

const overCircleProgress = computed(() => {
  if (count.value <= goal.value || goal.value === null || goal.value <= 0) {
    return CIRCLE_CIRCUMFERENCE;
  }
  const extraPercentage =
    Math.min((count.value - goal.value) / goal.value, 1) * 100;
  return CIRCLE_CIRCUMFERENCE * (1 - extraPercentage / 100);
});

onMounted(() => {
  initializeCounter();
});
</script>

<template>
  <v-container
    class="d-flex align-center justify-center"
    style="height: 100vh; width: 100vw"
  >
    <v-row class="justify-center">
      <v-col class="d-flex flex-column align-center" style="max-width: 20rem">
        <h1 class="count-title">Compteur</h1>
        <div class="circle-container">
          <svg
            class="progress-circle"
            width="250"
            height="250"
            viewBox="0 0 125 125"
          >
            <circle
              class="progress-circle-bg"
              cx="62.5"
              cy="62.5"
              r="55"
              fill="none"
              stroke-width="4"
            />
            <circle
              class="progress-circle-fill"
              cx="62.5"
              cy="62.5"
              r="55"
              fill="none"
              stroke-width="4"
              :stroke-dasharray="CIRCLE_CIRCUMFERENCE"
              :stroke-dashoffset="circleProgress"
            />
            <circle
              class="progress-circle-over"
              cx="62.5"
              cy="62.5"
              r="55"
              fill="none"
              stroke-width="4"
              :stroke-dasharray="CIRCLE_CIRCUMFERENCE"
              :stroke-dashoffset="overCircleProgress"
            />
          </svg>
          <div class="circle-value">{{ count }}</div>
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

.circle-container {
  position: relative;
  width: 250px;
  height: 250px;
}

.progress-circle {
  transform: rotate(-90deg);
  transform-origin: center;
}

.progress-circle-over {
  stroke: #ce0000;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-circle-bg {
  stroke: #e0e0e0;
}

.progress-circle-fill {
  stroke: #2196f3;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.circle-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: bold;
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
  background-color: #ce0000;
  color: white;
}

.btn-plus {
  background-color: #2196f3;
  color: white;
}
</style>
