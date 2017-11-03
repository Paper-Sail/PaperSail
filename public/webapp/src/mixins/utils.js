import translations from "../../translations.js";
export default {
  computed: {
    assetsUrl() {
      return `${publicPath}/assets/`;
    },
  },
  methods: {
    t(number) {
      return translations[number];
    }
  },
};