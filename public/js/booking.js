
var currentPage = 0;
var btnBack;
var btnNext;
var numberOfPersonControl;
var destinationControl;
var dateControl;
$(document).ready(function () {
  btnBack = document.getElementById('btnBack');
  btnNext = document.getElementById('btnNext');
  btnBack.style.visibility = "hidden";
  dateControl = document.getElementById("date");
  numberOfPersonControl = document.getElementById("passengers");
  destinationControl = document.getElementById("city");
  $('.allSteps').slick({
    accessibility: false,
    draggable: false,
    focusOnSelect: false,
    prevArrow: ".btnBack",
    nextArrow: ".btnNext",
    swipe: false

  });
  setCurrentDate();
  loadPlaces();

  var seats = getAllCheckBox(15, "");
  setOnClickCheckBox(seats);
  model1.style.display = "block";

  var imie = sessionStorage.getItem('imie');
  var nazwisko = sessionStorage.getItem('nazwisko');

});

function onClickNext() {
  currentPage++;
  if (currentPage > 0) {
    btnBack.style.visibility = "visible";
  }
  if (currentPage === 3) {
    btnBack.style.visibility = "hidden";
    btnNext.style.visibility = "hidden";
    var rowsAndIdPlus = getRowsAndIdPlus();
    var seats = getAllCheckBox(rowsAndIdPlus.rows, rowsAndIdPlus.idPlus);
    var pickedSeats = getAllPickedSeats(seats);
    var infoPerson = document.getElementById("infoForPassengers");
    infoPerson.innerHTML = "";
    infoPerson.innerHTML = "</br>Pasażer: " + sessionStorage.getItem('imie') + " " + sessionStorage.getItem('nazwisko');
    var textSeats = "";
    for (var i = 0; i < pickedSeats.length; i++) {
      textSeats += pickedSeats[i].id + ", ";
    }
    textSeats = textSeats.slice(0, -2);
    infoPerson.innerHTML += "</br></br>Siedzenia: " + textSeats

    var departureResult = document.getElementById("departureTimeResult");
    departureResult.innerHTML = "<p>Godzina: 10:00</p>";
    departureResult.innerHTML += "Data: " + dateControl.value;

    var departureCityResult = document.getElementById("departureCityResult");
    departureCityResult.innerHTML = "Warszawa do " + destinationControl.value;

    setClasses(seats);
    var totalPriceControl = document.getElementById("totalPrice");
    totalPriceControl.innerHTML = "Koszt całkowty: " + computePrice(pickedSeats) + " zł";
  }


}
function onClickBack() {
  currentPage--;
  if (currentPage === 0) {
    btnBack.style.visibility = "hidden";
  }
}
function setCurrentDate() {
  var currentData = new Date();
  minDate = parseDate(currentData, 0);
  dateControl.value = minDate;
  dateControl.setAttribute("min", minDate);

  var maxDate = parseDate(currentData, 1);
  dateControl.setAttribute("max", maxDate);
}
function parseDate(date, offsetY) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear() + offsetY;

  if (month < 10)
    month = '0' + month.toString();
  if (day < 10)
    day = '0' + day.toString();

  return year + '-' + month + '-' + day;
}
function loadPlaces() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let places = JSON.parse(xmlHttp.response);
      for (var i = 0; i < places.length; i++) {

        var option = document.createElement("option");
        option.text = places[i].nazwa;
        option.attr = places[i];
        destinationControl.add(option);
      }
    }
  }
  xmlHttp.open("GET", "places", true); // true for asynchronous 
  xmlHttp.send(null);
}
function onChangeCity() {
  hiddenModels();

  var rowsAndIdPlus = getRowsAndIdPlus();
  clearSeats(getAllCheckBox(rowsAndIdPlus.rows, rowsAndIdPlus.idPlus));
  pickModel();
}
function hiddenModels() {
  model1.style.display = "none";
  model2.style.display = "none";
  model3.style.display = "none";
}
function pickModel() {
  var selectedDestinationData = destinationControl.options[destinationControl.selectedIndex];
  if (selectedDestinationData.attr.samolot == 'Boeing737') {
    model1.style.display = "block";
    var seats = getAllCheckBox(15, "");
    setOnClickCheckBox(seats);
  }
  else if (selectedDestinationData.attr.samolot == 'Dreamliner') {
    var seats = getAllCheckBox(20, "1");
    setOnClickCheckBox(seats);
    model2.style.display = "block";
  }
  else if (selectedDestinationData.attr.samolot == 'Embraer') {
    var seats = getAllCheckBox(30, "2");
    setOnClickCheckBox(seats);
    model3.style.display = "block";
  }
}
function getRowsAndIdPlus() {
  var selectedDestinationData = destinationControl.options[destinationControl.selectedIndex];
  if (selectedDestinationData.attr.samolot == 'Boeing737') {
    return { rows: 15, idPlus: "" };
  }
  else if (selectedDestinationData.attr.samolot == 'Dreamliner') {
    return { rows: 20, idPlus: "1" };
  }
  else if (selectedDestinationData.attr.samolot == 'Embraer') {
    return { rows: 30, idPlus: "2" };
  }
}
function getAllCheckBox(rows, idPlus) {
  var seats = [];
  var alfabet = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (var i = 1; i <= rows; i++) {
    for (var k = 0; k < 6; k++) {
      seats.push(document.getElementById(i + alfabet[k] + idPlus));
    }
  }
  return seats;
}
function setOnClickCheckBox(seats) {
  var blocked = false;
  for (var x = 0; x < seats.length - 1; x++) {
    seats[x].addEventListener('change', function () {
      if (checkIsFullSelectedSeats(seats)) {
        blockOtherCheckBox(seats);
        blocked = true;
      }
      if (blocked && !checkIsFullSelectedSeats(seats)) {
        unBlockCheckBox(seats);
        blocked = false;
      }
    });
  }
}
function unBlockCheckBox(seats) {
  for (var i = 0; i < seats.length; i++) {
    if (seats[i] != null && seats[i].disabled == true)
      seats[i].disabled = false;
  }
}
function blockOtherCheckBox(seats) {
  for (var i = 0; i < seats.length; i++) {
    if (seats[i] != null && seats[i].checked == false)
      seats[i].disabled = true;
  }
}
function checkIsFullSelectedSeats(seats) {
  var count = 0;
  for (var i = 0; i < seats.length; i++) {
    if (seats[i] != null)
      if (seats[i].checked) {
        count++;
        if (count >= numberOfPersonControl.value) {
          return true;
        }
      }
  }
  return false;
}
function getAllPickedSeats(seats) {
  var pickedSeats = [];
  for (var i = 0; i < seats.length; i++) {
    if (seats[i] != null)
      if (seats[i].checked) {
        pickedSeats.push(seats[i]);
      }
  }
  return pickedSeats;
}
function clearSeats(seats) {
  for (var i = 0; i < seats.length; i++) {
    seats[i].disabled = false;
    seats[i].checked = false;
  }
}
function onChangePassengers() {
  var seats = getAllCheckBox();
  clearSeats(seats);
  hiddenModels();

  var rowsAndIdPlus = getRowsAndIdPlus();
  clearSeats(getAllCheckBox(rowsAndIdPlus.rows, rowsAndIdPlus.idPlus));
  pickModel();
}
function computePrice(pickedSeats) {
  var standardKoszt = parseInt(destinationControl.options[destinationControl.selectedIndex].attr.standardKoszt);
  var sum = 0;
  for (var i = 0; i < pickedSeats.length; i++) {
    var pom = standardKoszt;
    if (pickedSeats[i].className == "Business") {
      pom *= 3;
    }
    sum += pom;
  }
  var extraLadgeController = document.getElementById("extraLadge");
  sum += parseInt(extraLadgeController.options[extraLadgeController.selectedIndex].value);
  return sum;
}
function setClasses() {
  var nameAirplane = destinationControl.options[destinationControl.selectedIndex].attr.samolot;
  var rowsAndIdPlus = getRowsAndIdPlus();
  var seats = getAllCheckBox(rowsAndIdPlus.rows, rowsAndIdPlus.idPlus);
  for (var i = 0; i < seats.length; i++) {
    if (nameAirplane == "Boeing737") {
      seats[i].className = "Economy";
    } else if (nameAirplane == "Dreamliner") {
      if (i <= 30)
        seats[i].className = "Business";
      else
        seats[i].className = "Economy";
    } else if (nameAirplane == "Embraer") {
      if (i <= 60)
        seats[i].className = "Business";
      else
        seats[i].className = "Economy";
    }
  }
}
function onClickLogout(){
        window.open("/", "_self");
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "/logout"); // true for asynchronous

  xmlHttp.send(null);
}