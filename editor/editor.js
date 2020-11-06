/* @license GPLv3 */
import YAML from 'yamljs';

(function (glob) { // IIFE pattern
  'use strict';
  let blob_url = "https://blob.huil.bid/yaml"
  let blob_login_url = "https://blob.huil.bid/?redirect=" +
                       encodeURIComponent('https://lent.ink/projects/life-planner/#blobstorage')

  function loadBlob(callback) {
    let url = blob_url + '_test_if_logged_in'
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.responseText === 'ERROR please login first')
          return window.location = blob_login_url
        fetchBlob(callback)
      }
    };
    xhttp.open("GET", url, true)
    xhttp.withCredentials = true
    xhttp.send()
  }
  function fetchBlob(callback) {
    let url = blob_url
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText)
      }
    };
    xhttp.open("GET", url, true)
    xhttp.withCredentials = true
    xhttp.send()
  }

  function loadURL(callback) {
    let url = document.querySelector('#inputurl').value
    if (window.location.hash === '#blobstorage') {
      loadBlob((txt) => {
        document.querySelector('#input').value = txt
        let obj = YAML.parse(txt)
        glob.data = obj
        if (callback) callback(glob.data)
        console.log('Loaded from blobstorage')
      })
    } else {
      window.location.hash = url
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
  }
  document.querySelector('#loadYAMLbtn').addEventListener('click',() => loadURL(glob.orchestrator))
  
  function loadinput(callback) {
    var yamlinp = document.querySelector('#input').value
    if (window.location.hash === '#blobstorage'){
      let url = blob_url
      var xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log('Saved to blobstorage')
        }
      };
      xhttp.open("POST", url, true)
      xhttp.withCredentials = true
      xhttp.send(yamlinp)
    } else {
      glob.localStorage.setItem('yaml',yamlinp)
      console.log('Saved to localstorage')
    }
    glob.data = YAML.parse(yamlinp)
    if (callback) callback(glob.data)
  }
  document.querySelector('#renderbtnlocalstorage').addEventListener('click',() => loadinput(glob.orchestrator))
  document.querySelector('#renderbtnblobstorage').addEventListener('click',() => {
    window.location.hash = '#blobstorage'
    loadinput(glob.orchestrator)
  })
  document.querySelector('#loadbtnblobstorage').addEventListener('click',() => {
    let loc = window.location
    let href = loc.origin + loc.pathname + '#blobstorage'
    window.open(href)
  })
  
  function init(){
    console.log('Start loading page from YAML')
    var hash = window.location.hash
    if (hash && hash.substr(0,5) === '#http') {// enables sharing with url
      console.log('Found url in hash of url, using it to load yaml')
      document.querySelector('#inputurl').value = hash.substr(1)
      loadURL(glob.orchestrator)
    } else if(hash && hash === '#blobstorage'){
      loadURL(glob.orchestrator)
    } else if (glob.localStorage.getItem('yaml')) {
      console.log('Found content in localstorage, using it')
      document.querySelector('#input').value = glob.localStorage.getItem('yaml')
      //window.location.hash = 'localstorage'
      loadinput(glob.orchestrator)
    } else loadURL(glob.orchestrator) // use default value in inputfield
  }
  init()

}(typeof window !== 'undefined' ? window : global))
