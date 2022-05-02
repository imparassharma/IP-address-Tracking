import getLocation from "./ipGeolocationAPI.js";

const d = document;
d.addEventListener("DOMContentLoaded", (e) => {
  getLocation();
});