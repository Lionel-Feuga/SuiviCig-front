<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { ref, onMounted } from "vue";

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: frLocale,
  firstDay: 1,
  height: "auto",
  events: [],
  eventClick: (info) => showTooltip(info),
});

const error = ref("");

const activeTooltip = ref({
  visible: false,
  text: "",
  x: 0,
  y: 0,
  backgroundColor: "",
});

const showTooltip = (info) => {
  const rect = info.el.getBoundingClientRect();
  const backgroundColor = window.getComputedStyle(info.el).backgroundColor;

  activeTooltip.value = {
    visible: true,
    text: info.event.title,
    x: rect.left + rect.width / 2,
    y: rect.top - 10,
    backgroundColor: backgroundColor,
  };
};

const hideTooltip = (event) => {
  if (!event.target.closest(".tooltip") && !event.target.closest(".fc-event")) {
    activeTooltip.value.visible = false;
  }
};

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
      const goals = await response.json();

      calendarOptions.value.events = goals.map((goal, index) => {
        const adjustedEndDate = new Date(goal.endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

        return {
          title: `${goal.maxCigarettesPerDay} Cigarettes /Jour`,
          start: goal.startDate,
          end: adjustedEndDate.toISOString().split("T")[0],
          classNames: [`goal-color-${index % 5}`, "no-text"],
          display: "block",
        };
      });
    } else {
      const responseData = await response.json();
      error.value =
        responseData.error || "Erreur lors de la récupération des objectifs.";
    }
  } catch (err) {
    error.value = "Erreur réseau. Veuillez réessayer.";
  }
};

onMounted(() => {
  fetchGoals();
  document.addEventListener("click", hideTooltip);
});
</script>

<template>
  <v-container
    class="d-flex align-center justify-center"
    style="height: 100vh; width: 100vw"
  >
    <v-row class="justify-center">
      <v-col cols="12" sm="10" md="8">
        <h1 class="calendar-title mt-5">Mes Objectifs</h1>
        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>
        <FullCalendar :options="calendarOptions" />
        <div
          v-if="activeTooltip.visible"
          class="tooltip"
          :style="{
            top: activeTooltip.y + 'px',
            left: activeTooltip.x + 'px',
            backgroundColor: activeTooltip.backgroundColor,
          }"
        >
          {{ activeTooltip.text }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
