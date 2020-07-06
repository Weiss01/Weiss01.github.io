var DataFrame = dfjs.DataFrame;
const fileSelector = $('#inputFile');
var file_list;
var my_file;
var file_content;
var results;
var my_df;
var lastk_df;
var cleaned_df;

function exists(id) {
    var temp = document.getElementById(id);
    if (temp === null){
    return false;
    } else {
    return true;
    }
}

fileSelector.change(function (event) {
    if (exists("input_group")){
        $("#input_group").remove();
    }
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


function addParseOptions() {
    var button = document.createElement("button");
    button.setAttribute('id', 'parse');
    button.setAttribute('class', 'btn btn-outline-secondary');
    button.setAttribute('type', 'button');
    $('.jumbotron').append(button);
    $('#parse').html("Parse");
    parse_button = $("#parse");

    parse_button.click(function () {
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
        $('#parse').remove();
        add_input_group();
        alert_complete();
    };
    reader.readAsText(files[0]);
}

function add_input_group() {
    var input_group = document.createElement("div");
    input_group.setAttribute('id', 'input_group');
    var breakpoint = document.createElement("br");
    var button = document.createElement("button");
    button.setAttribute('id', 'process');
    button.setAttribute('class', 'btn btn-outline-secondary');
    button.setAttribute('type', 'button');
    var input_div = document.createElement("div");
    input_div.setAttribute('class', 'input-group');
    input_div.setAttribute('id', 'input_div');
    var input_box1 = document.createElement("input");
    input_box1.setAttribute('type', 'text');
    input_box1.setAttribute('class', 'form-control');
    input_box1.setAttribute('id', 'input_box1');
    input_box1.setAttribute('placeholder', 'Lines to Remove');
    var input_box2 = document.createElement("input");
    input_box2.setAttribute('type', 'text');
    input_box2.setAttribute('class', 'form-control');
    input_box2.setAttribute('id', 'input_box2');
    input_box2.setAttribute('placeholder', 'Last k Reproducibility Run');
    var input_box3 = document.createElement("input");
    input_box3.setAttribute('type', 'text');
    input_box3.setAttribute('class', 'form-control');
    input_box3.setAttribute('id', 'input_box3');
    $('.jumbotron').append(input_group);
    $('#input_group').append(input_div);
    $('#input_div').append(input_box1);
    $('#input_div').append(input_box2);
    $('#input_div').append(input_box3);
    $('#input_group').append(breakpoint);
    $('#input_group').append(button);
    $('#process').html("Process!");
    process_button = $('#process');

    process_button.click(function () {
        console.log("Processing....");
        start_process(results);
    })
}

function alert_complete() {
    $('#alert-bar').attr("class", "alert alert-success");
    $('#alert-bar').text("Finished Parsing " + file_list[0].name);
}


function get_remove_n() {
    var res = 0;
    if ($("#input_box1").val() === ""){
        res = 7;
    }else{
        res = Number($("#input_box1").val());
    }
    return res;
}

function get_lastk_n() {
    var res = 0;
    if ($("#input_box2").val() === ""){
        res = 10;
    }else{
        res = Number($("#input_box2").val());
    }
    return res;
}

function last_k(df, n) {
    lst = df.unique("Reproducibility Run").toArray();
    // if (n > lst.length) {
    //     // error message
    // }
    return df.filter(row => row.get('Reproducibility Run') >= Number(lst[lst.length - n][0]));
}

function filter_meas_state(df) {
    return df.filter(row => row.get('Meas State') == 10 || row.get('Meas State') == 30);
}

function start_process(papaparse_object) { // papaparse_object -> {data: Array(4), errors: Array(1), meta: {…}}
    var remove_n = get_remove_n();
    data_rows = papaparse_object.data.slice(remove_n + 1,-1);
    data_header = results.data[remove_n];
    my_df = new DataFrame(data_rows, data_header); // df = new DataFrame(results["data"].slice(1,-1), results["data"][0])

    lastk_n = get_lastk_n();
    lastk_df = last_k(my_df, lastk_n);

    cleaned_df = filter_meas_state(lastk_df);

    // cleaned_df.show();
    console.log("File Successfully Processed!");
}
