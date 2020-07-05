var DataFrame = dfjs.DataFrame;
const fileSelector = $('#inputFile');
var file_list;
var my_file;
var file_content;
var results;
var my_df;

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
    my_file = file_list[0];
    $(".custom-file-label").text(file_list[0].name);
    if (!exists("alert-bar")){
        add_alert();
    } else {
        $("#alert-bar").attr('class', 'alert alert-primary');
    }
    $('.alert').text("File Name: " + file_list[0].name + ", File Type: " + file_list[0].type + ", File Size: " + file_list[0].size  + "kB");
    if (!exists("parse")){
        addParseOptions();
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

<div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text" id="">First and last name</span>
  </div>
  <input type="text" class="form-control">
  <input type="text" class="form-control">
</div>

function addParseOptions() {
    var input_div = document.createElement("div");
    input_div.setAttribute('class', 'input-group mb-3');
    input_div.setAttribute('id', 'input_div');
    var inner_input_div = document.createElement("div");
    inner_input_div.setAttribute('class', 'input-group-prepend');
    inner_input_div.setAttribute('id', 'inner_input_div');
    var input_span = document.createElement("span");
    input_span.setAttribute('class', 'input-group-text');
    input_span.setAttribute('id', 'inputGroup-sizing-default');
    var input_box = document.createElement("input");
    input_box.setAttribute('type', 'text');
    input_box.setAttribute('class', 'form-control');
    input_box.setAttribute('aria-label', 'Default');
    input_box.setAttribute('aria-describedby', 'inputGroup-sizing-default');
    var parse_option_div = document.createElement("div");
    parse_option_div.setAttribute('class','container');
    parse_option_div.setAttribute('id','parse_option');
    var button = document.createElement("button");
    var breakpoint = document.createElement("br");
    button.setAttribute('id', 'parse');
    button.setAttribute('class', 'btn btn-outline-secondary');
    button.setAttribute('type', 'button');
    button.setAttribute('style', 'float: right');
    $('.jumbotron').append(breakpoint);
    $('.jumbotron').append(parse_option_div);
    $('#parse_option').append(input_div);
    $('#input_div').append(inner_input_div);
    $('#inner_input_div').append(input_span);
    $('#input_div').append(input_box);
    $('#parse_option').append(button);
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
        if (results["data"].length <= 15){
            console.log("Parsed result:\n" + results["data"]);
        } else {
            console.log("Results too long to be logged");
        }
        alert_complete();
    };
    reader.readAsText(files[0]);
}

function alert_complete() {
    $('#alert-bar').attr("class", "alert alert-success");
    $('#alert-bar').text("Finished Parsing " + file_list[0].name);
}



function start_process(papaparse_object) { // papaparse_object -> {data: Array(4), errors: Array(1), meta: {…}}
    data_rows = papaparse_object.data.slice(1,-1);
    data_header = results.data[0];
    // add remove_specs function
    my_df = new DataFrame(data_rows, data_header); // df = new DataFrame(results["data"].slice(1,-1), results["data"][0])
    my_df.show();
}
