// init data http://fundersandfounders.com/9-types-of-intelligence/
var SVL = window.SVL

var goalsStorage = new SVL.planning.Goals()

function rund3magic (inp) {
  var nodes = inp.nodes
  var links = inp.links

  // based on: www.lent.ink d3js v3, NOT v4!
  var d3 = window.d3

  var w = window.innerWidth * 0.98
  var h = window.innerHeight * 0.98
  var currentScale = Math.sqrt(window.innerHeight * window.innerWidth) / 150

  document.querySelector('#d3out').innerHTML = ''
  var vis = d3.select('#d3out')
    .append('svg:svg')
    .attr('width', w)
    .attr('height', h)

  var force = d3.layout.force() // d3js v3
  // var force = d3.forceSimulation() //d3js v4
      .charge(-1 * currentScale * 100)
      .distance(10 * currentScale)
      .nodes(nodes)
      .links(links)
      .size([w, h])
      .start()

  var link = vis.selectAll('line.link')
      .data(links)
    .enter().append('svg:line')
      .style('stroke', '#aaa')
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })

  var clickAction = function (g) {
    loadForm(g)
  }

  var node = vis.selectAll('circle.node')
    .data(nodes).enter().append('g')
    .attr('class', 'node clickablenode')
    .style('fill', '#00f')
    .on('click', clickAction)
    .call(force.drag)
  var circleD = 1 + (currentScale * 0.5)
  node.append('svg:circle')
      .style('fill', '#000')
      .style('stroke', '#fff')
      .attr('r', circleD)
  node.append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(function (d) { return d.name || 'empty field' })

  force.on('tick', function () {
    link.attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })
    node.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
  })
}

rund3magic(goalsStorage.d3js())

function loadForm (inpobj) {
  var name = inpobj.name
  var goal = goalsStorage.getGoal(name)
  document.querySelector('#name_inp').value = name || ''
  document.querySelector('#desc_inp').value = goal.desc || ''
  document.querySelector('#links_inp').value = goalsStorage.getLinks(name).toString() || ''
}
function saveForm () {
  var name = document.querySelector('#name_inp').value
  var desc = document.querySelector('#desc_inp').value || ''
  var links = document.querySelector('#links_inp').value || ''
  links = links.split(',')
  var obj = {desc: desc, links: links}
  goalsStorage.setGoal(name, obj)
  rund3magic(goalsStorage.d3js())
}
function delGoal () {
  var name = document.querySelector('#name_inp').value
  goalsStorage.delGoal(name)
  document.querySelector('#name_inp').value = ''
  document.querySelector('#desc_inp').value = ''
  document.querySelector('#links_inp').value = ''
  rund3magic(goalsStorage.d3js())
}
function exportJSON () {
  document.querySelector('#json_inp').value = goalsStorage.toJSON()
}
function importJSON () {
  var data = document.querySelector('#json_inp').value
  data = JSON.parse(data)
  goalsStorage = new SVL.planning.Goals(data)
  rund3magic(goalsStorage.d3js())
}
