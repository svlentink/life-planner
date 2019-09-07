/* @license GPLv3 */
import YAML from 'yamljs';

(function (glob) { // IIFE pattern
  'use strict';

  function loadURL(callback) {
    var url = document.querySelector('#inputurl').value
    window.location.hash = '#' + url
    YAML.load(url,
    function(obj) {
      console.log('YAML.load callback')
      glob.data = obj
      if (callback) callback(obj)
    })
  }
  document.querySelector('#loadYAMLbtn').addEventListener('click',() => loadURL(glob.orchestrator))
  
  function loadinput(callback) {
    var yamlinp = document.querySelector('#input').value
    glob.localStorage.setItem('yaml',yamlinp)
    console.log('Saved to localstorage')
    glob.data = YAML.parse(yamlinp)
    if (callback) callback(glob.data)
  }
  document.querySelector('#renderbtn').addEventListener('click',() => loadinput(glob.orchestrator))
  
  function init(){
    console.log('Start loading page from YAML')
    var hash = window.location.hash
    if (hash && hash.substr(0,5) === '#http') {// enables sharing with url
      console.log('Found url in hash of url, using it to load yaml')
      document.querySelector('#inputurl').value = hash.substr(1)
      loadURL(glob.orchestrator)
    } else if (glob.localStorage.getItem('yaml')) {
      console.log('Found content in localstorage, using it')
      document.querySelector('#input').value = glob.localStorage.getItem('yaml')
      loadinput(glob.orchestrator)
    } else loadURL(glob.orchestrator) // use default value in inputfield
  }
  init()

}(typeof window !== 'undefined' ? window : global))
