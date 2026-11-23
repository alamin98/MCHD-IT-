/* MCHD IT — decorative, text-free expertise illustrations (viewBox 600x320). */
window.MCHD_ILLOS = (() => {
  // Decorative, text-free illustrations (viewBox 600x320)
  return {
    survey: `
      <g transform="translate(110 56)">
        <rect class="glass" width="380" height="214" rx="18"/>
        <line class="dim" x1="28" y1="176" x2="352" y2="176"/>
        <line class="dim" x1="28" y1="126" x2="352" y2="126" stroke-dasharray="3 6"/>
        <line class="dim" x1="28" y1="76" x2="352" y2="76" stroke-dasharray="3 6"/>
        ${[62, 98, 74, 124, 88, 142, 110, 130].map((h, i) => `<rect class="tf a-grow" x="${44 + i * 39}" y="${176 - h}" width="22" height="${h}" rx="5" opacity="${.45 + i * .07}" style="animation-delay:${i * .12}s"/>`).join('')}
        <path class="w a-draw" style="--len:440" d="M55 128 L94 104 L133 118 L172 76 L211 96 L250 52 L289 70 L328 58"/>
      </g>
      <g transform="translate(130 70)"><g class="a-sweep">
        <circle class="glass" cx="62" cy="62" r="46" stroke-width="3"/>
        <circle class="t" cx="62" cy="62" r="46" stroke-width="3" opacity=".7"/>
        <line class="w" x1="96" y1="96" x2="128" y2="128" stroke-width="9"/>
      </g></g>`,
    edc: `
      <g transform="translate(200 26)" class="a-float">
        <rect class="glass" width="200" height="270" rx="24" stroke-width="2.5"/>
        <rect class="dimf" x="18" y="22" width="164" height="226" rx="12"/>
        ${[0, 1, 2, 3].map(i => `
          <rect class="dimf" x="34" y="${44 + i * 50}" width="132" height="30" rx="8"/>
          <rect class="tf a-fill" x="34" y="${44 + i * 50}" width="${[110, 84, 120, 70][i]}" height="30" rx="8" opacity=".35" style="animation-delay:${i * .45}s"/>
          <circle class="tf a-pop" cx="150" cy="${59 + i * 50}" r="9" style="animation-delay:${.3 + i * .45}s"/>`).join('')}
        <rect class="w" x="84" y="258" width="32" height="4" rx="2" stroke-width="0" fill="rgb(255 255 255 / .5)"/>
      </g>
      <g transform="translate(440 110)">
        <path class="w" d="M20 70a26 26 0 0 1 4-52 34 34 0 0 1 64 8 22 22 0 0 1-4 44z" stroke-width="2.5"/>
        <path class="t a-dash" d="M-24 46 C 0 46, 4 46, 20 46" />
      </g>
      <g transform="translate(60 140)">
        <circle class="dim" cx="40" cy="40" r="40"/>
        <path class="t a-dash" d="M80 40 C 110 40, 120 40, 140 40"/>
        <path class="w" d="M22 40l12 12 24-24" stroke-width="3"/>
      </g>`,
    map: `
      <g transform="translate(90 40)">
        <rect class="glass" width="420" height="240" rx="18"/>
        <path class="dim" d="M0 90 H420 M0 170 H420 M120 0 V240 M270 0 V240 M330 0 L 420 70"/>
        ${[[24, 18], [66, 18], [24, 54], [150, 18], [196, 18], [150, 112], [196, 112], [296, 104], [342, 120], [24, 112], [66, 196], [150, 196], [296, 196], [362, 196], [226, 196]].map(([x, y], i) =>
          `<rect class="dimf" x="${x}" y="${y}" width="34" height="28" rx="5"/><rect class="tf a-pop" x="${x}" y="${y}" width="34" height="28" rx="5" opacity=".55" style="animation-delay:${(i * .23).toFixed(2)}s"/>`).join('')}
        <path class="t a-dash" d="M40 220 C 110 220, 110 140, 200 140 S 300 60, 380 40" stroke-width="2.5"/>
        ${[[200, 140], [96, 182], [312, 78], [380, 40]].map(([x, y], i) =>
          `<g transform="translate(${x - 14} ${y - 38})"><g class="a-drop" style="animation-delay:${i * .5}s"><path class="tf" d="M14 38C14 38 0 22 0 14a14 14 0 0 1 28 0c0 8-14 24-14 24z"/><circle cx="14" cy="14" r="5" fill="#0a2140" stroke="none"/></g></g>`).join('')}
      </g>`,
    surveil: (() => {
      const hub = [300, 160];
      const nodes = [[130, 70], [470, 70], [100, 210], [500, 220], [230, 270], [380, 280], [300, 40]];
      const lines = nodes.map(([x, y]) => `<line class="dim" x1="${hub[0]}" y1="${hub[1]}" x2="${x}" y2="${y}"/>`).join('');
      const packets = nodes.map(([x, y], i) => `<circle class="tf a-move" r="4" style="offset-path:path('M${x} ${y} L${hub[0]} ${hub[1]}');animation-delay:${i * .6}s;animation-duration:${2.6 + (i % 3) * .5}s"/>`).join('');
      const nodeEls = nodes.map(([x, y], i) => `<g transform="translate(${x} ${y})"><circle class="glass" r="22"/><circle class="w" cy="-5" r="5"/><path class="w" d="M-9 11a9 9 0 0 1 18 0"/>${i === 3 ? '<circle class="tf a-blink" cx="16" cy="-16" r="6"/>' : ''}</g>`).join('');
      return `${lines}${packets}<g transform="translate(${hub[0]} ${hub[1]})"><circle class="tf a-pulse" r="30" opacity=".5"/><circle class="tf a-pulse" r="30" opacity=".5" style="animation-delay:1.3s"/><circle r="34" fill="#0d2a4e" stroke="rgb(46 192 204 / .8)" stroke-width="2.5"/><path class="w" d="M-14 0h7l4-10 6 20 4-10h7" stroke-width="2.5"/></g>${nodeEls}`;
    })(),
    biobank: `
      <g transform="translate(90 50)">
        <rect class="glass" width="300" height="220" rx="18"/>
        <line class="dim" x1="20" y1="150" x2="280" y2="150"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <g transform="translate(${34 + i * 42} 30)">
            <rect class="tf" x="2" y="0" width="24" height="12" rx="3" opacity=".9"/>
            <path class="w" d="M4 14v92a10 10 0 0 0 20 0V14" stroke-width="2"/>
            <rect class="tf a-level" x="7" y="40" width="14" height="74" rx="7" opacity="${.35 + (i % 3) * .2}" style="animation-delay:${i * .4}s"/>
          </g>`).join('')}
        <path class="t a-draw" style="--len:300" d="M20 196 L60 186 L90 192 L120 178 L160 188 L200 172 L240 182 L280 176"/>
      </g>
      <g transform="translate(430 52)">
        <rect class="glass" x="0" y="0" width="80" height="216" rx="18"/>
        <path class="w" d="M30 26v120a20 20 0 1 0 20 0V26a10 10 0 0 0-20 0z" stroke-width="2.5"/>
        <rect class="tf a-level" x="35" y="70" width="10" height="94" rx="5" style="animation-duration:3.5s"/>
        <circle class="tf" cx="40" cy="166" r="12"/>
        <path class="t" d="M58 50h10M58 80h10M58 110h10" opacity=".7"/>
      </g>`,
    lims: `
      <path class="dim" d="M90 160 H510" stroke-width="2"/>
      <path class="t a-dash" d="M90 160 H510" stroke-width="2"/>
      ${[90, 230, 370, 510].map((x, i) => `
        <g transform="translate(${x} 160)">
          <circle class="glass" r="42" stroke-width="2"/>
          <circle class="tf a-pulse-sm" r="42" opacity=".3" style="animation-delay:${i * 1.25}s"/>
        </g>`).join('')}
      <g transform="translate(90 160)"><path class="w" d="M-8 -20h16M-6 -20v12L-18 14a3 3 0 0 0 3 5h30a3 3 0 0 0 3-5L6 -8v-12M-12 6h24" stroke-width="2.5"/></g>
      <g transform="translate(230 160)">${[-16, -10, -6, 0, 4, 10, 14].map((x, i) => `<line class="w" x1="${x}" y1="-16" x2="${x}" y2="16" stroke-width="${i % 2 ? 2 : 4}"/>`).join('')}</g>
      <g transform="translate(370 160)"><rect class="w" x="-18" y="-14" width="36" height="28" rx="4" stroke-width="2.5"/><path class="t" d="M-10 4l6-6 6 4 8-8" stroke-width="2.5"/></g>
      <g transform="translate(510 160)"><path class="w a-pop" d="M-14 0l9 9 19-19" stroke-width="3.5" style="animation-duration:5s;animation-delay:3.6s"/></g>
      <circle class="wf a-move" r="8" style="offset-path:path('M90 160 H510');animation-duration:5s"/>
      <g transform="translate(150 236)" opacity=".9">
        <rect class="glass" width="300" height="44" rx="12"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect class="tf a-pop" x="${16 + i * 35}" y="16" width="24" height="12" rx="4" opacity=".6" style="animation-delay:${i * .25}s;animation-duration:5s"/>`).join('')}
      </g>`,
    // Outpatient: token display + a queue moving towards the consultation desk
    opd: `
      <g transform="translate(70 60)">
        <rect class="glass" width="170" height="110" rx="16"/>
        <rect class="dimf" x="18" y="18" width="134" height="22" rx="6"/>
        <rect class="tf a-fill" x="18" y="18" width="96" height="22" rx="6" opacity=".45"/>
        <rect class="tf" x="18" y="56" width="58" height="36" rx="8" opacity=".9"/>
        <rect class="dimf" x="86" y="56" width="66" height="36" rx="8"/>
        <circle class="tf a-blink" cx="140" cy="74" r="5"/>
      </g>
      <g transform="translate(300 90)">
        <rect class="glass" width="230" height="150" rx="18"/>
        <path class="dim" d="M20 104h190"/>
        <rect class="dimf" x="150" y="40" width="54" height="64" rx="8"/>
        <path class="w" d="M177 56v20M167 66h20" stroke-width="3"/>
      </g>
      ${[0, 1, 2, 3].map(i => `<g class="a-move" style="offset-path:path('M60 250 H430');animation-duration:6s;animation-delay:${-i * 1.5}s;animation-timing-function:linear"><circle class="w" cy="-22" r="9"/><path class="w" d="M-14 6a14 14 0 0 1 28 0"/></g>`).join('')}
      <path class="dim" d="M40 262H560"/>`,
    // Dashboards: donut + KPI tiles + bars
    dash: `
      <g transform="translate(70 50)">
        <rect class="glass" width="460" height="220" rx="18"/>
        <g transform="translate(110 112)">
          <circle class="dim" r="62" stroke-width="16"/>
          <circle class="t a-draw" r="62" stroke-width="16" style="--len:390" transform="rotate(-90)"/>
          <circle r="62" stroke="rgb(255 255 255 / .8)" stroke-width="16" stroke-dasharray="70 400" stroke-dashoffset="-260" transform="rotate(-90)"/>
        </g>
        ${[0, 1, 2].map(i => `<rect class="dimf" x="${220 + i * 76}" y="28" width="66" height="44" rx="10"/><rect class="tf a-fill" x="${230 + i * 76}" y="52" width="${[40, 30, 46][i]}" height="8" rx="4" style="animation-delay:${i * .3}s"/>`).join('')}
        ${[46, 70, 38, 88, 60, 96, 74, 110].map((h, i) => `<rect class="tf a-grow" x="${226 + i * 27}" y="${196 - h}" width="16" height="${h}" rx="4" opacity="${.4 + i * .07}" style="animation-delay:${i * .1}s"/>`).join('')}
      </g>`,
    // MEL: indicator line vs. dashed target, milestones popping
    mel: `
      <g transform="translate(80 46)">
        <rect class="glass" width="440" height="228" rx="18"/>
        <path class="dim" d="M40 188H410M40 40V188"/>
        <path class="w" d="M40 80 L410 60" stroke-dasharray="6 8" opacity=".5"/>
        <path class="t a-draw" style="--len:480" stroke-width="3" d="M40 170 C 100 160, 120 130, 170 128 S 250 110, 290 92 S 370 70, 410 64"/>
        ${[[110, 150], [170, 128], [250, 106], [330, 82], [400, 66]].map(([x, y], i) => `<circle class="wf a-pop" cx="${x}" cy="${y}" r="7" style="animation-delay:${.4 + i * .35}s"/>`).join('')}
        ${[0, 1, 2].map(i => `<rect class="dimf" x="${60 + i * 120}" y="200" width="100" height="14" rx="7"/><rect class="tf a-fill" x="${60 + i * 120}" y="200" width="${[100, 74, 52][i]}" height="14" rx="7" opacity=".7" style="animation-delay:${i * .4}s"/>`).join('')}
      </g>`,
    // Security: shield with scanning beam and lock
    security: `
      <g transform="translate(300 160)">
        <circle class="tf a-pulse-sm" r="110" opacity=".18"/>
        <path class="glass" stroke-width="2.5" d="M0 -118 L-92 -82 V-6 C-92 62 -46 104 0 120 C46 104 92 62 92 -6 V-82 Z"/>
        <rect class="w" x="-30" y="-8" width="60" height="48" rx="10" stroke-width="3"/>
        <path class="w" d="M-18 -8v-16a18 18 0 0 1 36 0v16" stroke-width="3"/>
        <circle class="tf a-blink" cy="16" r="6"/>
        <g class="a-scan"><path class="t" d="M-86 -60 H86" stroke-width="2" opacity=".8"/></g>
      </g>
      ${[[120, 90], [480, 90], [110, 240], [490, 240]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><rect class="glass" x="-26" y="-18" width="52" height="36" rx="8"/><path class="w a-pop" d="M-8 0l5 5 11-11" stroke-width="2.5" style="animation-delay:${i * .5}s"/></g>`).join('')}`,
    // API: two systems exchanging packets both ways
    api: `
      ${[[60, 'L'], [400, 'R']].map(([x]) => `<g transform="translate(${x} 70)"><rect class="glass" width="140" height="180" rx="18"/>${[0, 1, 2, 3].map(i => `<rect class="dimf" x="20" y="${24 + i * 36}" width="100" height="22" rx="6"/>`).join('')}</g>`).join('')}
      <path class="dim" d="M200 130 H400M200 190 H400" stroke-width="2"/>
      <path class="t a-dash" d="M200 130 H400" stroke-width="2"/>
      <path class="t a-dash" d="M400 190 H200" stroke-width="2"/>
      ${[0, 1, 2].map(i => `<rect class="tf a-move" x="-9" y="-6" width="18" height="12" rx="3" style="offset-path:path('M200 130 H400');animation-duration:2.4s;animation-delay:${i * .8}s;animation-timing-function:linear"/>`).join('')}
      ${[0, 1, 2].map(i => `<rect class="wf a-move" x="-9" y="-6" width="18" height="12" rx="3" style="offset-path:path('M400 190 H200');animation-duration:2.4s;animation-delay:${i * .8 + .4}s;animation-timing-function:linear"/>`).join('')}
      <g transform="translate(300 160)"><circle r="26" fill="#0d2a4e" stroke="rgb(46 192 204 / .8)" stroke-width="2.5"/><path class="w" d="M-8 -12v8M8 -12v8M-12 -4h24v4a12 12 0 0 1-24 0zM0 12v8" stroke-width="2.5"/></g>`,
    // ICT training: presentation screen + audience
    ict: `
      <g transform="translate(150 34)">
        <rect class="glass" width="300" height="170" rx="16" stroke-width="2.5"/>
        <path class="dim" d="M150 170v26M110 196h80"/>
        <path class="t a-draw" style="--len:300" stroke-width="3" d="M30 130 L90 96 L140 112 L200 62 L270 44"/>
        ${[0, 1, 2].map(i => `<rect class="dimf" x="${30 + i * 82}" y="22" width="70" height="12" rx="6"/>`).join('')}
      </g>
      ${[120, 230, 370, 480].map((x, i) => `<g transform="translate(${x} 262)"><g class="a-float" style="animation-delay:${i * .4}s"><circle class="w" cy="-22" r="12"/><path class="w" d="M-20 12a20 20 0 0 1 40 0"/></g></g>`).join('')}`
  };
})();
