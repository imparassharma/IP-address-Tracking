const d = document;
const $form = d.getElementById("form");
const $ip = d.getElementById("ip");
const $location = d.getElementById("location");
const $timezone = d.getElementById("timezone");
const $isp = d.getElementById("isp");
const $dialog = d.querySelector("dialog");
const $closeDialog = d.getElementById("close");
const $contentDialog = d.querySelector(".content-dialog");
let $p1;
let $p2;

export default function getLocation() {
  let ipAddress;
  let getData = async (ipAddress) => {
    // leafletjs to get map view
    const getMap = (lat, long) => {
      let container = L.DomUtil.get("map");
      if (container !== null) {
        container._leaflet_id = null;
      }
      let map = L.map("map").setView([lat, long], 13);
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoiZ2FiYWt0ZWNoIiwiYSI6ImNsMmNtdDY5eDAxeDkzYnJxNTRrNGNvdGYifQ.6GtRs6OgcCAFoP4wQCrRiQ",
        }
      ).addTo(map);

      let icon = L.icon({
        iconUrl: "./assets/images/icon-location.svg",

        iconSize: [30, 40], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      });
      L.marker([lat, long], { icon: icon }).addTo(map);
    };

    //ipify to get location
    try {
      let res = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_nEz5ZDkZ7y61Qf7YYQvkOOLskP0ci&ipAddress=${ipAddress}`
      );
      let json = await res.data;

      $ip.textContent = json.ip;
      $location.textContent = `${json.location.country}, ${json.location.region}`;
      $timezone.textContent = `UTC ${json.location.timezone}`;
      $isp.textContent = json.isp;
      getMap(json.location.lat, json.location.lng);
    } catch (err) {
      $p1 = d.createElement("p");
      $p2 = d.createElement("p");
      let message = err.response.statusText || "Ocurrió un error";
      let msg1 = `Error ${err.response.status}: ${message}`;
      let msg2 = err.response.data.messages;
      $p1.textContent = msg1;
      $p2.textContent = msg2;
      $contentDialog.appendChild($p1);
      $contentDialog.appendChild($p2);
      $dialog.showModal();
    }
  };

  //Set ip address to default on init
  if (ipAddress === undefined) {
    ipAddress = "8.8.8.8";
    getData(ipAddress);
  }

  //listen the submit btn
  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    ipAddress = Object.fromEntries(new FormData(e.target)).ip;
    getData(ipAddress);
  });

  $closeDialog.addEventListener("click", () => {
    $dialog.close();
    $p1.textContent = "";
    $p2.textContent = "";
  });
}