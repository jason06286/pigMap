# 台灣豬地圖

## 開發

```

# install deps
npm  install

# run dev server
npm run dev

# run build
npm run  build

# preview dist files
npm run server

```

## 使用技術

這次使用 `Vite` 做開發 ，並使用 `composition api `做邏輯拆分

主要用到的套件有 `axios` `tailwind`  地圖部分使用 `leaflet` `leaflet markercluster`

另外抓取了縣市 json 檔 用在 `select` 中

## 重點 API 講解

1. 初始化地圖 `L.map("地圖的 dom ",{center:[x座標,y座標],zoom:num})`

  * `L`：`leaflet` 的縮寫

  * `center`：顯示時的中心點座標

  * `zoom`：顯示的縮放大小 範圍 `0~18` 推薦範圍 `15~18`

  在 `onMounted` 時初始化地圖

```js

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
    
  onMounted(() => {
    initMap();
  });

```

2. 監聽 filterData 的變化,並加入 `props.filterData.length !== 0` 判斷 
避免 `filterData` 為空值發生渲染錯誤，利用 `panTo` 移動畫面至更新的中心點

```js

  watch(
      () => props.filterData,
      () => {
        removeMapMarker();
        if (props.filterData.length !== 0) {
          center = [
            +props.filterData[0].Latitude,
            +props.filterData[0].Lontitude,
          ];
          osm.panTo(center);
          addMarker();
        }
      }
    );

```

3. 增加地標的方法 `addMarker`

創建一個 `markergroup` 物件 裡面存放建立的 `marker`資料

透過 `forEach` 跑 `filterData` 將每家店建立自己的 `marker` 

再將 `marker` `push` 到 `markergroup` 中

透過 `markerClusterGroup.addLayer(marker)` 方法 

裡面存放要透過 `leaflet markercluster` 處理的資料

最後再通過 `osm.addLayer(markerClusterGroup)` 方法把 `markerClusterGroup` 增加到地圖上

代碼如下：

```js

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

```

4. 移除所有地標的方法 `removeMapMarker`

將 `markerGroup` 裡存放的資料清空

透過 `clearLayers`清空 `markerClusterGroup` 裡的 `layer`

代碼如下：

```js

  function removeMapMarker() {
      markerGroup = {};
      markerClusterGroup.clearLayers();
    }

```

5. 移動點選至地點

透過 `setView` 方法移至該地點

透過 `id` `markerGroup[item.badge_code]`

抓取出點取的 `marker`

再透過 `openPopup` 顯示詳細資料

代碼如下：

```js

   function flyToMarker(item) {
      osm.setView([item.Latitude, item.Lontitude], 20);
      markerClusterGroup.zoomToShowLayer(markerGroup[item.badge_code], () =>
        markerGroup[item.badge_code].openPopup()
      );
    }

```
