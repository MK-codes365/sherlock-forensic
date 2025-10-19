'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';

const mockGraphData = {
  nodes: [
    { id: 'John Doe', type: 'person' },
    { id: '+44 20 7946 0958', type: 'contact' },
    { id: 'bc1qxy...', type: 'crypto' },
    { id: '1A1zP1...', type: 'crypto' },
    { id: 'Package', type: 'keyword' },
    { id: 'Usual Spot', type: 'location' },
  ],
  links: [
    { source: 'John Doe', target: '+44 20 7946 0958' },
    { source: 'John Doe', target: 'bc1qxy...' },
    { source: 'John Doe', target: 'Usual Spot' },
    { source: '1A1zP1...', target: 'Package' },
    { source: 'bc1qxy...', target: '1A1zP1...' },
  ],
};

const colors = {
    person: "hsl(var(--primary))",
    contact: "#f87171",
    crypto: "#fb923c",
    keyword: "#a78bfa",
    location: "#60a5fa",
    text: "hsl(var(--primary-foreground))",
    link: "hsl(var(--border))",
};


export function NetworkGraph() {
  const ref = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 350;
    const height = 200;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const simulation = d3.forceSimulation(mockGraphData.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(mockGraphData.links).id((d: any) => d.id).distance(60))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(mockGraphData.links)
      .join('line')
      .attr('stroke', colors.link)
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('circle')
      .data(mockGraphData.nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => colors[d.type as keyof typeof colors] || '#ccc')
      .call((drag) => d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                (d as any).fx = (d as any).x;
                (d as any).fy = (d as any).y;
            })
            .on("drag", (event, d) => {
                (d as any).fx = event.x;
                (d as any).fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                (d as any).fx = null;
                (d as any).fy = null;
            })(drag as any)
      );

    const label = svg.append("g")
        .selectAll("text")
        .data(mockGraphData.nodes)
        .join("text")
        .text((d) => d.id)
        .attr("font-size", "8px")
        .attr("fill", colors.text)
        .attr("dx", 12)
        .attr("dy", ".35em");

    node.append('title').text((d) => `${d.type}: ${d.id}`);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
        
      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

  }, [theme]);

  return (
    <div className="h-[200px] w-full flex items-center justify-center">
        <svg ref={ref}></svg>
    </div>
  );
}
