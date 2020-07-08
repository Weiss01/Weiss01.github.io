var DataFrame = dfjs.DataFrame;
var file_list;
var file_content;
var results;
var my_df;
var my_df2;
var counter = 0;
var medianCol;
var medianCol2;
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
var status;
var fail = [];
var fail2 = [];
var rerun = [];
var success = [];

function cleanup() {
    if (exists("list_div")) {
        $("#list_div").remove();
    }
    if (exists("progress_div")) {
        $("#progress_div").remove();
    }
    if (exists("results_div")) {
        $("#results_div").remove();
    }
    if (exists("status_bar")) {
        $("#status_bar").remove();
    }
    if (exists("status_bp")) {
        $("#status_bp").remove();
    }
    if (exists("alert-bar")){
        $('#alert-bar').remove();
    }
    if (exists("results_div")){
        $('#results_div').remove();
    }
    if (exists("alert_bp")){
        $('#alert_bp').remove();
    }
    if (exists("parse")){
        $("#parse").remove();
    }
    document.getElementById("inputFile").value = "";
    $(".custom-file-label").text("Choose file");
}
function exists(id) {
    if (document.getElementById(id) === null){
        return false;
    }
    return true;
}
const link1 = $('#link1');
link1.click(function (event) {
    $('.display-4').text("OA Reproducibility Data Analysis");
    cleanup();
})
const link2 = $('#link2');
link2.click(function (event) {
    $('.display-4').text("OA Repeatability Data Analysis");
    cleanup();
})
const link3 = $('#link3');
link3.click(function (event) {
    $('.display-4').text("EP Reproducibility Data Analysis");
    cleanup();
})
const fileSelector = $('#inputFile');
fileSelector.change(function (event) {
    if (exists("input_group")) {
        $("#input_group").remove();
    }
    if (exists("progress_div")) {
        $("#progress_div").remove();
    }
    if (exists("results_div")) {
        $("#results_div").remove();
    }
    if (exists("status_bar")) {
        $("#status_bar").remove();
    }
    if (exists("status_bp")) {
        $("#status_bp").remove();
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
    breakpoint.setAttribute('id', 'alert_bp');
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
        add_progress_bar();
        if ($('.display-4').text() === "OA Reproducibility Data Analysis"){
            setTimeout(() => { oa1(); }, 1000);
        } else if ($('.display-4').text() === "OA Repeatability Data Analysis") {
            setTimeout(() => { oa2(); }, 1000);
        } else if ($('.display-4').text() === "EP Reproducibility Data Analysis") {
            setTimeout(() => { ep(); }, 1000);
        }
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
function filterNewestRun(df, n, col) {
    lst = df.unique(col).toArray();
    return df.filter(row => row.get(col) >= Number(lst[lst.length - n][0]));
}
function filtermeasState(df) {
    return df.filter(row => row.get('Meas State') == 10 || row.get('Meas State') == 30);
}
function filtermeasState2(df) {
    return df.filter(row => row.get('Meas State') == 10);
}
function filterStep(df) {
    return df.filter(row => row.get('Step') == "Calc results");
}
function median(arr) {
    const mid = Math.floor(arr.length / 2);
    const nums = arr.map(Number).sort((a, b) => a-b);
    return arr.length % 2 !== 0 ? Number(nums[mid]) : (Number(nums[mid - 1]) + Number(nums[mid])) / 2;
}
function calGroupMedian(groupCollection, groupNumber, colVal) {
    var col = groupCollection[groupNumber]['group'].select(colVal).toArray();
    col = [].concat.apply([], col);
    var shell_list = new Array(col.length);
    shell_list.fill(median(col));
    return shell_list;
}
function getMedianCol(df, groupCol, valCol) {
    var res_row = [];
    var collection = df.groupBy(groupCol).toCollection();
    for (var i = 0; i < collection.length; i++) {
        console.log("Calculating Median for group " + (i+1) + "...");
        res_row = res_row.concat(calGroupMedian(collection, i, valCol));
    }
    return res_row;
}
function medianHelper() {
    var res = counter;
    counter = counter + 1;
    return medianCol[res];
}
function datumNormFunc(row) {
    const a = new BigNumber(row.get('Datum Z [mm]'));
    const b = new BigNumber(row.get('Datum Z Median'));
    return a.minus(b).toFixed();
}
function heightNormHelper(row) {
    const a = new BigNumber(row.get('Final height [�m]')); // check if charcode working
    const b = new BigNumber(row.get('Final Height Median'));
    return a.minus(b).toFixed();
}
function radOffsetHelper(row) {
    const a = new BigNumber(row.get('Offset X [mm]'));
    const b = new BigNumber(row.get('Offset Y [mm]'));
    return a.pow(2).plus(b.pow(2)).squareRoot().toFixed();
}
function getInput1() {
    var res = 0;
    if ($("#input_box1").val() === "") {
        res = 7;
    }else{ res = Number($("#input_box1").val()); }
    return res;
}
function getInput2() {
    var res = 0;
    if ($("#input_box2").val() === "") {
        res = 10;
    }else{ res = Number($("#input_box2").val()); }
    return res;
}
function getMean(groupData, header) {
    var sdDf = new DataFrame(groupData.toCollection(), ['Probe ID', header]);
    return sdDf.stat.mean(header);
}
function getSd(df, completeProbes) { // count EP : D
    pxsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Offset X [mm]')).rename('aggregation', 'Offset X Standard Deviation');
    pxsd = pxsd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var a = getMean(pxsd, 'Offset X Standard Deviation');
    pysd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Offset Y [mm]')).rename('aggregation', 'Offset Y Standard Deviation');
    pysd = pysd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var b = getMean(pysd, 'Offset Y Standard Deviation');
    dnsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Datum Norm')).rename('aggregation', 'Datum Norm Standard Deviation');
    dnsd = dnsd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var c = getMean(dnsd, 'Datum Norm Standard Deviation');
    rosd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Rad Offset')).rename('aggregation', 'Rad Offset Standard Deviation');
    rosd = rosd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var d = getMean(rosd, 'Rad Offset Standard Deviation');
    var resDf = new DataFrame([[a, b, c, d]], ['Offset X Standard Deviation', 'Offset Y Standard Deviation', 'Datum Norm Standard Deviation', 'Rad Offset Standard Deviation']);
    return resDf;
}
function getSd2(df, completeProbes) {
    sxsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Size X [mm]')).rename('aggregation', 'Size X Standard Deviation');
    console.log(sxsd.toArray());
    sxsd = sxsd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var a = getMean(sxsd, 'Size X Standard Deviation');
    sysd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Size Y [mm]')).rename('aggregation', 'Size Y Standard Deviation');
    console.log(sysd.toArray());
    sysd = sysd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var b = getMean(sysd, 'Size Y Standard Deviation');
    prsd = df.groupBy('Probe ID').aggregate(group => group.stat.sd('Pos R [deg]')).rename('aggregation', 'Pos R Standard Deviation');
    prsd = prsd.filter(row => completeProbes.includes(row.get('Probe ID')));
    var c = getMean(prsd, 'Pos R Standard Deviation');
    var resDf = new DataFrame([[a, b, c]], ['Size X Standard Deviation', 'Size Y Standard Deviation', 'Pos R Standard Deviation']);
    return resDf;
}
function getSdEp(df, completeProbes) { // nCount.filter(row => row.get('nrows') == k);
    fhsd = df.groupBy('Probe Id').aggregate(group => group.stat.sd('Final Height Norm')).rename('aggregation', 'Final Height Norm Standard Deviation');
    fhsd = fhsd.filter(row => completeProbes.includes(row.get('Probe Id')));
    var a = getMean(fhsd, 'Final Height Norm Standard Deviation');
    var resDf = new DataFrame([[a]], ['Final Height Norm Standard Deviation']);
    return resDf;
}
function nRowFilterEp(df, k) {
    var nCount = df.groupBy('Probe Id').aggregate(group => group.count()).rename('aggregation', 'nrows');
    var probeswithk =  nCount.filter(row => row.get('nrows') == k);
    return [].concat.apply([], probeswithk.select('Probe Id').toArray());
}
function nRowFilterOa(df, k) {
    var nCount = df.groupBy('Probe ID').aggregate(group => group.count()).rename('aggregation', 'nrows');
    var probeswithk =  nCount.filter(row => row.get('nrows') == k);
    return [].concat.apply([], probeswithk.select('Probe ID').toArray());
}
function getPtNum(mean, constant) {
    return mean * 6 / constant;
}
function getPt(meanArr) {
    var res = [];
    for (var i = 0; i < 4; i++) {
        if (i === 0 || i === 1) {
            res[i] = getPtNum(meanArr[i], 0.028);
        }else if (i === 2) {
            res[i] = getPtNum(meanArr[i], 0.035);
        }else if (i === 3) {
            res[i] = getPtNum(meanArr[i], 0.02);
        }
    }
    return res;
}
function getPt2(meanArr) {
    var res = [];
    for (var i = 0; i < 3; i++) {
        if (i === 0 || i === 1) {
            res[i] = getPtNum(meanArr[i], 0.008);
        }else if (i === 2) {
            res[i] = getPtNum(meanArr[i], 9);
        }
    }
    return res;
}
function getFailed(arr){
    console.log("The following items failed: ")
    fail.forEach((item, i) => {
        if (item === 0) {
            console.log("Offset X");
        }else if (item === 1) {
            console.log("Offset Y");
        }else if (item === 2) {
            console.log("Datum Norm");
        }else {
            console.log("Rad Offset");
        }
    });
}
function getFailed2(arr){
    console.log("The following items failed: ")
    fail2.forEach((item, i) => {
        if (item === 0) {
            console.log("Size X");
        }else if (item === 1) {
            console.log("Size Y");
        }else {
            console.log("Pos R");
        }
    });
}
function getRerun(arr){
    console.log("The following items needs rerun: ")
    rerun.forEach((item, i) => {
        if (item === 0){
            console.log("Offset X");
        }else if (item === 1) {
            console.log("Offset Y");
        }else if (item === 2) {
            console.log("Datum Norm");
        }else {
            console.log("Rad Offset");
        }
    });
}
function getStatusOa(ptResult1, ptResult2) {
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
        if (ptResult2[i] >= 0.30){
            fail2.push(i);
        }else{
            success.push(i);
        }
    }
    if (fail.length > 0){
        status = "FAIL";
        console.log("FAIL");
        getFailed(fail);
    } else if (fail2.length > 0) {
        status = "FAIL";
        console.log("FAIL");
        getFailed2(fail2);
    } else if (rerun.length > 0) {
        status = "RUN REPEATABILITY AGAIN";
        console.log("RUN REPEATABILITY AGAIN");
        getRerun(rerun);
    } else {
        status = "PASS";
        console.log("PASS");
    }
}
function getStatusOa2(ptResult1, ptResult2) {
    for (var i = 0; i < 4; i++) {
        if (ptResult1[i] >= 0.15) {
            fail.push(i);
        } else {
            success.push(i);
        }
    }
    for (var i = 0; i < 3; i++) {
        if (ptResult2[i] >= 0.15) {
            fail2.push(i);
        } else {
            success.push(i);
        }
    }
    if (fail.length > 0){
        status = "FAIL";
        console.log("FAIL");
        getFailed(fail);
    } else if (fail2.length > 0) {
        status = "FAIL";
        console.log("FAIL");
        getFailed2(fail);
    } else {
        status = "PASS";
        console.log("PASS");
    }
}
function getStatusEp(pt) {
    if (pt > 0.3) {
        status = "FAIL";
        console.log("FAIL");
    }else {
        status = "PASS";
        console.log("PASS");
    }
}
function generateThOa() {
    addHeader("Offset X (P/T)");
    addHeader("Offset Y (P/T)");
    addHeader("Datum Norm (P/T)");
    addHeader("Rad Offset (P/T)");
    addHeader("Size X (P/T)");
    addHeader("Size Y (P/T)");
    addHeader("Pos R (P/T)");
}
function generateItemOa() {
    addItem(pt[0]);
    addItem(pt[1]);
    addItem(pt[2]);
    addItem(pt[3]);
    addItem(pt2[0]);
    addItem(pt2[1]);
    addItem(pt2[2]);
}
function generateThEp(){
    addHeader("Final Height (P/T)");
}
function generateItemEp() {
    addItem(pt);
}
function showResult(headFunc, itemFunc) {
    $("#input_group").remove();
    $('#alert-bar').text("Finished Processing " + file_list[0].name);
    var results_div = document.createElement('div');
    results_div.setAttribute('class', 'container results');
    results_div.setAttribute('id', 'results_div');
    var table = document.createElement('table');
    table.setAttribute('class', 'table table-hover table-dark');
    var table_head = document.createElement('thead');
    table_head.setAttribute('id','table_head');
    var table_body = document.createElement('tbody');
    table_body.setAttribute('id', 'table_body');
    var head_row = document.createElement('tr');
    head_row.setAttribute('id', 'head_row');
    var body_row = document.createElement('tr');
    body_row.setAttribute('id', 'body_row');
    $('.jumbotron').append(results_div);
    $('.results').append(table);
    $('.table').append(table_head);
    $('.table').append(table_body);
    $('#table_head').append(head_row);
    headFunc();
    $('#table_body').append(body_row);
    itemFunc();
    var bp = document.createElement('br');
    bp.setAttribute("id", "status_bp");
    var status_bar = document.createElement('div');
    status_bar.setAttribute('class', 'alert alert-info status');
    status_bar.setAttribute('id', 'status_bar');
    status_bar.setAttribute('role', 'alert');
    $('.results').append(bp);
    $('.results').append(status_bar);
    $('#status_bar').html("<strong>" + status + "</strong>");
    if (status === "FAIL") {
        generatefailListOA();
    }else if (status === "RUN REPEATABILITY AGAIN") {
        generatererunListOA();
    }
}
function addHeader(content) {
    var head_item = document.createElement('th');
    head_item.setAttribute('scope', 'col');
    head_item.innerHTML = content;
    $('#head_row').append(head_item);
}
function addItem(content) {
    var body_item = document.createElement('th');
    body_item.innerHTML = Number.parseFloat(content).toFixed(10);
    $('#body_row').append(body_item);
}
function addListDiv() {
    var list_div = document.createElement('div');
    list_div.setAttribute('class', 'container');
    list_div.setAttribute('id', 'list_div');
    var bp = document.createElement('br')
    bp.setAttribute('id', 'list_bp');
    var list_alert = document.createElement('div');
    list_alert.setAttribute('class', 'alert alert-warning listbox');
    list_alert.setAttribute('role', 'alert');
    list_alert.setAttribute('id', 'list_alert');
    var un_list = document.createElement('ul');
    un_list.setAttribute('class', 'list-group');
    un_list.setAttribute('id', 'un_list');
    $('.jumbotron').append(list_div);
    $('#list_div').append(bp);
    $('#list_div').append(list_alert);
    $('#list_alert').append(un_list);
}
function addItemListDiv(content) {
    var item = document.createElement('li');
    item.setAttribute('class', 'list-group-item');
    item.innerHTML =  content;
    $('#un_list').append(item);
}
function generatefailListOA() {
    addListDiv();
    fail.forEach((item, i) => {
        if (item === 0) {
            addItemListDiv("Offset X");
        }else if (item === 1) {
            addItemListDiv("Offset Y");
        }else if (item === 2) {
            addItemListDiv("Datum Norm");
        }else {
            addItemListDiv("Rad Offset");
        }
    });
    fail2.forEach((item, i) => {
        if (item === 0) {
            addItemListDiv("Size X");
        }else if (item === 1) {
            addItemListDiv("Size Y");
        }else {
            addItemListDiv("Pos R");
        }
    });
}
function generatererunListOA() {
    addListDiv();
    rerun.forEach((item, i) => {
        if (item === 0){
            addItemListDiv("Offset X");
        }else if (item === 1) {
            addItemListDiv("Offset Y");
        }else if (item === 2) {
            addItemListDiv("Datum Norm");
        }else {
            addItemListDiv("Rad Offset");
        }
    });
}
function oa1() {
    console.log("Initiating MODE OA1");
    console.log("Creating DataFrame...");
    my_df = getDf(results, getInput1()); // create DataFrame 5

    console.log("Filtering last " + getInput2() + " Reproducibility Run...");
    my_df = filterNewestRun(my_df, getInput2(), 'Reproducibility Run'); // filter last 10 Reproducibility Run 10

    console.log("Removing 0s and Blanks...");
    my_df = filtermeasState(my_df); // filter out 0s and blanks 15
    my_df2 = filtermeasState2(my_df);

    medianCol = getMedianCol(my_df, 'Reproducibility Run', 'Datum Z [mm]'); // get collumn for Median 30

    console.log("Generating Median Column...");
    my_df = my_df.withColumn('Datum Z Median', medianHelper); counter = 0; // Generate new Collumn for Median 50

    console.log("Generating Datum Norm Column...");
    my_df = my_df.withColumn('Datum Norm', datumNormFunc); // Generate new Collumn for Norm 70

    console.log("Generating Rad Offset Column...");
    my_df = my_df.withColumn('Rad Offset', radOffsetHelper); // Generate new Collumn for Rad Offset 100

    console.log("Filtering Rows without Complete Ks...");
    completeProbes = nRowFilterOa(my_df, getInput2()); // get list of probe ids with complete Ks
    completeProbes2 = nRowFilterOa(my_df2, getInput2());

    console.log("Calculating Standard Deviation...");
    sd_df = getSd(my_df, completeProbes);
    sd_df2 = getSd2(my_df2, completeProbes2);

    console.log("Calculating P/T...");
    pt = getPt(sd_df.toArray()[0]);
    pt2 = getPt2(sd_df2.toArray()[0]);

    console.log("Evaluating Status...");
    getStatusOa(pt, pt2);

    console.log("Processing Complete!");

    $('#progress_div').remove();

    showResult(generateThOa, generateItemOa);
}
function oa2() {
    console.log("Initiating MODE OA2");
    console.log("Creating DataFrame...");
    my_df = getDf(results, getInput1()); // create DataFrame

    console.log("Filtering last " + getInput2() + " Repeatability Run...");
    my_df = filterNewestRun(my_df, getInput2(), 'Repeatability Run'); // filter last 10 Reproducibility Run

    console.log("Removing 0s and Blanks...");
    my_df = filtermeasState(my_df); // filter out 0s and blanks
    my_df2 = filtermeasState2(my_df);

    medianCol = getMedianCol(my_df, 'Repeatability Run', 'Datum Z [mm]'); /////////////////////////////////////SUBJECT TO CHANGE///////

    console.log("Generating Median Column...");
    my_df = my_df.withColumn('Datum Z Median', medianHelper); counter = 0; // Generate new Collumn for Median

    console.log("Generating Datum Norm Column...");
    my_df = my_df.withColumn('Datum Norm', datumNormFunc); // Generate new Collumn for Norm

    console.log("Generating Rad Offset Column...");
    my_df = my_df.withColumn('Rad Offset', radOffsetHelper); // Generate new Collumn for Rad Offset

    console.log("Filtering Rows without Complete Ks...");
    completeProbes = nRowFilterOa(my_df, getInput2()); // get list of probe ids with complete Ks
    completeProbes2 = nRowFilterOa(my_df2, getInput2());

    console.log("Calculating Mean and Standard Deviation...");
    sd_df = getSd(my_df, completeProbes);
    sd_df2 = getSd2(my_df2, completeProbes2);

    console.log("Calculating P/T...");
    pt = getPt(sd_df.toArray()[0]);
    pt2 = getPt2(sd_df2.toArray()[0]);

    console.log("Evaluating Status...");
    getStatusOa2(pt, pt2); /////////////////////////////////////SUBJECT TO CHANGE//////////////////////////////////////////////////////////

    console.log("Processing Complete!");
    $('#progress_div').remove();

    showResult(generateThOa, generateItemOa);
}
function ep() {
    console.log("Initiating MODE EP");
    console.log("Creating DataFrame...");
    my_df = getDf(results, getInput1()); // create DataFrame

    console.log("Filtering last " + getInput2() + " Reproducibility Run...");
    my_df = filterNewestRun(my_df, getInput2(), 'Reproducibility Run'); // filter last 10 Reproducibility Run

    console.log("Filtering Steps...");
    my_df = filterStep(my_df); // filter Step == "Calc Result"

    medianCol = getMedianCol(my_df, 'Reproducibility Run', 'Final height [�m]'); // get collumn for Median

    console.log("Generating Median Column...");
    my_df = my_df.withColumn('Final Height Median', medianHelper); counter = 0; // Generate new Collumn for Median

    console.log("Generating Final Height Norm Column...");
    my_df = my_df.withColumn('Final Height Norm', heightNormHelper); // Generate new Collumn for Norm

    console.log("Filtering Rows without Complete Ks...");
    completeProbes = nRowFilterEp(my_df, getInput2()); // get list of probe ids with complete Ks

    console.log("Calculating Mean and Standard Deviation...");
    my_df = getSdEp(my_df, completeProbes); // get mean of sd of final height

    console.log("Calculating P/T...");
    pt = getPtNum(my_df.toArray()[0] * 0.83, 35);

    console.log("Evaluating Status...");
    getStatusEp(pt);

    console.log("Processing Complete!");
    $('#progress_div').remove();

    showResult(generateThEp, generateItemEp);
}
