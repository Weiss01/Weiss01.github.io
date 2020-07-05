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
        console.log("Finished Parsing");
        console.log("Parsed result:\n" + results["data"]);
        alert_complete();
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
    addParseButton();
  }
})

function alert_complete() {
  popup.attr("class", "alert alert-success");
  popup.addClass('unhide');
  popup.text("Finished Parsing " + file_list[0].name);
}

function start_process(results) {
  results.forEach((row, i) => {
    row.forEach((item, j) => {
      process.stdout.write(item + " ");
    })
    console.log("");
  });
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
