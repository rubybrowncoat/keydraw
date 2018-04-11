<template>
  <div class="instructions-container">
    <div class="lefty menu">
      <span class="name">
        Keycler
      </span>
      <span class="menuItem">
        <span class="label">
          <fa :icon="['fas', 'credit-card']" />
        </span>
        &euro;{{ funds.toString() }}
      </span>
    </div>

    <div class="righty menu">
      <span class="menuItem">
        &euro;{{ fundsPerSecond.toString() }}
        <span class="txtLabel fups">Fups</span>
      </span>
      <span class="copyright">
        &copy; 2018 <a href="http://pumo.mp">pumo.mp</a>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.instructions-container {
  position: relative;
  width: 100%;
  max-width: 1300px;
  padding: 0 20px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  vertical-align: middle;
  display: flex;

  text-transform: uppercase;
  font-size: 22px;

  z-index: 2;

  .name {
    float: left;
    padding: 5px 10px;
    height: 33px;
    border-radius: 5px;
  }

  .menuItem {
    margin-left: 20px;
  }

  .lefty {
    position: absolute;
    left: 20px;
  }

  .righty {
    position: absolute;
    right: 20px;
  }

  .copyright {
    position: relative;
    margin-left: 15px;
    top: -6px;
  }
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [
  'artefact',
  'commune',
  ],
  computed: {
    ...mapGetters('color', ['currentName']),
    ...mapGetters('theme', ['currentTheme']),
    ...mapGetters('grid', [
      'keyboardWidth',
      'keyboardHeight',

      'gridWidth',
      'gridHeight',

      'actives',
      ]),

    ...mapGetters('keycler', ['funds', 'fundsPerSecond'])
  }
}
</script>
