<script>
import axios from 'axios';

import LeafletMap from './LeafletMap.vue';
import cityName from '../assets/cityName.json';
import judgeBusiness from '../composition/judgeBussiness';

import { computed, onMounted, reactive, ref } from 'vue';

export default {
  components: {
    LeafletMap,
  },
  setup() {
    const isOpen = ref(true);
    const select = reactive({
      obj: {
        city: '臺北市',
        area: '',
      },
    });
    // 取得所有台灣豬資料
    const data = reactive({ arr: [] });

    function getData() {
      const url =
        'https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=tR9TIFWlvquB';
      axios
        .get(url)
        .then((res) => {
          data.arr = res.data;
        })
        .catch((err) => {
          console.dir(err);
        });
    }

    onMounted(() => {
      getData();
    });
    // 區域篩選資料
    const filterData = computed(() => {
      return data.arr.filter((item) => {
        return item.addr.match(select.obj.city + select.obj.area) !== null;
      });
    });

    const map = ref(null);

    return {
      isOpen,
      cityName,
      select,
      filterData,

      ...judgeBusiness(),

      map,
    };
  },
};
</script>

<template>
  <section>
    <LeafletMap :filterData="filterData" ref="map" />
    <div class="sidebar" :class="{ active: isOpen }">
      <div class="side-header">
        <div
          class="side-btn"
          @click="isOpen = !isOpen"
          :class="{ active: isOpen }"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
        <div class="flex flex-col items-center justify-center h-full p-5">
          <div class="logo"></div>
          <select
            class="select"
            v-model="select.obj.city"
            @change="select.obj.area = ''"
          >
            <option value="" disabled="disabled">請選擇縣市</option>
            <option
              :value="item.CityName"
              v-for="item in cityName"
              :key="item.CityName"
            >
              {{ item.CityName }}
            </option>
          </select>
          <select class="select" v-model="select.obj.area">
            <option value="" selected>請選擇鄉鎮區</option>
            <option
              :value="item.AreaName"
              v-for="item in cityName.find(
                (city) => city.CityName === select.obj.city
              ).AreaList"
              :key="item.AreaName"
            >
              {{ item.AreaName }}
            </option>
          </select>
        </div>
      </div>
      <ul class="overflow-y-scroll h-2/4">
        <li
          class="card"
          v-for="item in filterData"
          :key="item.badge_code"
          @click="map.flyToMarker(item)"
        >
          <h2
            class="pl-2 mb-2 text-2xl font-bold text-green-800 border-l-4 border-green-800 "
          >
            {{ item.market_name }}
          </h2>
          <p class="text-xl">{{ item.context }}</p>
          <p>標章代碼 : {{ item.badge_code }}</p>
          <p>有效日期 : {{ item.ValidDate.split(' ')[0] }}</p>
          <p>{{ item.addr }}</p>
          <p
            v-if="
              isBusiness(
                item.business_week,
                item.business_hours,
                item.business_hurs_end
              )
            "
            @click.stop="showBusiness(item.badge_code)"
          >
            <span class="mr-2 font-bold text-green-800">營業中</span>
            {{ item.business_hours }} ~ {{ item.business_hurs_end }}
            <span class="ml-1 align-bottom">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline-block w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </p>
          <p v-else @click.stop="showBusiness(item.badge_code)">
            <span class="mr-2 font-bold text-red-800">休息中</span>
            {{ item.business_hours }} ~ {{ item.business_hurs_end }}
            <span class="ml-1 align-bottom">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline-block w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </p>
          <div v-if="isShow && isShowBusiness === item.badge_code">
            <template v-for="week in weekArray.arr" :key="week">
              <p
                v-if="judgeWeek(week, item.business_week)"
                :class="{ 'bg-green-400': week === nowWeek }"
              >
                <span class="mr-2">{{ week }} </span>
                {{ item.business_hours }} ~
                {{ item.business_hurs_end }}
              </p>
              <p
                v-else
                class="text-red-800"
                :class="{ 'bg-green-400': week === nowWeek }"
              >
                <span class="mr-2">{{ week }} </span> 未營業
              </p>
            </template>
          </div>
          <div class="flex justify-center w-full mt-2 md:justify-end">
            <a
              class="btn"
              :href="`https://www.google.com.tw/maps/place/${item.addr}/=zh-TW`"
              target="_blank"
              >導航至該地點</a
            >
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sidebar {
  @apply absolute top-0 left-0 w-10/12 h-screen z-30 transition-all duration-700 transform -translate-x-full bg-white  sm:w-7/12 lg:w-3/12;
}
.side-header {
  @apply font-serif shadow-xl  h-2/4 bg-gradient-to-r from-green-700 to-green-500 relative;
}
.side-btn {
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  width: 40px;
  height: 80px;
  color: #fff;
  background: #0fb77f;
  border-radius: 0 0.5rem 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 1s;
}
.side-btn.active span {
  transform: rotate(-180deg);
}
.sidebar.active {
  transform: translateX(0);
}
.logo {
  background: url('../assets/pig-logo.svg');
  width: 100%;
  height: 180px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: none;
}
.select {
  @apply w-full p-1 mb-4 border border-gray-700 rounded;
}
.btn {
  @apply px-3 py-2  font-bold text-white bg-green-600  w-full md:w-auto rounded-3xl transition duration-300 hover:bg-green-800 text-center;
}
.card {
  @apply p-5 font-bold text-gray-800  border-b-2 border-gray-600  cursor-pointer h-auto hover:bg-gray-200 flex justify-between flex-col;
}
</style>
  