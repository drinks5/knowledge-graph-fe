<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <d3-network
          :net-nodes="nodes"
          :net-links="links"
          :options="options"
          :link-cb="lcb"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import D3Network from "vue-d3-network";
export default {
  name: "NodesList",
  components: {
    D3Network,
  },
  data() {
    return {
      nodes: [
        { id: 1, name: "my awesome node 1" },
        { id: 2, name: "my node 2" },
        { id: 3, name: "orange node", _color: "orange" },
        { id: 4, name: "blue node", _color: "#00aaff" },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
      ],
      links: [
        { sid: 1, tid: 2, name: "link 1" },
        { sid: 2, tid: 8, name: " link from 2 to 8" },
        { sid: 4, tid: 3 },
        { sid: 4, tid: 5 },
        { sid: 4, tid: 9 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8, name: "another link" },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 },
        { sid: 3, tid: 9 },
        { sid: 10, tid: 6 },
        { sid: 11, tid: 6 },
        { sid: 12, tid: 6, name: "12 to center" },
        { sid: 13, tid: 6 },
        { sid: 14, tid: 6 },
      ],
      nodeSize: 10,
      canvas: true,
    };
  },
  computed: {
    options() {
      return {
        force: 3000,
        size: { w: 600, h: 600 },
        nodeSize: this.nodeSize,
        nodeLabels: true,
        linkLabels: true,
        canvas: this.canvas,
        linkWidth: 2,
        strLinks: true
      };
    },
  },
  methods: {
    lcb(link) {
      return link;
    },
  },
};
</script>

<style scoped>
</style>