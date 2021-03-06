/* @license GPLv3 */
(function (glob) { // IIFE pattern
  'use strict';

  // everything that is a string will be added as data attribute
  glob.addDataAttributes = function(elem,obj) {
    for (var key in obj){
      var val = obj[key]
      var attr = 'data-' + key.toLocaleLowerCase() //https://www.w3schools.com/tags/att_global_data.asp
      if (typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean') elem.setAttribute(attr, val)
    }
    elem.setAttribute('title',JSON.stringify(obj,null,2))
    return elem
  }
  
  function showinfo() {
    var infos = document.getElementsByClassName('info')
    for (var i in infos)
      infos[i].setAttribute('style','display:block;')
  }
  document.querySelector('#showinfobtn').addEventListener('click',showinfo)
  
  glob.orchestrator = function(){
    console.log('Orchestrator called')
    if (! glob.data) return console.log('window.data not loaded yet, waiting for YAML.load')

    if (! glob.renderrolesview) return console.log('renderrolesview not loaded yet')
    glob.renderrolesview('rolesview', glob.data.personas.data)

    if (! glob.renderpersonas) return console.log('renderpersonas not loaded yet')
    glob.renderpersonas('personas', glob.data.personas.data)

    if (! glob.renderlists) return console.log('renderlists not loaded yet')
    glob.renderlists('foundation', glob.data.foundation)
    glob.renderlists('lifelists', glob.data.lifelists)

    if (! glob.renderroutines) return console.log('renderroutines not loaded yet')
    glob.renderroutines('routines', glob.data.routines, glob.data.activities)

    if (! glob.showCalendar) return console.log('showCalendar not loaded yet')
    glob.showCalendar(glob.getEvents())

    if (! glob.renderGraph) return console.log('renderGraph not loaded yet')
    glob.renderGraph(glob.data.personas.data, glob.data.activities, glob.data.routines)

    if (! glob.rendertmms) return console.log('rendertmms not loaded yet')
    glob.rendertmms('tmm', glob.data.tmms)
  }

/*                      
 * Allow custom CSS to be loaded
 */
function loadCss(){
        let url = (new URLSearchParams(window.location.search)).get('css')
        if (! url) return
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = href
        document.getElementsByTagName('HEAD')[0].appendChild(link)
}     
loadCss()

}(typeof window !== 'undefined' ? window : global))
