<script setup>
import { useWeatherStore } from '@/stores/weather';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import { getImage } from '@/composables/helper';

const weatherStore = useWeatherStore();
const { currentConditions, address } = storeToRefs(weatherStore);

onBeforeMount(async () => {
  weatherStore.getCityName();
  weatherStore.getCurrentWeatherInfo();
});

console.log(address)

</script>

<template>
  <header v-if="currentConditions" class="header">
  <!-- 지역 -->
  <h1 class="header__title">
    <span class="material-symbols-outlined"> location_on </span>{{ address }}
  </h1>
  <h2 class="header__date">{{ dayjs().format('HH:mm') }}</h2>
</header>
<!-- 현재 날씨 -->
<main v-if="currentConditions" class="main">
  <article class="weather">
    <section class="weather__info">
      <img
        :src="getImage(currentConditions.icon)"
        :alt="`${currentConditions.datetime} ${currentConditions.temp}도`"
        class="weather__img"
      />
      <h3 class="weather_temp">{{ currentConditions.temp }}°</h3>
      <p class="weather_summary">{{ currentConditions.conditions }}</p>
      <ul class="weather__moreList">
        <li class="weather__moreListItem">
          <p class="weather__subtitle">습도</p>
          <p class="weather__desc">{{ currentConditions.humidity }}</p>
        </li>
        <li class="weather__moreListItem">
          <p class="weather__subtitle">풍속</p>
          <p class="weather__desc">{{ currentConditions.windspeed }}</p>
        </li>
        <li class="weather__moreListItem">
          <p class="weather__subtitle">체감</p>
          <p class="weather__desc">{{ currentConditions.feelslike }}</p>
        </li>
      </ul>
    </section>
  </article>
</main>
</template>

<style>
</style>
