import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';

// axios를 사용해 HTTP 요청을 보내기 위한 Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL:
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/',
  params: {
    lang: 'ko',
    key: 'UA55JKQEKTC94XCFD7MJATNLJ',
    unitGroup: 'metric',
  },
});

const axiosInstance2 = axios.create({
    baseURL: 'https://api64.ipify.org/?format=json',
  });

const axiosInstance3 = axios.create({
    baseURL: 'https://freeipapi.com/api/json',
});


export const useWeatherStore = defineStore('weather', () => {
  const address = ref('');
  const currentConditions = ref(null);
  const days = ref(null);

  // 오늘 시간대별 데이터 계산
  const hours = computed(() => {
    return days.value
      // 날씨 객체 배열에서 오늘 날짜와 일치하는 객체 1개를 찾음
      ?.find((v) => v.datetime === dayjs().format('YYYY-MM-DD'))
      // 현재 시각 이후 시간만 시간별 데이터에 포함함
      ?.hours.filter((v) => v.datetime > dayjs().format('HH:mm:ss'));
  });

  // 미래 날짜의 날씨 예보 데이터 계산하기
  const forecast = computed(() => {
    return days.value?.filter((v) => v.datetime > dayjs().format('YYYY-MM-DD'));
  });

  const searchData = ref([]); // 검색 날씨 데이터

  const getCurrentWeatherInfo = async () => {
    try {
      const res = await axiosInstance.get('/' + address.value);
      currentConditions.value = res.data.currentConditions;
      days.value = res.data.days;
    } catch (e) {
      console.error('getCurrentWeatherInfo error:', e);
      alert(e.response?.data ? e.response?.data : e.message);
    }
  };

  // 지역명(city)으로 날씨 API 검색
  // city 파라미터를 받아 처리하도록 수정
  const getSearchWeatherInfo = async (city) => {
    try {
      console.log('getSearchWeatherInfo 호출, city:', city);
      const res = await axiosInstance.get(city);
      console.log('getSearchWeatherInfo res.data:', res.data);
      // 응답 데이터 객체로 필요한 데이터 가공
      const printData = {
        address: res.data.address,
        feelslikemax: res.data.days[0].feelslikemax,
        feelslikemin: res.data.days[0].feelslikemin,
        icon: res.data.currentConditions.icon,
        temp: res.data.currentConditions.temp,
      };
      console.log('가공된 printData:', printData);
      if (
        searchData.value.findIndex((v) => v.address === res.data.address) === -1
      ) {
        searchData.value.push(printData);
        console.log('검색 데이터에 추가됨:', searchData.value);
      } else {
        alert('이미 조회한 지역입니다.');
      }
    } catch (e) {
      console.error('getSearchWeatherInfo error:', e);
      alert(e.response?.data ? e.response?.data : e.message);
    }
  };

  const getCityName = async () => {
    try {
      const res = await axiosInstance2.get();
      const ip = res.data.ip;
      const res2 = await axiosInstance3.get(ip);
      console.log("IP 기반 위치 API 응답:", res2.data);
      address.value = res2.data.cityName;
      console.log("업데이트된 address:", address.value);
    } catch (e) {
      alert(e.response?.data ? e.response?.data : e.message);
    }
  }
  return {
    address,
    currentConditions,
    hours,
    forecast,
    searchData,
    getCurrentWeatherInfo,
    getSearchWeatherInfo,
    getCityName
  };
});
