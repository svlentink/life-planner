/* @license GPLv3 */
import YAML from 'yamljs';

(function (glob) { // IIFE pattern
  'use strict';
  
  function renderAll(obj) {
    glob.data = obj
    var data = glob.data
    glob.renderpersonas('personas', data.personas.data)
    glob.renderfoundation('foundation', data.foundation)
    glob.renderroutines('routines', data.routines, data.activities)
    glob.rendertmm('tmm', [data.tmm, data.timemanagementmatrix])
  }
  
  function loadURL() {
    var url = document.querySelector('#inputurl').value
    window.location.hash = '#' + url
    YAML.load(url,
    function(obj) {
      renderAll(obj)
    })
  }
  document.querySelector('#loadYAMLbtn').addEventListener('click',loadURL)
  
  function loadinput() {
    var yamlinp = document.querySelector('#input').value
    glob.localStorage.setItem('yaml',yamlinp)
    console.log('Saved to localstorage')
    var obj = YAML.parse(yamlinp)
    renderAll(obj)
  }
  document.querySelector('#renderbtn').addEventListener('click',loadinput)
  
  document.addEventListener("DOMContentLoaded",function(){
    console.log('Start loading page from YAML')
    var hash = window.location.hash
    if (hash && hash.substr(0,5) === '#http') {// enables sharing with url
      console.log('Found url in hash of url, using it to load yaml')
      document.querySelector('#inputurl').value = hash.substr(1)
      loadURL()
    } else if (glob.localStorage.getItem('yaml')) {
      console.log('Found content in localstorage, using it')
      document.querySelector('#input').value = glob.localStorage.getItem('yaml')
      loadinput()
    } else loadURL() // use default value in inputfield
  })

}(typeof window !== 'undefined' ? window : global))
