import React, { useRef, useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import { buildSankeyData, NODE_COLOR_MAP } from '../utils/sankeyData';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import { toPng, toSvg } from 'html-to-image';
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Maximize2, 
  Sparkles, 
  FileCode,
  Image,
  RefreshCw
} from 'lucide-react';

export default function SankeyView() {
  const { jobs } = useJobs();
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const sankeyRef = useRef(null);

  const { nodes: rawNodes, links: rawLinks, flows, sankeyMaticText, summary } = useMemo(() => {
    return buildSankeyData(jobs);
  }, [jobs]);

  // Diagram dimensions
  const width = 960;
  const height = 520;
  const margin = { top: 25, right: 140, bottom: 25, left: 140 };

  // Calculate D3 Sankey graph layout
  const graph = useMemo(() => {
    if (!rawNodes.length || !rawLinks.length) return null;

    const sankeyGenerator = sankey()
      .nodeWidth(16)
      .nodePadding(28)
      .nodeAlign(sankeyLeft)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ]);

    try {
      // Clone nodes and links because D3 sankey mutates them
      const inputNodes = rawNodes.map(d => ({ ...d }));
      const inputLinks = rawLinks.map(d => ({ ...d }));

      return sankeyGenerator({
        nodes: inputNodes,
        links: inputLinks
      });
    } catch (err) {
      console.error("Sankey calculation error", err);
      return null;
    }
  }, [rawNodes, rawLinks]);

  const handleCopySankeyMatic = () => {
    navigator.clipboard.writeText(sankeyMaticText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPng = async () => {
    if (!sankeyRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(sankeyRef.current, {
        quality: 0.95,
        pixelRatio: 2.5, // Crisp high-res for sharing
        backgroundColor: '#0b0f19'
      });
      const link = document.createElement('a');
      link.download = `careerpulse_job_sankey_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = async () => {
    if (!sankeyRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toSvg(sankeyRef.current, {
        backgroundColor: '#0b0f19'
      });
      const link = document.createElement('a');
      link.download = `careerpulse_job_sankey_${new Date().toISOString().split('T')[0]}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export SVG", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="sankey-page">
      {/* Top Banner & Export Actions */}
      <div className="sankey-header glass-panel">
        <div className="sankey-header-info">
          <div className="sankey-title-group">
            <h2 className="sankey-heading">Job Pipeline Sankey Studio</h2>
            <span className="badge badge-purple">
              <Sparkles size={12} /> Live Flow Chart
            </span>
          </div>
          <p className="sankey-description">
            Visual breakdown of your <strong>{jobs.length} applications</strong> transitioning from application to interviews, offers, and decisions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="sankey-actions">
          <button 
            className="btn btn-outline" 
            onClick={handleCopySankeyMatic}
            title="Copy formatted text to paste into SankeyMATIC.com"
          >
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Syntax!' : 'Copy SankeyMATIC'}</span>
          </button>

          <a 
            href="https://sankeymatic.com/build/" 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-outline"
            title="Open SankeyMATIC.com Web Editor"
          >
            <span>SankeyMATIC</span>
            <ExternalLink size={14} />
          </a>

          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadSvg}
            disabled={isExporting}
          >
            <FileCode size={16} />
            <span>SVG</span>
          </button>

          <button 
            className="btn btn-primary" 
            onClick={handleDownloadPng}
            disabled={isExporting}
          >
            <Image size={16} />
            <span>{isExporting ? 'Exporting...' : 'Export High-Res PNG'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="sankey-canvas-container glass-panel">
        <div className="sankey-wrapper" ref={sankeyRef}>
          {graph ? (
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="sankey-svg"
              style={{ width: '100%', height: 'auto', maxHeight: '560px' }}
            >
              <defs>
                {graph.links.map((link, i) => {
                  const sourceColor = NODE_COLOR_MAP[link.source.name] || '#6366f1';
                  const targetColor = NODE_COLOR_MAP[link.target.name] || '#94a3b8';
                  return (
                    <linearGradient
                      key={`grad-${i}`}
                      id={`link-grad-${i}`}
                      gradientUnits="userSpaceOnUse"
                      x1={link.source.x1}
                      x2={link.target.x0}
                    >
                      <stop offset="0%" stopColor={sourceColor} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={targetColor} stopOpacity="0.55" />
                    </linearGradient>
                  );
                })}
              </defs>

              {/* Links (Ribbons) */}
              <g className="sankey-links">
                {graph.links.map((link, i) => {
                  const linkGenerator = sankeyLinkHorizontal();
                  const pathData = linkGenerator(link);
                  return (
                    <path
                      key={`link-${i}`}
                      d={pathData}
                      fill="none"
                      stroke={`url(#link-grad-${i})`}
                      strokeWidth={Math.max(1.5, link.width)}
                      className="sankey-link"
                    >
                      <title>{`${link.source.name} → ${link.target.name}: ${link.value}`}</title>
                    </path>
                  );
                })}
              </g>

              {/* Nodes (Bars & Labels) */}
              <g className="sankey-nodes">
                {graph.nodes.map((node, i) => {
                  const nodeColor = NODE_COLOR_MAP[node.name] || '#6366f1';
                  const isLeftSide = node.x0 < width / 2;

                  return (
                    <g key={`node-${i}`} className="sankey-node-group">
                      {/* Node Bar */}
                      <rect
                        x={node.x0}
                        y={node.y0}
                        width={node.x1 - node.x0}
                        height={Math.max(4, node.y1 - node.y0)}
                        fill={nodeColor}
                        rx={3}
                        className="sankey-node-rect"
                      >
                        <title>{`${node.name}: ${node.value}`}</title>
                      </rect>

                      {/* Node Label */}
                      <text
                        x={isLeftSide ? node.x0 - 10 : node.x1 + 10}
                        y={(node.y0 + node.y1) / 2}
                        dy="0.35em"
                        textAnchor={isLeftSide ? 'end' : 'start'}
                        className="sankey-node-text"
                      >
                        <tspan className="node-count" fontWeight="700">
                          {node.value}
                        </tspan>
                        <tspan className="node-name" dx="6">
                          {node.name}
                        </tspan>
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Watermark in bottom corner */}
              <text
                x={width - margin.right}
                y={height - 8}
                textAnchor="end"
                className="sankey-watermark"
              >
                Generated with CareerPulse
              </text>
            </svg>
          ) : (
            <div className="sankey-empty">
              <RefreshCw className="animate-spin" size={24} />
              <p>Add or advance job applications to see your dynamic pipeline flow.</p>
            </div>
          )}
        </div>
      </div>

      {/* SankeyMATIC Raw Text Syntax Drawer */}
      <div className="sankey-syntax-box glass-panel">
        <div className="syntax-header">
          <div className="syntax-title">
            <FileCode size={16} className="text-primary" />
            <h3>SankeyMATIC Inputs Syntax (Auto-Generated)</h3>
          </div>
          <button 
            className="btn btn-sm btn-outline"
            onClick={handleCopySankeyMatic}
          >
            {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
        <pre className="syntax-code font-mono">
          {sankeyMaticText}
        </pre>
      </div>
    </div>
  );
}
