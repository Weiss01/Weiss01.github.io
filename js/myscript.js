const fileSelector = $('#inputFile');
var file_list;
var file_content;
var results;

function exists(id) {
  var temp = document.getElementById(id);
  if (temp === null){
    return false;
  } else {
    return true;
  }
}

fileSelector.change(function (event) {
  const fileList = event.target.files;
  file_list = fileList;
  $(".custom-file-label").text(file_list[0].name);
  if (!exists("alert-bar")){
    add_alert();
  } else {
    $("#alert-bar").attr('class', 'alert alert-primary');
  }
  $('.alert').text("File Name: " + file_list[0].name + ", File Type: " + file_list[0].type + ", File Size: " + file_list[0].size  + "kB");
  if (!exists("parse")){
    addParseButton();
  }
})

function add_alert() {
  var alert = document.createElement("div");
  var breakpoint = document.createElement("br");
  alert.setAttribute('id', 'alert-bar');
  alert.setAttribute('class', 'alert alert-primary');
  alert.setAttribute('role', 'alert');
  $('.jumbotron').append(breakpoint);
  $('.jumbotron').append(alert);
}

function addParseButton() {
  var button = document.createElement("button");
  var breakpoint = document.createElement("br");
  button.setAttribute('id', 'parse');
  button.setAttribute('class', 'btn btn-outline-secondary');
  button.setAttribute('type', 'button');
  $('.jumbotron').append(breakpoint);
  $('.jumbotron').append(button);
  $('#parse').html("Parse");
  process_button = $("#parse");

  process_button.click(function () {
    console.log("Parsing....");
    readFileAsString(file_list);
  })
}

function readFileAsString(files) {
    if (files.length === 0) {
        console.log('No file is selected');
        return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
        file_content = event.target.result;
        results = Papa.parse(file_content);
        console.log("Finished Parsing");
        console.log("Parsed result:\n" + results["data"]);
        alert_complete();
    };
    reader.readAsText(files[0]);
}

function alert_complete() {
  $('#alert-bar').attr("class", "alert alert-success");
  $('#alert-bar').text("Finished Parsing " + file_list[0].name);
}

function start_process(results) {
  results = results["data"];
  results.forEach((row, i) => {
    var temp = "";
    row.forEach((item, j) => {
      temp += item + " "
    })
    console.log(temp);
  });
}
