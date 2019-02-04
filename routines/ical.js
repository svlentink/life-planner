/* @license GPLv3 */
//https://github.com/sebbo2002/ical-generator
import ical from 'ical-generator';

(function (glob) { // IIFE pattern
  'use strict';
  
  var cal = ical({
    domain: 'lent.ink',
    prodId: {company: 'lent.ink', product: 'Life-Planner'},
    name: 'exported-routines'
  })
  
  glob.getIcal = function () {
    if (! cal.length()) {
      var events = glob.getEvents()
      for (var i in events){
        var ev = events[i]
        cal.createEvent(ev)
      }
    }
    return cal
  }

  glob.saveIcal2File = function() {
    var cal = glob.getIcal()
    var filename = 'routines.ical'
    saveToFile(cal.toString(), filename)
  }
  
  function saveToFile(inp, filename) { //https://stackoverflow.com/questions/21479107/saving-html5-textarea-contents-to-file
    var textFileAsBlob = new Blob([ inp ], { type: 'text/plain' });
  
    var downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }



}(typeof window !== 'undefined' ? window : global))
