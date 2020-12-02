<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Fudan Logo"
          class="shrink mr-2"
          contain
          src="https://www.fudan.edu.cn/_upload/site/00/02/2/logo.png"
          transition="scale-transition"
          width="180"
        />
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <NodesList/>
    </v-main>
  </v-app>
</template>

<script>
import NodesList from './components/NodesList';

export default {
  name: 'App',

  components: {
    NodesList,
  },

  data: () => ({
    //
  }),
};
</script>
