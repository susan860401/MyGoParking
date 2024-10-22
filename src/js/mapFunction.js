import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import router from "@/router";

//抓定位：Leaflet.Locate
export const locatePlace = (mapRef) => {
  L.control
    .locate({
      position: "topleft",
      locateOptions: {
        enableHighAccuracy: true,
      },
      strings: {
        title: "定位我的位置",
        metersUnit: "公尺",
        feetUnit: "英尺",
        popup: "距離誤差：{distance}{unit}以內",
      },
      clickBehavior: {
        inView: "setView",
        outOfView: "setView",
        inViewNotFollowing: "inView",
      },
      onLocationerror: () => {
        Swal.fire({
          icon: "error",
          title: "定位錯誤",
          text: "無法取得當前位置，請確保定位已啟用!",
        });
      },
    })
    .addTo(mapRef);
};
