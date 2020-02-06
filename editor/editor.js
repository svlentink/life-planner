/* @license GPLv3 */
import YAML from 'yamljs';

(function (glob) { // IIFE pattern
  'use strict';

  function loadURL(callback) {
    var url = document.querySelector('#inputurl').value
    window.location.hash = '#' + url
    YAML.load(url,
    function(obj) {
      console.log('YAML.load callback',url)
      glob.data = obj
      for (var key in glob.data) {
        void function(key){ // IIFE to perserve variables during looping
          var val = glob.data[key]
          if (typeof val === 'string' && val.substr(-2,2).toLowerCase() === 'ml') {
            console.log('Loading',key,'from',val)
            YAML.load(val, (data) => {
              glob.data[key] = data
              if (callback) callback(glob.data)
              console.log('Loaded',key,'from',val)
            })
          }
        }(key)
      }
      if (callback) callback(glob.data)
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
