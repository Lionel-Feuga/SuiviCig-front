<script setup>
import { ref, onMounted, computed } from "vue";

const error = ref("");
const currentGoal = ref(null);

const fetchGoals = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Utilisateur non authentifié.";
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/goals`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

const goalTitle = computed(() => {
  if (!currentGoal.value) return "Aucun Objectif pour le moment";

  const now = new Date();
  const startDate = new Date(currentGoal.value.startDate);

  return startDate > now ? "Prochain Objectif" : "Objectif Actuel";
});

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
      <v-col class="d-flex flex-column align-center">
        <h1 class="goal-title">{{ goalTitle }}</h1>
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
        <div class="obj-links d-flex justify-space-around mt-15 w-100">
          <a href="/Goals">Ajouter un objectif</a>
          <a href="/AllGoals">Tous les objectifs</a>
        </div>
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

.obj-links a {
  text-decoration: none;
}
</style>
