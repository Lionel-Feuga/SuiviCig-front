<script setup>
import { ref, computed } from 'vue';

const selectedDates = ref([]);
const maxCigarettes = ref(null);

const handleDateSelection = (newDates) => {
  if (newDates.length <= 2) {
    selectedDates.value = newDates;
  } else {
    const newDate = newDates.find((date) => !selectedDates.value.includes(date));
    if (newDate) {
      const newTimestamp = new Date(newDate).getTime();
      const existingTimestamps = selectedDates.value.map((d) => new Date(d).getTime());
      const differences = existingTimestamps.map((timestamp) => Math.abs(newTimestamp - timestamp));
      const closestIndex = differences.indexOf(Math.min(...differences));
      const updatedDates = [...selectedDates.value];
      updatedDates[closestIndex] = newDate;
      selectedDates.value = updatedDates;
    }
  }

  // Tri des dates pour assurer que la plus ancienne soit la première
  selectedDates.value = [...selectedDates.value].sort((a, b) => new Date(a) - new Date(b));
};

const range = computed(() => {
  if (selectedDates.value.length >= 2) {
    const sortedDates = [...selectedDates.value].sort((a, b) => new Date(a) - new Date(b));
    return { start: sortedDates[0], end: sortedDates[1] };
  }
  return { start: null, end: null };
});

const saveRange = async () => {
  if (!range.value.start || !range.value.end || maxCigarettes.value === null || maxCigarettes.value < 0) {
    alert('Veuillez entrer des données valides.');
    return;
  }

  // Ajouter un jour à la endDate pour inclure le dernier jour sélectionné
  const endDateAdjusted = new Date(range.value.end);
  endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);

  const data = {
    startDate: range.value.start,
    endDate: endDateAdjusted.toISOString().split('T')[0], // Format YYYY-MM-DD
    maxCigarettesPerDay: maxCigarettes.value,
  };

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Données enregistrées avec succès !');
      console.log('Résultat :', result);
    } else {
      const error = await response.json();
      alert(`Erreur lors de l'enregistrement : ${error.message || 'Veuillez réessayer.'}`);
    }
  } catch (error) {
    console.error('Erreur réseau :', error);
    alert('Erreur réseau. Veuillez réessayer.');
  }
};

</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card width="600" outlined>
      <v-card-text>
        <v-date-picker
          :model-value="selectedDates"
          @update:model-value="handleDateSelection"
          multiple
          :style="{ width: '100%' }"
          style="margin-top: -50px;"
          title=""
        />
        <v-text-field
          v-model="maxCigarettes"
          type="number"
          label="Nombre maximum de cigarettes"
          placeholder="Entrer un nombre"
          style="margin-top: 20px;"
          :style="{ width: '100%' }"
        />
        <v-btn
          block
          color="primary"
          class="mt-4"
          @click="saveRange"
        >
          Enregistrer la plage et l'objectif
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-date-picker {
  width: 100%;
}
</style>
