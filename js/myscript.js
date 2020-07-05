function readFileAsString(files) {
    if (files.length === 0) {
        console.log('No file is selected');
        return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
        console.log('File content:', event.target.result);
        file_content = event.target.result;
    };
    reader.readAsText(files[0]);
}

function addButton() {
  // <button class="btn btn-outline-secondary" type="button" id="inputFileAddon">Upload</button>
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
    console.log(myfile);
    readFileAsString(myfile);
    calculate();
  })
}

const fileSelector = $('#inputFile');
const popup = $('.alert');
var myfile;
var file_content;

fileSelector.change(function (event) {
  popup.addClass('unhide');
  const fileList = event.target.files;
  console.log(fileList);
  myfile = fileList;
  $(".custom-file-label").text(fileList[0].name);
  popup.text("File Name: " + fileList[0].name + ", File Type: " + fileList[0].type + ", File Size: " + fileList[0].size  + "kB");
  addButton();
})

function calculate() {
  console.log(Papa.parse(file_content));
}
