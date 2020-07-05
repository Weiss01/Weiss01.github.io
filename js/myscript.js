const fileSelector = $('#inputFile');
const popup = $('.alert');
var file_list;
var file_content;
var config = getConfig();
var results;

function getConfig() {
    return {
    delimiter: ",",
  }
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
    };
    reader.readAsText(files[0]);
}

fileSelector.change(function (event) {
  popup.addClass('unhide');
  const fileList = event.target.files;
  file_list = fileList;
  $(".custom-file-label").text(file_list[0].name);
  popup.text("File Name: " + file_list[0].name + ", File Type: " + file_list[0].type + ", File Size: " + file_list[0].size  + "kB");
  if ($('button').length < 2){
    addButton();
  }
})

function start_process() {
  console.log(results);
}

function addButton() {
  var button = document.createElement("button");
  var breakpoint = document.createElement("br");
  button.setAttribute('id', 'process');
  button.setAttribute('class', 'btn btn-outline-secondary');
  button.setAttribute('type', 'button');
  $('.jumbotron').append(breakpoint);
  $('.jumbotron').append(button);
  $('#process').html("Process");
  process_button = $("#process");

  process_button.click(function () {
    console.log("Starting Processing");
    readFileAsString(file_list);
    start_process();
  })
}
