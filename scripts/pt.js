 // Click on the header to make it go away and display the main content.
// Anonymous callback functions used - 1 after Animate and inside that, another after Hide
function headerClick(){
  var up = parseFloat($(this).css("top")) + parseFloat($(this).css("height"));
  up = "-" + up + "px";
  $(this).animate({
    top: up
  }, 1000, function(){
    $(this).hide(1, function(){
      $('#right').show();
      $('#left').show();
      prepData();
    });
  })
}

function prepData(){
// data was pre-processed to make it one long string. Each element data is demarcated by a "|". So split it using "|" while reading
  var ptElem    = ptdata.split('|');
  var ptHistory = pthist.split('|');

  var temp  = [];
  var pt    = [];
  var ph    = [];
  var ptobj = {};
  var phobj = {};
  
// Headers for main data and history file
  var ptHead     = ["num","sym","name","mass","colr","elec","eneg","rad","irad","vrad","ieng","aeng","oxi","std","bond","mp","bp","dens","metal","year"];
  var ptHistHead = ["num","sym","name","year","disc","hist"];

// Convert the main csv file data into an array of objects, each object having data for 1 element
// Store this for further use using .data() within the 'main' element
  for (var i = 0; i < ptElem.length; i++){
  
    temp = ptElem[i];

    if (temp.split('"').length > 1){
      temp    = temp.split('"');
      temp[1] = "|" + temp[1].replace(/,/g,'|') + "|";
      temp    = temp.join('');
    }

    $.map(temp.split(","), function(e, idx){
      ptobj[ptHead[idx]] = ((e) ? e : "N/A");
    })

    pt.push(ptobj);
    ptobj = {};
  }
  $('main').data("pt", pt);

  loadData(pt);

// Convert the history csv file data into an array of objects, each object having data for 1 element
// Store this for further use using .data() within the 'main' element
// This can be further refactored by moving this conversion step into its own function and calling it with parameters
  for (var i = 0; i < ptHistory.length; i++){
  
    temp = ptHistory[i];

    if (temp.split('"').length > 1){
      temp    = temp.split('"');
      temp[1] = temp[1].replace(/,/g,'|');
      temp    = temp.join('');
    }

    $.map(temp.split(","), function(e, idx){
      phobj[ptHistHead[idx]] = ((e) ? e : "N/A");
    })

    ph.push(phobj);
    phobj = {};
  }
  $('main').data('ph', ph);  
}


// Pick the Number, Symbol and Name of each element and display them in their position on the table.
function loadData(eData){
  var len;

  $.map(eData,function(eObj, idx){
    // $('#e' + (idx+1)).html("<div class = 'top'>" + 
    //                           "<div class = 'numb'>" + eObj.num + "</div>" +
    //                           "<div class = 'symb'>" + eObj.sym + "</div>" +
    //                         "</div>" +
    //                         "<div class='bottom'>" + eObj.name + "</div>"
    //                       )
    $('#e' + (idx+1))
      .html($('<div />',{
              class: "top",
              html: $('<div />',{
                      class: "numb",
                      text: eObj.num
                    }),
              append: $('<div />',{
                      class: "symb",
                      text: eObj.sym
                    })
            }))
      .append($('<div />',{
              class: "bottom",
              text: eObj.name
            }))

// Set the font size of the name based on how long it is to make it fit inside the cell. The calculation uses the correlation -- 28 px (the wdith obtained using .innerWidth()) which can easily accomodate 8 chars @ fontsize 0.8vw
    if (eObj.name.length <= 8){
      $('#e' + (idx+1) + " .bottom").css("font-size", "0.8vw");
    } else {
      len = ((28 / eObj.name.length) / 4.375).toFixed(1);
      $('#e' + (idx+1) + " .bottom").css("font-size", len+"vw");
    }
  })
}

// function fillColor(eData){
//   $.map(eData,function(eObj, idx){
//   $('#e' + (idx+1))
//     .css({
//       "background-color": "#" + eObj.colr
//     })
//   })
// }

function eHoverIn(){
  if (($('main').data('checked')) && ($.inArray(this.id, $('main').data('checked')) >= 0)){
    // console.log("The checked array: " + $('main').data('checked'));
    // console.log("Current element: " + this.id);
    // console.log("Exist check: " + $.inArray(this.id, $('main').data('checked')));
    return;
  } else {
    var idx   = Number($(this)[0].id.slice(1))-1;
    var color = (($('main').data("pt")[idx].colr === 'N/A') ? "FFFFFF" : $('main').data("pt")[idx].colr);

    $(this).css({
                "background-color": "#"+color
                // ,"color": getContrast(color)
                });
  }
}

function eHoverOut(){
  // console.log(this.id);
  if (($('main').data('checked')) && ($.inArray(this.id, $('main').data('checked')) >= 0)){
    return;
  } else {
    $(this).css({
                "background-color": "#FFFFFF"
                // , "color": "#000000"
                });
  }
}

// getting the contrast color for text based on the background color
// Got the code from https://24ways.org/2010/calculating-color-contrast/
// Details about YIQ in https://en.wikipedia.org/wiki/YIQ#From_RGB_to_YIQ
// function getContrast(c){
//   var r = parseInt(c.substr(0,2),16);
//   var g = parseInt(c.substr(2,2),16);
//   var b = parseInt(c.substr(4,2),16);
//   var yiq = ((r * 0.500) + (g * 0.500) + (b * 0.500));
//   return ((yiq >= 128) ? "#000000" : "#FFFFFF");
// }

function showDetails(ev, ui){
  console.log("hello");
  var elem  = ui.draggable;
  var curId = elem.attr('id');
  var idx   = Number(elem.attr('id').slice(1)) - 1;

  var curElem    = $('main').data('pt')[idx];
  var curBgColor = ((curElem.colr === 'N/A') ? "#FFFFFF" : "#"+curElem.colr);
  var curColor   = ((curBgColor === '#FFFFFF') ? "#000000" : "#FFFFFF");

  var curHistElem = $('main').data('ph')[idx];

  // console.log(elem.attr('id'));
  // console.log(idx);
  // $('#right ul')
  //   .html($('<li />',{text: curElem.sym}))
  //   .append($('<li />',{text: curElem.name}))
  //   .css({"background-color": "#"+curElem.colr})

  $('#'+curId).css({"background-color": curBgColor})

  if ($('main').data('checked')){
    $('main').data('checked').push(curId);
  } else {
    $('main').data('checked',[curId]);
  }

  $('#right #element')
    .html($('<div />',{
            class: "etop",
            html: $('<div />',{
                    class: "enum",
                    text: curElem.num
                  }),
            append: $('<div />',{
                    class: "esym",
                    text: curElem.sym
                  })
          }))
    .append($('<div />',{
            class: "ebottom",
            text: curElem.name
          }))
    .css({
          "background-color": curBgColor,
          "color": curColor,
          "box-shadow": "0vw 0vw 2vw #000000"
        })

  $('#right dl')
    .html($('<dt />',{text: "Atomic Mass"}))
    .append($('<dd />',{text: curElem.mass + ((curElem.mass === 'N/A') ? "" : " g/mol")}))
    .append($('<dt />',{text: "Electron Configuration"}))
    .append($('<dd />',{text: curElem.elec}))
    .append($('<dt />',{text: "ElectroNegativity"}))
    .append($('<dd />',{text: curElem.eneg + ((curElem.eneg === 'N/A') ? "" : " Pauling")}))
    .append($('<dt />',{text: "Atomic Radius"}))
    .append($('<dd />',{text: curElem.rad + ((curElem.rad === 'N/A') ? "" : " pm")}))
    .append($('<dt />',{text: "Ion Radius"}))
    .append($('<dd />',{text: curElem.irad + ((curElem.irad === 'N/A') ? "" : " pm")}))
    .append($('<dt />',{text: "van der Waals Radius"}))
    .append($('<dd />',{text: curElem.vrad + ((curElem.vrad === 'N/A') ? "" : " pm")}))
    .append($('<dt />',{text: "Ionization Energy"}))
    .append($('<dd />',{text: curElem.ieng + ((curElem.ieng === 'N/A') ? "" : " kJ/mol")}))
    .append($('<dt />',{text: "Activation Energy"}))
    .append($('<dd />',{text: curElem.aeng + ((curElem.aeng === 'N/A') ? "" : " kJ/mol")}))
    .append($('<dt />',{text: "Oxidation States"}))
    .append($('<dd />',{text: curElem.oxi}))
    .append($('<dt />',{text: "Standard State"}))
    .append($('<dd />',{text: curElem.std}))
    .append($('<dt />',{text: "Bonding Type"}))
    .append($('<dd />',{text: curElem.bond}))
    .append($('<dt />',{text: "Melting Point"}))
    .append($('<dd />',{text: curElem.mp + ((curElem.mp === 'N/A') ? "" : " K")}))
    .append($('<dt />',{text: "Boiling Point"}))
    .append($('<dd />',{text: curElem.bp + ((curElem.bp === 'N/A') ? "" : " K")}))
    .append($('<dt />',{text: "Density"}))
    .append($('<dd />',{text: curElem.dens + ((curElem.dens === 'N/A') ? "" : " g/mL")}))
    .append($('<dt />',{text: "Metal"}))
    .append($('<dd />',{text: curElem.metal}))

  $('#right dl dd, #right dl dt')
    .css({
      "background-color": curBgColor, 
      "color": curColor,
      "box-shadow": "0vw 0vw 2vw #000000"
    })

  $('footer p')
    .text(curHistElem.hist.replace(/\|/g, ","))
    .css({
      "background-color": curBgColor,
      "color": curColor,
      "box-shadow": "0vw 0vw 2vw #000000"
    })
}

$(document).ready(function(){
  $('header').click(headerClick);
  
  $('.col-data').hover(eHoverIn,eHoverOut);

  $('.col-data').draggable({
    containment: "body",
    scroll: false,
    revert: true,
    helper: "clone",
    opacity: 0.5
  });

  $('#right').droppable({
    hoverClass: "showShadow",
    drop: function(ev, ui){showDetails(ev, ui)}
  })

  $('footer').droppable({
    hoverClass: "showShadow",
    drop: function(ev, ui){showDetails(ev, ui)}
  })
})