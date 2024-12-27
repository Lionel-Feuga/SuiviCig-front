<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      success.value = "Inscription réussie ! Vous allez être redirigé vers la page de connexion.";
      error.value = '';
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      const errorResponse = await response.json();
      error.value = errorResponse.error || "Une erreur est survenue.";
    }
  } catch (err) {
    error.value = "Impossible de créer un compte. Veuillez réessayer.";
  }
};
</script>

<template>
  <v-container>
    <v-row class="justify-center align-center" style="height: 100vh">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Inscription</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="username"
                label="Nom d'utilisateur"
                required
              />
              <v-text-field
                v-model="email"
                label="Adresse e-mail"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Mot de passe"
                type="password"
                required
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                required
              />
              <v-btn block color="primary" type="submit">
                S'inscrire
              </v-btn>
              <Router-link to="/" class="custom-link d-flex justify-end mt-2">Déjà inscrit ? Connectez-vous</Router-link>
            </v-form>
            <v-alert
              v-if="error"
              type="error"
              dismissible
              class="mt-4"
            >
              {{ error }}
            </v-alert>
            <v-alert
              v-if="success"
              type="success"
              dismissible
              class="mt-4"
            >
              {{ success }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.custom-link {
  text-decoration: none;
}
.custom-link:hover {
  text-decoration: underline;
}
</style>
