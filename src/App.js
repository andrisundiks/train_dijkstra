import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';

import { nodes, edges } from "./trainRoutes";

function App() {
    // State for the app
   const [ origin, setOrigin ] = useState('Edinburgh');
   const [ destination, setDestination ] = useState('London');

   // Creates array of jsx objects from trainRoutes to populate our select elements
    // making sure the user cannot pick same value for both origin and destination
   const generateCityList = item => {
       const oppositeValue = item === origin? destination : origin;
       return nodes.map( city => {
           if(city !== oppositeValue) { return <option value={city}> {city} </option> }
       })
   };

    // Event handlers
   const handleOrigin = e => { setOrigin(e.target.value) };
   const handleDestination = e => { setDestination(e.target.value) };


   ////// Dijkstra's algorithm below
    class Graph {
        constructor() {
            this.nodes = [];
            this.adjacencyList = {};
        }
        addNode(node) {
            this.nodes.push(node);
            this.adjacencyList[node] = [];
        }
        addEdge(node1, node2, weight) {
            this.adjacencyList[node1].push({node:node2, weight: weight});
            this.adjacencyList[node2].push({node:node1, weight: weight});
        }
        findPathWithDijkstra(startNode, endNode) {
            let times = {};
            let backtrace = {};
            let pq = new PriorityQueue();
            times[startNode] = 0;

            this.nodes.forEach(node => {
                if (node !== startNode) {
                    times[node] = Infinity
                }
            });
            pq.enqueue([startNode, 0]);
            while (!pq.isEmpty()) {
                let shortestStep = pq.dequeue();
                let currentNode = shortestStep[0];    this.adjacencyList[currentNode].forEach(neighbor => {
                    let time = times[currentNode] + neighbor.weight;
                    if (time < times[neighbor.node]) {
                        times[neighbor.node] = time;
                        backtrace[neighbor.node] = currentNode;
                        pq.enqueue([neighbor.node, time]);
                    }
                });
            }
            let path = [endNode];
            let lastStep = endNode;  while(lastStep !== startNode) {
                path.unshift(backtrace[lastStep])
                lastStep = backtrace[lastStep]
            }

            const formatPath = path.join(' -> ');
            return `${formatPath} -- Total time: ${times[endNode]}`;
        }
    }

    class PriorityQueue {
        constructor() {
            this.collection = [];
        }
        enqueue(element){
            if (this.isEmpty()){
                this.collection.push(element);
            } else {
                let added = false;
                for (let i = 1; i <= this.collection.length; i++){
                    if (element[1] < this.collection[i-1][1]){
                        this.collection.splice(i-1, 0, element);
                        added = true;
                        break;
                    }
                }
                if (!added){
                    this.collection.push(element);
                }
            }
        };
        dequeue() {
            let value = this.collection.shift();
            return value;
        };  isEmpty() {
            return (this.collection.length === 0)
        };
    }

    const map = new Graph();

    // Adding all nodes and edges from trainRoutes file
    const initNodes = () => {
        nodes.forEach( node => { map.addNode(node) });
        edges.forEach(edge => {
            map.addEdge(edge['city1'], edge['city2'], edge['weight'])
        });
    };

    initNodes();

  return (
      <section className="hero is-success is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column is-one-fifth">
                  <section className="is-pulled-right">
                      <label htmlFor="origin">Select an origin</label>
                      <div className="field">
                          <div className="control">
                              <select
                                  name="origin"
                                  className="select is-info"
                                  value={ origin }
                                  onChange={ handleOrigin }
                              >
                                  { generateCityList(origin) }
                              </select>
                          </div>
                      </div>
                      <label htmlFor="origin">Select a destination</label>
                      <div className="field">
                          <div className="control">
                              <select
                                  name="destination"
                                  className="select is-info"
                                  value={ destination }
                                  onChange={ handleDestination }
                              >
                                  { generateCityList(destination) }
                              </select>
                          </div>
                      </div>
                  </section>
              </div>
              <div className="column is-two-thirds box">{ map.findPathWithDijkstra(origin, destination) }</div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default App;
