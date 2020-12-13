// const express = require('express')
import express from 'express'
import { RUN_CURRENT_QUERY } from './query.js'
const app = express()

app.get('/api/nodes', async function (req, res) {
  let result = await RUN_CURRENT_QUERY('social_network')
  let node = result.nodes[0]
  let nodes = []
  let edges = []
  // nodes.push({ id: node.id, name: node.label });
  nodes.push({ name: node.label });
  node.attributes.forEach(element => {
    let id = `${element.type}  ${element.value}`
    // nodes.push({ id: id, name: element.value })
    // edges.push({ source: node.id, target: id, name: element.type })
    nodes.push({ name: element.value })
    edges.push({ source: 0, target: nodes.length-1, relation: element.type, value: 1 })
  });

  result = {nodes, edges}
  console.log(result)
  res.send(result)
})

app.listen(3000)