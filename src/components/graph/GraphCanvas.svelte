<script lang="ts">
  /**
   * The Cytoscape renderer. It draws whatever GraphView it is given and
   * reports taps; it owns no application state.
   *
   * Arrangement is deliberately boring. Positions are computed here rather
   * than by a randomised layout, so the same view always looks the same, and
   * when the view grows the nodes already on screen stay where they are.
   */
  import { onMount } from 'svelte';
  import type { Core, NodeSingular, StylesheetJson } from 'cytoscape';
  import type { GraphView, ViewEdge, ViewNode } from '../../lib/graph/neighborhood.ts';

  interface Props {
    view: GraphView;
    /** The node drawn at the centre. Leave empty to arrange everything on one circle. */
    focus?: string | null;
    selected?: string | null;
    /**
     * Pan, zoom and drag. Turn off for a picture embedded in an article: Cytoscape then receives
     * no pointer events at all, so a swipe across the picture scrolls the page as usual, and
     * taps are resolved here instead (see recordAt).
     */
    interactive?: boolean;
    label?: string;
    onselect?: (recordId: string) => void;
  }

  let { view, focus = null, selected = null, interactive = true, label = 'Graph of connections', onselect }: Props = $props();

  let container: HTMLDivElement;
  let wrapper: HTMLDivElement;
  let cy = $state.raw<Core | undefined>(undefined);
  let arrangedFor: string | null | undefined = undefined;

  const cssVar = (name: string) => getComputedStyle(container).getPropertyValue(name).trim();

  /** On a small canvas the picture is drawn tighter and lettered larger, so it stays legible when fitted. */
  const isCompact = () => Math.min(container.clientWidth || 600, container.clientHeight || 500) < 420;
  let styledCompact = false;

  function stylesheet(): StylesheetJson {
    const ink = cssVar('--ink');
    const soft = cssVar('--ink-soft');
    const paper = cssVar('--paper');
    const card = cssVar('--card');
    const blue = cssVar('--blue');
    const variants = ['person', 'object', 'role', 'routine', 'concept', 'place', 'observation', 'held', 'disputed', 'withdrawn', 'unassessed'];
    const body = cssVar('--font-body');
    const compact = (styledCompact = isCompact());
    const size = (px: number) => (compact ? Math.round(px * 1.3) : px);
    return [
      {
        selector: 'node',
        style: {
          label: 'data(display)',
          width: 26,
          height: 26,
          'background-color': soft,
          'border-width': 2,
          'border-color': card,
          color: ink,
          'font-family': body,
          'font-size': size(12),
          'font-weight': 600,
          'text-wrap': 'wrap',
          'text-max-width': compact ? '104px' : '120px',
          'text-valign': 'bottom',
          'text-margin-y': 6,
          'text-background-color': paper,
          'text-background-opacity': 0.85,
          'text-background-padding': '2px',
          'text-background-shape': 'roundrectangle',
        },
      },
      ...variants.map((variant) => ({
        selector: `node[variant = "${variant}"]`,
        style: { 'background-color': cssVar(`--${variant}`) },
      })),
      { selector: 'node[kind = "claim"]', style: { shape: 'diamond', width: 30, height: 30, 'font-weight': 500, 'font-style': 'italic' } },
      {
        selector: 'node[kind = "observation"]',
        style: { shape: 'round-rectangle', width: 16, height: 16, 'font-size': size(10), 'font-weight': 400, color: soft },
      },
      { selector: 'node.focus', style: { width: 42, height: 42, 'font-size': size(14), 'font-weight': 700 } },
      { selector: 'node.more', style: { 'border-style': 'dashed', 'border-color': ink, 'border-width': 2 } },
      {
        selector: 'edge',
        style: {
          label: 'data(label)',
          width: 1.5,
          'line-color': soft,
          'target-arrow-color': soft,
          'target-arrow-shape': 'triangle',
          'arrow-scale': 0.9,
          'curve-style': 'bezier',
          color: soft,
          'font-family': body,
          'font-size': size(10),
          'text-rotation': 'autorotate',
          'text-wrap': 'wrap',
          'text-max-width': '110px',
          'text-background-color': paper,
          'text-background-opacity': 0.9,
          'text-background-padding': '2px',
        },
      },
      { selector: 'edge[kind = "claim"]', style: { 'line-style': 'dashed', width: 3, 'font-size': size(11), 'font-style': 'italic', color: ink } },
      { selector: 'edge[kind = "about"]', style: { 'line-style': 'dotted', width: 2, 'target-arrow-shape': 'none' } },
      { selector: 'edge[kind = "evidence"]', style: { 'line-style': 'dotted' } },
      { selector: 'edge[kind = "refines"]', style: { 'line-style': 'dashed' } },
      ...(['held', 'disputed', 'withdrawn', 'unassessed'] as const).map((status) => ({
        selector: `edge[status = "${status}"]`,
        style: { 'line-color': cssVar(`--${status}`), 'target-arrow-color': cssVar(`--${status}`) },
      })),
      { selector: 'node.selected', style: { 'border-color': blue, 'border-width': 4, 'border-style': 'solid' } },
      { selector: 'edge.selected', style: { width: 5, 'text-background-color': cssVar('--highlight'), 'text-background-opacity': 1 } },
      { selector: '.dim', style: { opacity: 0.3 } },
    ] as StylesheetJson;
  }

  const nodeData = (n: ViewNode) => ({ ...n, display: n.hidden > 0 ? `${n.label} (+${n.hidden})` : n.label });
  const edgeData = (e: ViewEdge) => ({ ...e, status: e.status ?? '' });

  /**
   * Orders nodes so that ones with something in common sit side by side:
   * start anywhere, then keep picking whichever remaining node is most
   * connected to the one just placed.
   */
  function chain(members: NodeSingular[], exclude: string | null): NodeSingular[] {
    const neighbours = new Map(members.map((n) => [n.id(), new Set(n.neighborhood('node').map((m) => m.id()).filter((id) => id !== exclude))]));
    const affinity = (a: NodeSingular, b: NodeSingular) => {
      const mine = neighbours.get(a.id())!;
      const theirs = neighbours.get(b.id())!;
      let shared = 0;
      for (const id of mine) if (theirs.has(id)) shared += 1;
      return (mine.has(b.id()) ? 2 : 0) + shared;
    };
    const remaining = [...members];
    const ordered = [remaining.shift()!];
    while (remaining.length) {
      const last = ordered[ordered.length - 1];
      let best = 0;
      for (let i = 1; i < remaining.length; i++) {
        if (affinity(last, remaining[i]) > affinity(last, remaining[best])) best = i;
      }
      ordered.push(remaining.splice(best, 1)[0]);
    }
    return ordered;
  }

  /** Rings around the focus, or a single circle when there is no focus. */
  function arrange(core: Core) {
    const nodes = core.nodes().sort((a, b) => a.id().localeCompare(b.id())).toArray() as NodeSingular[];
    if (nodes.length === 0) return;
    const compact = isCompact();
    const spacing = compact ? 104 : 132;
    // Stretch the rings into an ellipse that matches the shape of the canvas.
    const ratio = Math.min(2, Math.max(0.6, (container.clientWidth || 600) / (container.clientHeight || 500)));
    const place = (node: NodeSingular, radius: number, angle: number) =>
      node.position({ x: radius * Math.sqrt(ratio) * Math.cos(angle), y: (radius / Math.sqrt(ratio)) * Math.sin(angle) });
    const onCircle = (members: NodeSingular[], radius: number, angles?: Map<string, number>) => {
      members.forEach((node, i) => {
        const angle = (2 * Math.PI * i) / members.length - Math.PI / 2;
        angles?.set(node.id(), angle);
        place(node, radius, angle);
      });
    };

    if (!focus || core.getElementById(focus).empty()) {
      onCircle(chain(nodes, null), Math.max(compact ? 140 : 170, (nodes.length * spacing) / (2 * Math.PI)));
      return;
    }

    const rings = new Map<number, NodeSingular[]>();
    for (const node of nodes) {
      const ring = node.data('ring') as number;
      rings.set(ring, [...(rings.get(ring) ?? []), node]);
    }
    const angles = new Map<string, number>();
    let radius = 0;
    for (const ring of [...rings.keys()].sort((a, b) => a - b)) {
      const members = rings.get(ring)!;
      if (ring === 0) {
        members[0].position({ x: 0, y: 0 });
        continue;
      }
      const step = ring === 1 ? (compact ? 150 : 200) : compact ? 120 : 150;
      radius = Math.max(radius + step, (members.length * spacing) / (2 * Math.PI));
      if (ring === 1) {
        onCircle(chain(members, focus), radius, angles);
        continue;
      }
      // Outer rings: put each node at the angle of whatever it hangs from, then nudge apart.
      const wanted = members
        .map((node) => {
          const placed = node.neighborhood('node').filter((n) => angles.has(n.id()));
          const x = placed.map((n) => Math.cos(angles.get(n.id())!)).reduce((a, b) => a + b, 0);
          const y = placed.map((n) => Math.sin(angles.get(n.id())!)).reduce((a, b) => a + b, 0);
          return { node, angle: placed.nonempty() ? Math.atan2(y, x) : 0 };
        })
        .sort((a, b) => a.angle - b.angle || a.node.id().localeCompare(b.node.id()));
      const gap = spacing / radius;
      for (let i = 1; i < wanted.length; i++) {
        if (wanted[i].angle - wanted[i - 1].angle < gap) wanted[i].angle = wanted[i - 1].angle + gap;
      }
      for (const { node, angle } of wanted) {
        angles.set(node.id(), angle);
        place(node, radius, angle);
      }
    }
  }

  /** Places newly revealed nodes beside the node they hang from, fanning away from the centre. */
  function placeAdded(core: Core, added: NodeSingular[]) {
    const fresh = new Set(added.map((n) => n.id()));
    const centre = focus && core.getElementById(focus).nonempty() ? core.getElementById(focus).position() : { x: 0, y: 0 };
    const perAnchor = new Map<string, number>();
    for (const node of added) {
      const anchor = node.neighborhood('node').filter((n) => !fresh.has(n.id())).first();
      if (anchor.empty()) {
        const box = core.elements().boundingBox();
        node.position({ x: box.x2 + 120, y: box.y1 + 60 * (perAnchor.get('') ?? 0) });
        perAnchor.set('', (perAnchor.get('') ?? 0) + 1);
        continue;
      }
      const at = anchor.position();
      const index = perAnchor.get(anchor.id()) ?? 0;
      perAnchor.set(anchor.id(), index + 1);
      const outward = Math.atan2(at.y - centre.y, at.x - centre.x) || 0;
      const side = index % 2 === 0 ? 1 : -1;
      const angle = outward + side * Math.ceil(index / 2) * 0.55;
      const distance = 150 + 26 * Math.floor(index / 4);
      node.position({ x: at.x + distance * Math.cos(angle), y: at.y + distance * Math.sin(angle) });
      fresh.delete(node.id());
    }
  }

  function fit(core: Core, animate: boolean) {
    if (core.elements().empty()) return;
    const padding = 48;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animate && !reduced) core.animate({ fit: { eles: core.elements(), padding } }, { duration: 220 });
    else core.fit(core.elements(), padding);
    if (core.zoom() > 1.25) {
      core.zoom(1.25);
      core.center(core.elements());
    }
  }

  function sync(core: Core, next: GraphView, centre: string | null) {
    const wanted = new Set([...next.nodes.map((n) => n.id), ...next.edges.map((e) => e.id)]);
    const added: NodeSingular[] = [];
    const hadNodes = core.nodes().nonempty();
    core.batch(() => {
      core.elements().filter((el) => !wanted.has(el.id())).remove();
      for (const node of next.nodes) {
        const existing = core.getElementById(node.id);
        if (existing.nonempty()) existing.data(nodeData(node));
        else added.push(core.add({ group: 'nodes', data: nodeData(node) }) as NodeSingular);
      }
      for (const edge of next.edges) {
        const existing = core.getElementById(edge.id);
        if (existing.nonempty()) existing.data(edgeData(edge));
        else core.add({ group: 'edges', data: edgeData(edge) });
      }
      core.nodes().forEach((node) => {
        node.toggleClass('focus', node.id() === centre);
        node.toggleClass('more', node.data('hidden') > 0);
      });
    });

    const startOver = arrangedFor !== centre || !hadNodes;
    arrangedFor = centre;
    if (startOver) arrange(core);
    else placeAdded(core, added);
    fit(core, !startOver);
  }

  function highlight(core: Core, id: string | null) {
    core.elements().removeClass('selected');
    if (!id) return;
    core.getElementById(id).addClass('selected');
    core.edges().filter((edge) => edge.data('record') === id).addClass('selected');
  }

  onMount(() => {
    let disposed = false;
    let core: Core | undefined;
    let observer: ResizeObserver | undefined;
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    const restyle = () => core?.style(stylesheet());

    import('cytoscape').then(({ default: cytoscape }) => {
      if (disposed) return;
      core = cytoscape({
        container,
        style: stylesheet(),
        minZoom: 0.3,
        maxZoom: 2.5,
        userPanningEnabled: interactive,
        userZoomingEnabled: interactive,
        autoungrabify: !interactive,
        boxSelectionEnabled: false,
        selectionType: 'single',
      });
      core.on('tap', 'node', (event) => onselect?.(event.target.id()));
      core.on('tap', 'edge', (event) => {
        const record = event.target.data('record');
        if (record) onselect?.(record);
      });
      core.on('mouseover', 'node, edge[record]', () => (container.style.cursor = 'pointer'));
      core.on('mouseout', 'node, edge', () => (container.style.cursor = ''));

      observer = new ResizeObserver(() => {
        if (!core || container.clientWidth === 0) return;
        core.resize();
        if (isCompact() !== styledCompact) core.style(stylesheet());
        fit(core, false);
      });
      observer.observe(container);
      scheme.addEventListener('change', restyle);
      cy = core;
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      scheme.removeEventListener('change', restyle);
      core?.destroy();
    };
  });

  $effect(() => {
    if (cy) sync(cy, view, focus);
  });

  $effect(() => {
    if (cy) {
      // Re-run after sync as well, so a selection survives the view changing underneath it.
      void view;
      highlight(cy, selected);
    }
  });

  /**
   * Finds what was tapped in a non-interactive picture: a node (label included), or failing that
   * the nearest edge that carries a record.
   */
  function recordAt(event: MouseEvent): string | null {
    if (!cy) return null;
    const rect = container.getBoundingClientRect();
    const zoom = cy.zoom();
    const pan = cy.pan();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;
    const slack = 8 / zoom;

    for (const node of cy.nodes().toArray()) {
      const box = node.boundingBox({ includeLabels: true });
      if (x >= box.x1 - slack && x <= box.x2 + slack && y >= box.y1 - slack && y <= box.y2 + slack) return node.id();
    }

    const toSegment = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy));
    };
    let nearest: string | null = null;
    let distance = 16 / zoom;
    for (const edge of cy.edges().toArray()) {
      const record = edge.data('record') as string | null;
      if (!record) continue;
      const middle = edge.midpoint();
      const d = Math.min(toSegment(edge.sourceEndpoint(), middle), toSegment(middle, edge.targetEndpoint()));
      if (d < distance) {
        distance = d;
        nearest = record;
      }
    }
    return nearest;
  }

  function ontap(event: MouseEvent) {
    if (interactive) return;
    const record = recordAt(event);
    if (record) onselect?.(record);
  }

  function onhover(event: MouseEvent) {
    if (!interactive) wrapper.style.cursor = recordAt(event) ? 'pointer' : '';
  }

  export function resetView() {
    if (!cy) return;
    arrange(cy);
    fit(cy, true);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<div class="canvas" class:static={!interactive} bind:this={wrapper} role="img" aria-label={label} onclick={ontap} onmousemove={onhover}>
  <div class="surface" bind:this={container}></div>
</div>

<style>
  .surface {
    width: 100%;
    height: 100%;
  }
  .static .surface {
    pointer-events: none;
  }
  .canvas {
    width: 100%;
    height: 100%;
    min-height: 18rem;
    background:
      linear-gradient(var(--rule-soft) 1px, transparent 1px) 0 0 / 100% 28px,
      linear-gradient(90deg, var(--rule-soft) 1px, transparent 1px) 0 0 / 28px 100%,
      var(--paper);
    border: 1px solid var(--rule);
    border-radius: var(--radius);
  }
</style>
