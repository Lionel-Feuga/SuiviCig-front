<script setup>
import { ref, onMounted } from "vue";

const goals = ref([]);
const error = ref("");
const currentGoal = ref(null);

const fetchGoals = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Utilisateur non authentifié.";
      return;
    }

    const response = await fetch("http://localhost:3000/api/goals", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const allGoals = await response.json();
      const now = new Date();

      const upcomingGoals = allGoals.filter((goal) => {
        const endDate = new Date(goal.endDate);
        return endDate >= now;
      });

      upcomingGoals.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );

      currentGoal.value = upcomingGoals[0] || null;
    } else {
      const responseData = await response.json();
      error.value =
        responseData.error || "Erreur lors de la récupération des objectifs.";
    }
  } catch (err) {
    error.value = "Erreur réseau. Veuillez réessayer.";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = date.toLocaleDateString("fr-FR", options);

  return formattedDate
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

onMounted(() => {
  fetchGoals();
});
</script>

<template>
  <v-container
    class="d-flex align-center justify-center"
    style="height: 100vh; width: 100vw"
  >
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="6" class="d-flex flex-column align-center">
        <h1 class="goal-title">Objectif Actuel</h1>
        <v-alert v-if="error" type="error" class="mt-5">
          {{ error }}
        </v-alert>
        <div
          class="goal-card d-flex flex-column text-center"
          v-if="currentGoal"
        >
          <div class="obj-date d-flex flex-column ga-1">
            <div class="first-date d-flex justify-space-between">
              Du
              <div class="dates">
                {{ formatDate(currentGoal.startDate) }}
              </div>
            </div>
            <div class="end-date d-flex justify-space-between">
              au
              <div class="dates">
                {{ formatDate(currentGoal.endDate) }}
              </div>
            </div>
          </div>
          <div class="cig-obj df mt-5">
            <div>
              Vous vous êtes donné comme objectif de fumer
              <div class="cig-count my-5 d-flex justify-center">
                {{ currentGoal.maxCigarettesPerDay }}
              </div>
              cigarettes maximum par jour.
            </div>
          </div>
        </div>
        <v-alert v-if="!currentGoal && !error" type="info" class="mt-5">
          Aucun objectif en cours ou à venir.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.goal-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2.5rem;
  text-align: center;
}

.goal-card {
  width: 18.5rem;
  height: 22rem;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  text-align: left;
  color: white;
  font-size: 1.4rem;
}

.dates {
  color: #17b9f9;
}

.cig-count {
  font-size: 4rem;
  color: #fe6e1f;
}

.v-alert {
  width: 100%;
  text-align: center;
}
</style>
