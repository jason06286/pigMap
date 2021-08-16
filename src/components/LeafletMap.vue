<script>
import L from 'leaflet';
import 'leaflet.markercluster';

import judgeBusiness from '@/composition/judgeBussiness';

import { onMounted, ref, watch } from 'vue';

export default {
  props: {
    filterData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const myMap = ref(null);
    const { isBusiness } = judgeBusiness();
    let center = [25.047176, 121.517058];
    let osm = null;
    let markerGroup = {};
    let markerClusterGroup = null;

    const pigIcon = new L.Icon({
      iconUrl:
        'https://storage.googleapis.com/vue-course-api.appspot.com/supergems/1628342136445.png?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=XkOtxMQ4pAZNH%2FIEhmaEFOUq4iHqzG4HVULWKl2sw6Nbod4ku7OT%2FoJC9fyb27JZlXTA3OertjMlGkjnamPKpADSGh2Iwoqj%2BXWQnRfE9h%2Bw2BKq1ZJxWaiH6QbYj03itWS%2Fhm7NM%2B6tJwo%2Be61kZJDWucOlizAJgxyfeC%2BwuDWQKN24A7Q72dJp4F3BfaiMRWxhk8QldNRHym6U8UOsAyojTIk4DIa6EyuIrTJf8Vse5grWfwSynOuvtKu0SrcKyG0%2BimVmiahjNY7fgSMI0t11f1i188%2BTip03OTllnvrgvnnYn%2FSNBDo7bHRJj15fLrZNCepxS8%2Bli3Q8ZYvoqQ%3D%3D',
      iconSize: [40, 40],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    function initMap() {
      osm = L.map(myMap.value, {
        center,
        zoom: 14,
      });
      osm.zoomControl.setPosition('topright');
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(osm);
      markerClusterGroup = new L.MarkerClusterGroup({}).addTo(osm);
    }

    function addMarker() {
      let content = '';
      props.filterData.forEach((item) => {
        let marker;
        if (
          isBusiness(
            item.business_week,
            item.business_hours,
            item.business_hurs_end
          )
        ) {
          content = `   
          <h2 class="text-xl font-bold">${item.market_name} <span class="ml-2 text-base text-green-700">營業中</span></h2>
      <h3>標章代碼: <span class="ml-2">${item.badge_code}</span></h3>
      <a href="https://www.google.com.tw/maps/place/${item.addr}/=zh-TW" target="_blank">${item.addr}</a>`;
        } else {
          content = `<h2 class="text-xl font-bold">${item.market_name} <span class="ml-2 text-base text-red-700" v-else>休息中</span></h2>
      <h3>標章代碼: <span class="ml-2">${item.badge_code}</span></h3>
      <a href="https://www.google.com.tw/maps/place/${item.addr}/=zh-TW" target="_blank">${item.addr}</a>`;
        }
        marker = L.marker([+item.Latitude, +item.Lontitude], {
          icon: pigIcon,
        }).bindPopup(content);
        markerGroup[item.badge_code] = marker;
        markerClusterGroup.addLayer(marker);
      });
      osm.addLayer(markerClusterGroup);
    }

    function removeMapMarker() {
      markerGroup = {};
      markerClusterGroup.clearLayers();
    }

    function flyToMarker(item) {
      osm.setView([item.Latitude, item.Lontitude], 20);
      markerClusterGroup.zoomToShowLayer(markerGroup[item.badge_code], () =>
        markerGroup[item.badge_code].openPopup()
      );
    }

    watch(
      () => props.filterData,
      () => {
        removeMapMarker();
        if (props.filterData.length !== 0) {
          center = [
            +props.filterData[0].Latitude,
            +props.filterData[0].Lontitude,
          ];
          osm.setView(center);
          addMarker();
        }
      }
    );

    onMounted(() => {
      initMap();
    });

    return {
      myMap,
      flyToMarker,
    };
  },
};
</script>

<template>
  <div id="map" class="relative z-20 w-full h-screen" ref="myMap"></div>
</template>

<style scoped>
</style>