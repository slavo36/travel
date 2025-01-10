function onLoad() {
  var modal = document.getElementById("myModal");
  var modalDialog = document.getElementById("modalDialog");
  var close = document.getElementsByClassName("close")[0];
  

  close.onclick = function () {
    modal.style.display = "none";
  };

  modalDialog.onclick = function () {
    modal.style.display = "block";

    var req = new XMLHttpRequest();
    req.open(
      "GET",
      "https://api.travelcircus.net/hotels/17080/checkins?E&party=%7B%22adults%22:2,%22children%22:%5B%5D%7D&domain=de&date_start=2025-01-01&date_end=2025-06-31",
      true
    );

    req.onload = function () {
        const price = [];
      if (req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText);
        console.log(data);
        if (data._embedded.hotel_availabilities) {
          data._embedded.hotel_availabilities.forEach((element) => {
            price.push({ [element.date]: element.price });
          });
        }

        console.log("price", price);
        createCalendar(price);
      } else {
        console.error("Error:", req.statusText);
      }
    };

    req.onerror = function () {
      console.error("Connection error");
    };

    req.send();
  };
  function createCalendar(price) {
  flatpickr("#flatpickr", {
    mode: "range",
    inline: true,
    onDayCreate: (dObj, dStr, fp, dayElem) => {
      const dateStr = fp.formatDate(dayElem.dateObj, "Y-m-d").toString(); // Correctly format date as YYYY-MM-DD
      console.log("currentDate", dateStr);

      if (price.length > 0){
      if (price[dateStr]) { 
        console.log("TEST", price[dateStr]);
        // Add a span with the price for the date
        const priceElem = document.createElement("span");
        priceElem.className = "price-info";
        priceElem.textContent = price[dateStr];
        dayElem.appendChild(priceElem);
      } else {
        // Add a span with a "-" if there is no price for the date
        const priceElem = document.createElement("span");
        priceElem.className = "price-info";
        priceElem.textContent = "-";
        dayElem.appendChild(priceElem);
      }}
    },
  });
}}
