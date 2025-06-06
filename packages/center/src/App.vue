<script setup>
</script>
<template>
  <router-view></router-view>
</template>


<style>
#app {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  max-width: none;
  text-align: center;
  overflow-x: hidden;
}
* {
  box-sizing: border-box;
}
a {
  color: #333;
  text-decoration: none;
  font-weight: 400;
}
a:hover {
  text-decoration: none;
  color: #333;
}
html {
  -webkit-tap-highlight-color: transparent;
}
@media (max-width: 400px) {
  html {
    font-size: 4px;
  }
}

@media (min-width: 400px) {
  html {
    font-size: 5px;
  }
}

@media (min-width: 700px) {
  html {
    font-size: 7px;
  }
}

@media (min-width: 1000px) {
  html {
    font-size: 8px;
  }
}
@media (min-width: 1400px) {
  html {
    font-size: 10px;
  }
}
@media (min-width: 1700px) {
  html {
    font-size: 10px;
  }
}

@media (min-width: 2200px) {
  html {
    font-size: 14px;
  }
}

@media (min-width: 2600px) {
  html {
    font-size: 17px;
  }
}
</style>