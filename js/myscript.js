var DataFrame = dfjs.DataFrame;
var file_list;
var file_content;
var results;
var my_df;
var my_df2;
var counter = 0;
var datumzMedianCol;
var datumzMedianCol2;
var pxsd;
var pysd;
var dnsd;
var rosd;
var sxsd;
var sysd;
var prsd;
var sd_df;
var sd_df2;
var pt;
var pt2;

function exists(id) {
    if (document.getElementById(id) === null){
        return false;
    }
    return true;
}
const fileSelector = $('#inputFile');
fileSelector.change(function (event) {
    if (exists("input_group")) {
        $("#input_group").remove();
    }
    if (exists("progress_div")) {
        $("#progress_div").remove();
    }
    file_list = event.target.files;
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
        driver();
    })
}
function alert_complete() {
    $('#alert-bar').attr("class", "alert alert-success");
    $('#alert-bar').text("Finished Parsing " + file_list[0].name);
}
function add_progress_bar() {
    var progress_div = document.createElement('div');
    progress_div.setAttribute('class', 'alert alert-info myprogress');
    progress_div.setAttribute('id', 'progress_div');
    progress_div.setAttribute('role', 'alert');
    $('.main').append(progress_div);
    $('#progress_div').text('Processing...');
}
function readFileAsString(files) {
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
function getDf(parsed_object, input1) {
    data_rows = parsed_object.data.slice(input1 + 1,-1);
    data_header = parsed_object.data[input1];
    df = new DataFrame(data_rows, data_header);
    return df;
}
function filterNewestRun(df, n) {
    lst = df.unique("Reproducibility Run").toArray();
    return df.filter(row => row.get('Reproducibility Run') >= Number(lst[lst.length - n][0]));
}
function filtermeasState(df) {
    return df.filter(row => row.get('Meas State') == 10 || row.get('Meas State') == 30);
}
function filtermeasState2(df) {
    return df.filter(row => row.get('Meas State') == 10);
}
function median(arr) {
    const mid = Math.floor(arr.length / 2);
    const nums = arr.sort();
    return arr.length % 2 !== 0 ? Number(nums[mid]) : (Number(nums[mid - 1]) + Number(nums[mid])) / 2;
}
function calGroupMedian(groupCollection, groupNumber) {
    var col = groupCollection[groupNumber]['group'].select('Datum Z [mm]').toArray();
    col = [].concat.apply([], col);
    var shell_list = new Array(col.length);
    shell_list.fill(median(col));
    return shell_list;
}
function getMedianCol(df) {
    var res_row = [];
    var collection = df.groupBy('Reproducibility Run').toCollection();
    for (var i = 0; i < collection.length; i++) {
        console.log("Calculating Median for group " + (i+1) + "...");
        res_row = res_row.concat(calGroupMedian(collection, i));
    }
    return res_row;
}
function datumMedianHelper() {
    var res = counter;
    counter = counter + 1;
    return datumzMedianCol[res];
}
function datumNormFunc(row) {
    const a = new BigNumber(row.get('Datum Z [mm]'));
    const b = new BigNumber(row.get('Datum Z Median'));
    return a.minus(b).toFixed();
}
function radOffsetHelper(row) {
    const a = new BigNumber(row.get('Offset X [mm]'));
    const b = new BigNumber(row.get('Offset Y [mm]'));
    return a.pow(2).plus(b.pow(2)).squareRoot().toFixed();
}
function getInput1() {
    var res = 0;
    if ($("#input_box1").val() === ""){
        res = 7;
    }else{ res = Number($("#input_box1").val()); }
    return res;
}
function getInput2() {
    var res = 0;
    if ($("#input_box2").val() === ""){
        res = 10;
    }else{ res = Number($("#input_box2").val()); }
    return res;
}
function getMean(groupData, header){
    var sdDf = new DataFrame(groupData.toCollection(), ['Probe ID', header]);
    return sdDf.stat.mean(header);
}
function getSd(df) {
    pxsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Offset X [mm]')).rename('aggregation', 'Offset X Standard Deviation');
    var a = getMean(pxsd, 'Offset X Standard Deviation');
    pysd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Offset Y [mm]')).rename('aggregation', 'Offset Y Standard Deviation');
    var b = getMean(pysd, 'Offset Y Standard Deviation');
    dnsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Datum Norm')).rename('aggregation', 'Datum Norm Standard Deviation');
    var c = getMean(dnsd, 'Datum Norm Standard Deviation');
    rosd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Rad Offset')).rename('aggregation', 'Rad Offset Standard Deviation');
    var d = getMean(rosd, 'Rad Offset Standard Deviation');
    var resDf = new DataFrame([[a, b, c, d]], ['Offset X Standard Deviation', 'Offset Y Standard Deviation', 'Datum Norm Standard Deviation', 'Rad Offset Standard Deviation']);
    return resDf;
}
function getSd2(df){
    sxsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Size X [mm]')).rename('aggregation', 'Size X Standard Deviation');
    var a = getMean(sxsd, 'Size X Standard Deviation');
    sysd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Size Y [mm]')).rename('aggregation', 'Size Y Standard Deviation');
    var b = getMean(sysd, 'Size Y Standard Deviation');
    prsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Pos R [deg]')).rename('aggregation', 'Pos R Standard Deviation');
    var c = getMean(prsd, 'Pos R Standard Deviation');
    var resDf = new DataFrame([[a, b, c]], ['Size X Standard Deviation', 'Size Y Standard Deviation', 'Pos R Standard Deviation']);
    return resDf;
}
function getPtNum(mean, constant){
    return mean * 6 / constant;
}
function getPt(meanArr) {
    var res = [];
    for (var i = 0; i < 4; i++){
        if (i === 0 || i === 1){
            res[i] = getPtNum(meanArr[i], 0.028);
        }else if (i === 2){
            res[i] = getPtNum(meanArr[i], 0.035);
        }else if (i === 3){
            res[i] = getPtNum(meanArr[i], 0.02);
        }
    }
    return res;
}
function getPt2(meanArr){
    var res = [];
    for (var i = 0; i < 3; i++){
        if (i === 0 || i === 1){
            res[i] = getPtNum(meanArr[i], 0.008);
        }else if (i === 2){
            res[i] = getPtNum(meanArr[i], 9);
        }
    }
    return res;
}
function getFailed(arr){
    console.log("The following items failed: ")
    forEach((item, i) => {
        if (item === 0){
            console.log("Offset X");
        }else if (item === 1){
            console.log("Offset Y");
        }else if (item === 2){
            console.log("Datum Norm");
        }else{
            console.log("Rad Offset");
        }
    });
}
function getRerun(arr){
    console.log("The following items needs rerun: ")
    forEach((item, i) => {
        if (item === 0){
            console.log("Offset X");
        }else if (item === 1){
            console.log("Offset Y");
        }else if (item === 2){
            console.log("Datum Norm");
        }else{
            console.log("Rad Offset");
        }
    });
}
function getStatus(ptResult1, ptResult2) {
    var fail = [];
    var rerun = [];
    var success = [];
    for (var i = 0; i < 4; i++) {
        if (ptResult1[i] >= 0.3){
            fail.push(i);
        }else if (ptResult1[i] >= 0.15){
            rerun.push(i);
        }else{
            success.push(i);
        }
    }
    for (var i = 0; i < 3; i++) {
        if (ptResult2[i] >= 0.3){
            fail.push(i);
        }else{
            success.push(i);
        }
    }
    if (fail.length > 0){
        console.log("FAIL");
        getFailed(fail);
    } else if (rerun.length > 0) {
        console.log("RUN REPEATABILITY AGAIN");
        getRerun(rerun);
    } else {
        console.log("PASS");
    }
}
function driver() {
    my_df = getDf(results, getInput1()); // create DataFrame 5

    my_df = filterNewestRun(my_df, getInput2()); // filter last 10 Reproducibility Run 10

    my_df = filtermeasState(my_df); // filter out 0s and blanks 15
    my_df2 = filtermeasState2(my_df);

    datumzMedianCol = getMedianCol(my_df); // get collumn for Median 30
    datumzMedianCol2 = getMedianCol(my_df2);

    my_df = my_df.withColumn('Datum Z Median', datumMedianHelper); counter = 0; // Generate new Collumn for Median 50

    my_df = my_df.withColumn('Datum Norm', datumNormFunc); // Generate new Collumn for Norm 70

    my_df = my_df.withColumn('Rad Offset', radOffsetHelper); // Generate new Collumn for Rad Offset 100

    sd_df = getSd(my_df);
    sd_df2 = getSd2(df2);

    pt = getPt(sd_df.toArray()[0]);
    pt2 = getPt2(sd_df2.toArray()[0]);

    getStatus(pt, pt2);
}
