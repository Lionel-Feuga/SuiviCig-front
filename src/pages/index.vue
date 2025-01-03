<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.value, password: password.value }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      router.push("/Home");
    } else {
      const errorResponse = await response.json();
      error.value = errorResponse.error || "Une erreur est survenue.";
    }
  } catch (err) {
    error.value =
      "Impossible de se connecter. Identifiant et/ou mot de passe incorrect.";
  }
};
</script>

<template>
  <v-container>
    <v-row class="justify-center align-center" style="height: 100vh">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Connexion</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
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
              <v-btn block color="primary" type="submit"> Se connecter </v-btn>
              <Router-link
                to="/Register"
                class="custom-link d-flex justify-end mt-2"
                >Pas encore inscris ? Inscrivez-vous</Router-link
              >
            </v-form>
            <v-alert v-if="error" type="error" dismissible class="mt-4">
              {{ error }}
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
