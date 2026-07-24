(function(){
  const canvas = document.getElementById("scene-canvas");
  if(!canvas) return;

  let W = 72, H = 26;

  function measureGrid(){
    const test = document.createElement("span");
    test.style.cssText = "font-family:'DM Mono',monospace;font-size:11px;line-height:1.1;position:absolute;visibility:hidden;white-space:pre;letter-spacing:0em;";
    test.textContent = "X";
    document.body.appendChild(test);
    const cw = test.getBoundingClientRect().width || 6.6;
    document.body.removeChild(test);
    const wrap = canvas.parentElement;
    const containerW = wrap ? wrap.getBoundingClientRect().width : window.innerWidth;
    const containerH = wrap ? wrap.getBoundingClientRect().height : 400;
    W = Math.max(40, Math.floor(containerW / cw));
    H = Math.max(18, Math.floor(containerH / (11 * 1.1)));
  }
  measureGrid();

  // Single slider: 0 = midnight, 50 = noon, 100 = midnight (wraps)
  const timeSlider = document.getElementById("s-time");

  function lerpRgb(a,b,t){return[Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];}
  function darken(c,f){return[Math.round(c[0]*(1-f)),Math.round(c[1]*(1-f)),Math.round(c[2]*(1-f))];}
  function clamp01(v){return Math.max(0,Math.min(1,v));}

  // ── Sky palette stops ──
  const NIGHT_TOP=[8,10,28],   NIGHT_BOT=[20,24,48];
  const DAY_TOP=[58,123,213],  DAY_BOT=[140,185,235];
  const TWI_TOP=[110,65,110],  TWI_BOT=[255,140,90]; // dawn/dusk tint, blended in on top

  // ── Ground palette ──
  const GRASS_NIGHT=[18,32,24], GRASS_DAY=[74,150,42], GRASS_TWI=[120,95,45];

  // ── Foliage palette (evergreen, shaded by light) ──
  const LEAF_PALETTE=[[34,120,45],[42,140,55],[26,100,38],[51,150,68],[34,110,50],[58,160,72],[30,95,40]];

  let curL = 1, curW = 0; // light level (0=night,1=noon) and twilight warmth (0..1), updated each frame

  function leafRgb(x,y){
    const n=((x*7+y*13+Math.floor(t*0.4)*3)%7+7)%7;
    const base=LEAF_PALETTE[n];
    const night=darken(base,0.7);
    let c=lerpRgb(night,base,curL);
    c=lerpRgb(c,[215,155,60],curW*0.3);
    return c;
  }

  let skyNoise=[];
  function buildSkyNoise(){skyNoise=[];for(let y=0;y<H;y++){skyNoise.push([]);for(let x=0;x<W;x++)skyNoise[y].push(Math.random());}}
  buildSkyNoise();

  // Stable per-cell randomness for grass texture — avoids the (x*3+y)%n
  // modulo pattern tiling into a visible repeating "word".
  let grassNoise=[];
  function buildGrassNoise(){grassNoise=[];for(let y=0;y<H;y++){grassNoise.push([]);for(let x=0;x<W;x++)grassNoise[y].push(Math.random());}}
  buildGrassNoise();

  let t=0;

  const SUN_R=2.6, MOON_R=2.2;

  function paintCanopy(set,cx,cy,rx,ry,GRASS_Y,lChars,density){
    for(let dy=-Math.ceil(ry+1);dy<=Math.ceil(ry+1);dy++){
      for(let dx=-Math.ceil(rx+1);dx<=Math.ceil(rx+1);dx++){
        const px=Math.round(cx+dx), py=Math.round(cy+dy);
        if(py<0||py>=GRASS_Y||px<0||px>=W) continue;
        const inside=(dx*dx)/(rx*rx)+(dy*dy)/(ry*ry);
        const jag=0.28*Math.sin(dx*2.5+dy*1.9+t*0.25)+0.18*Math.sin(dx*1.3-dy*3.1+t*0.18)+0.12*Math.sin(dx*4.1+dy*0.7);
        if(inside+jag>1.08) continue;
        if(inside>0.5&&Math.random()<0.08) continue;
        if(Math.random() > density) continue;
        const rgb=leafRgb(px,py);
        const ci=Math.abs(px*3+py*7+Math.floor(t*0.3))%lChars.length;
        set(px,py+Math.round(Math.sin(t*0.4+px*0.3)*0.3),lChars[ci],rgb);
      }
    }
  }

  // ── MAIN TREE ──
  function drawMainTree(set,cx,GRASS_Y,H,W,brRgb){
    const tx=cx-1;
    const CROWN_BOT=Math.floor(GRASS_Y*0.55);
    const TRUNK_TOP=Math.floor(GRASS_Y*0.42);
    const lCharsMain=["@","&","#","Q","0","o","q","G"];

    const bk0=lerpRgb([40,24,12],[68,38,16],curL), bk1=lerpRgb([32,18,10],[55,30,12],curL);
    for(let y=TRUNK_TOP;y<GRASS_Y;y++){
      set(tx,  y, y%3===0?'{':(y%5===2?'(':  '|'), bk0);
      set(tx+1,y, y%3===0?'}':(y%5===2?')':  '|'), bk1);
      if(y>=GRASS_Y-2){ set(tx-1,y,'/',bk1); set(tx+2,y,'\\',bk1); }
    }
    for(let y=TRUNK_TOP-3;y<TRUNK_TOP;y++) set(tx,y,'|',brRgb);

    const branches=[
      [[tx-2,CROWN_BOT-1,'/'],[tx-3,CROWN_BOT-2,'-'],[tx-4,CROWN_BOT-3,'/'],[tx-5,CROWN_BOT-4,'-'],[tx-6,CROWN_BOT-5,'/'],[tx-7,CROWN_BOT-5,'-']],
      [[tx-3,CROWN_BOT-3,'\\'],[tx-4,CROWN_BOT-4,'-'],[tx-5,CROWN_BOT-5,'\\']],
      [[tx+3,CROWN_BOT-1,'\\'],[tx+4,CROWN_BOT-2,'-'],[tx+5,CROWN_BOT-3,'\\'],[tx+6,CROWN_BOT-4,'-'],[tx+7,CROWN_BOT-5,'\\'],[tx+8,CROWN_BOT-5,'-']],
      [[tx+4,CROWN_BOT-3,'/'],[tx+3,CROWN_BOT-4,'-'],[tx+2,CROWN_BOT-5,'/']],
      [[tx-2,TRUNK_TOP-1,'/'],[tx-3,TRUNK_TOP-2,'-'],[tx-4,TRUNK_TOP-3,'/'],[tx-5,TRUNK_TOP-4,'-'],[tx-6,TRUNK_TOP-4,'/']],
      [[tx+3,TRUNK_TOP-1,'\\'],[tx+4,TRUNK_TOP-2,'-'],[tx+5,TRUNK_TOP-3,'\\'],[tx+6,TRUNK_TOP-4,'-'],[tx+7,TRUNK_TOP-4,'\\']],
      [[tx,TRUNK_TOP-4,'|'],[tx,TRUNK_TOP-5,'/'],[tx-1,TRUNK_TOP-6,'-']],
      [[tx+1,TRUNK_TOP-5,'\\'],[tx+2,TRUNK_TOP-6,'-']],
    ];
    branches.forEach(b=>b.forEach(([bx,by,bc])=>{if(by>=0&&by<GRASS_Y&&bx>=0&&bx<W)set(bx,by,bc,brRgb);}));

    const crownCX=cx, crownCY=Math.floor(GRASS_Y*0.35);
    const CRX=10, CRY=8;
    const density=0.82;
    const bumps=[
      {cx:crownCX-9,cy:crownCY+1,rx:3.5,ry:3},
      {cx:crownCX-7,cy:crownCY-5,rx:4,ry:3},
      {cx:crownCX-3,cy:crownCY-7,rx:4,ry:3.5},
      {cx:crownCX+2,cy:crownCY-8,rx:3.5,ry:3},
      {cx:crownCX+6,cy:crownCY-5,rx:3.5,ry:3},
      {cx:crownCX+9,cy:crownCY,rx:3,ry:3.5},
      {cx:crownCX+7,cy:crownCY+3,rx:3,ry:2.5},
      {cx:crownCX-5,cy:crownCY+4,rx:3.5,ry:2.5},
      {cx:crownCX,cy:crownCY+5,rx:4,ry:2.5},
    ];
    paintCanopy(set,crownCX,crownCY,CRX,CRY,GRASS_Y,lCharsMain,density);
    bumps.forEach(b=>paintCanopy(set,b.cx,b.cy,b.rx,b.ry,GRASS_Y,lCharsMain,density));
  }

  // ── LEFT TREE ──
  function drawLeftTree(set,cx,GRASS_Y,H,W,brRgb){
    const tx=cx-1;
    const CROWN_BOT=Math.floor(GRASS_Y*0.58);
    const TRUNK_TOP=Math.floor(GRASS_Y*0.46);
    const lCharsLeft=["*","^","v","Y","y","n","u","w"];

    const bk0=lerpRgb([40,24,12],[68,38,16],curL), bk1=lerpRgb([32,18,10],[55,30,12],curL);
    for(let y=TRUNK_TOP;y<GRASS_Y;y++){
      set(tx,  y, y%3===0?'{':(y%5===2?'(':  '|'), bk0);
      set(tx+1,y, y%3===0?'}':(y%5===2?')':  '|'), bk1);
      if(y>=GRASS_Y-2){ set(tx-1,y,'/',bk1); set(tx+2,y,'\\',bk1); }
    }
    for(let y=TRUNK_TOP-2;y<TRUNK_TOP;y++) set(tx,y,'|',brRgb);

    const branches=[
      [[tx-2,CROWN_BOT-1,'/'],[tx-3,CROWN_BOT-2,'-'],[tx-4,CROWN_BOT-3,'/'],[tx-5,CROWN_BOT-4,'-'],[tx-6,CROWN_BOT-4,'/']],
      [[tx-3,CROWN_BOT-3,'\\'],[tx-4,CROWN_BOT-4,'-'],[tx-5,CROWN_BOT-4,'\\']],
      [[tx+3,CROWN_BOT-1,'\\'],[tx+4,CROWN_BOT-2,'-'],[tx+5,CROWN_BOT-3,'\\'],[tx+6,CROWN_BOT-4,'-']],
      [[tx-2,TRUNK_TOP-1,'/'],[tx-3,TRUNK_TOP-2,'-'],[tx-4,TRUNK_TOP-3,'/'],[tx-5,TRUNK_TOP-4,'-']],
      [[tx+3,TRUNK_TOP-1,'\\'],[tx+4,TRUNK_TOP-2,'-'],[tx+5,TRUNK_TOP-3,'\\']],
      [[tx,TRUNK_TOP-4,'|'],[tx-1,TRUNK_TOP-5,'/']],
    ];
    branches.forEach(b=>b.forEach(([bx,by,bc])=>{if(by>=0&&by<GRASS_Y&&bx>=0&&bx<W)set(bx,by,bc,brRgb);}));

    const crownCX=cx-1, crownCY=Math.floor(GRASS_Y*0.38);
    const CRX=7, CRY=7.5;
    const density=0.82;
    const bumps=[
      {cx:crownCX-6,cy:crownCY+1,rx:2.5,ry:2.5},
      {cx:crownCX-5,cy:crownCY-5,rx:3,ry:2.5},
      {cx:crownCX-1,cy:crownCY-7,rx:3,ry:3},
      {cx:crownCX+3,cy:crownCY-6,rx:2.5,ry:2.5},
      {cx:crownCX+6,cy:crownCY-2,rx:2.5,ry:3},
      {cx:crownCX+5,cy:crownCY+3,rx:2,ry:2},
      {cx:crownCX-3,cy:crownCY+4,rx:2.5,ry:1.8},
      {cx:crownCX,cy:crownCY+5,rx:3,ry:2},
    ];
    paintCanopy(set,crownCX,crownCY,CRX,CRY,GRASS_Y,lCharsLeft,density);
    bumps.forEach(b=>paintCanopy(set,b.cx,b.cy,b.rx,b.ry,GRASS_Y,lCharsLeft,density));
  }

  // ── RIGHT TREE ──
  function drawRightTree(set,cx,GRASS_Y,H,W,brRgb){
    const tx=cx-1;
    const CROWN_BOT=Math.floor(GRASS_Y*0.57);
    const TRUNK_TOP=Math.floor(GRASS_Y*0.45);
    const lCharsRight=["O","o","(",")","{","}","s","S","8"];

    const bk0=lerpRgb([40,24,12],[68,38,16],curL), bk1=lerpRgb([32,18,10],[55,30,12],curL);
    for(let y=TRUNK_TOP;y<GRASS_Y;y++){
      set(tx,  y, y%3===0?'{':(y%5===2?'(':  '|'), bk0);
      set(tx+1,y, y%3===0?'}':(y%5===2?')':  '|'), bk1);
      if(y>=GRASS_Y-2){ set(tx-1,y,'/',bk1); set(tx+2,y,'\\',bk1); }
    }
    for(let y=TRUNK_TOP-2;y<TRUNK_TOP;y++) set(tx,y,'|',brRgb);

    const branches=[
      [[tx-2,CROWN_BOT-1,'/'],[tx-3,CROWN_BOT-2,'-'],[tx-4,CROWN_BOT-3,'/'],[tx-5,CROWN_BOT-4,'-']],
      [[tx-3,CROWN_BOT-3,'\\'],[tx-4,CROWN_BOT-4,'-'],[tx-5,CROWN_BOT-4,'\\']],
      [[tx+3,CROWN_BOT-1,'\\'],[tx+4,CROWN_BOT-2,'-'],[tx+5,CROWN_BOT-3,'\\'],[tx+6,CROWN_BOT-4,'-'],[tx+7,CROWN_BOT-4,'\\']],
      [[tx+4,CROWN_BOT-3,'/'],[tx+3,CROWN_BOT-4,'-'],[tx+2,CROWN_BOT-5,'/']],
      [[tx-2,TRUNK_TOP-1,'/'],[tx-3,TRUNK_TOP-2,'-'],[tx-4,TRUNK_TOP-3,'\\']],
      [[tx+3,TRUNK_TOP-1,'\\'],[tx+4,TRUNK_TOP-2,'-'],[tx+5,TRUNK_TOP-3,'\\'],[tx+6,TRUNK_TOP-4,'-']],
      [[tx,TRUNK_TOP-4,'|'],[tx+1,TRUNK_TOP-5,'\\']],
    ];
    branches.forEach(b=>b.forEach(([bx,by,bc])=>{if(by>=0&&by<GRASS_Y&&bx>=0&&bx<W)set(bx,by,bc,brRgb);}));

    const crownCX=cx+1, crownCY=Math.floor(GRASS_Y*0.37);
    const CRX=9, CRY=6;
    const density=0.82;
    const bumps=[
      {cx:crownCX-8,cy:crownCY,rx:3,ry:2.5},
      {cx:crownCX-6,cy:crownCY-3,rx:3,ry:2.5},
      {cx:crownCX-2,cy:crownCY-5,rx:3.5,ry:2.8},
      {cx:crownCX+3,cy:crownCY-5,rx:3,ry:2.5},
      {cx:crownCX+7,cy:crownCY-2,rx:2.5,ry:2.8},
      {cx:crownCX+8,cy:crownCY+2,rx:2.5,ry:2},
      {cx:crownCX+2,cy:crownCY+4,rx:3.5,ry:2},
      {cx:crownCX-4,cy:crownCY+3,rx:3,ry:2},
    ];
    paintCanopy(set,crownCX,crownCY,CRX,CRY,GRASS_Y,lCharsRight,density);
    bumps.forEach(b=>paintCanopy(set,b.cx,b.cy,b.rx,b.ry,GRASS_Y,lCharsRight,density));
  }

  // ── SUN / MOON — single celestial body, position + identity driven by TIME ──
  function drawCelestial(set,GRASS_Y,H,W){
    const TIME = ((timeSlider?parseFloat(timeSlider.value):50) / 100) % 1;
    // topY leaves clearance at the top of the canvas for the nav bar overlay —
    // the sun/moon arc never rises above this row.
    const topY = H*0.24, horizonY = GRASS_Y*0.98;

    const sunrise=0.2, sunset=0.8;
    const isDay = TIME > sunrise && TIME < sunset;

    let p, cx, cy, isSun;
    if(isDay){
      p = (TIME - sunrise) / (sunset - sunrise);
      isSun = true;
    } else {
      p = TIME >= sunset ? (TIME - sunset) / (1 - sunset + sunrise) : (TIME + (1 - sunset)) / (1 - sunset + sunrise);
      isSun = false;
    }

    // The arc's peak (p=0.5, its highest and most visible point) would otherwise
    // land at horizontal center — directly behind the middle tree. Give the sun's
    // arc a midpoint shifted left of center and the moon's shifted right, by an
    // equal amount, so the peak clears the tree on both sides.
    const CENTER_FRAC = 0.5, PEAK_OFFSET = 0.09, HALF_SPAN = 0.42;
    const midFrac = isSun ? (CENTER_FRAC - PEAK_OFFSET) : (CENTER_FRAC + PEAK_OFFSET);
    const cxFrac = (midFrac - HALF_SPAN) + p*(HALF_SPAN*2);
    cx = cxFrac*W;
    const heightFactor = Math.sin(Math.PI*p);
    cy = horizonY - heightFactor*(horizonY-topY);

    const R = isSun ? SUN_R : MOON_R;
    const coreRgb = isSun ? lerpRgb([255,225,90],[255,250,225],curW*0.6) : [225,232,245];
    const rimRgb  = isSun ? [255,170,40] : [175,190,220];
    const rayRgb  = [255,195,70];
    const asp=0.52;

    for(let dy=-6;dy<=6;dy++) for(let dx=-10;dx<=10;dx++){
      const dist=Math.sqrt((dx*asp)*(dx*asp)+dy*dy), px=Math.round(cx+dx), py=Math.round(cy+dy);
      if(dist<R-0.15) set(px,py, isSun ? ["O","0","o","Q","O","0","o"][Math.abs((px*3+py*5+Math.floor(t*0.4))%7)] : ["O","0","o"][Math.abs((px*3+py*5)%3)], coreRgb);
      else if(dist<R+0.25) set(px,py,'o',rimRgb);
      // Only the sun gets the sparkling ray glow — the moon stays a clean, still disc.
      else if(isSun && dist<R+1.4 && Math.random()<0.55) set(px,py,['.','`',"'",'*'][Math.abs((px*7+py*11+Math.floor(t))%4)],rayRgb);
    }
  }

  function render(){
    t+=0.025;

    const TIME = ((timeSlider?parseFloat(timeSlider.value):50) / 100) % 1;
    // L: 0 at midnight, 1 at noon, smooth raised-cosine
    const L = clamp01(0.5*(1+Math.cos(2*Math.PI*(TIME-0.5))));
    // W: twilight warmth, peaks at dawn/dusk (where L crosses ~0.5), 0 at noon/midnight
    const Wt = clamp01(1 - Math.abs(2*L-1));
    curL = L; curW = Wt;

    let skyTop=lerpRgb(NIGHT_TOP,DAY_TOP,L); skyTop=lerpRgb(skyTop,TWI_TOP,Wt*0.55);
    let skyBot=lerpRgb(NIGHT_BOT,DAY_BOT,L); skyBot=lerpRgb(skyBot,TWI_BOT,Wt*0.65);

    let grassRgb=lerpRgb(GRASS_NIGHT,GRASS_DAY,L);
    grassRgb=lerpRgb(grassRgb,GRASS_TWI,Wt*0.35);

    const GRASS_Y=Math.floor(H*0.82);
    const CX_MAIN=Math.floor(W*0.50);
    const CX_LEFT=Math.floor(W*0.28);
    const CX_RIGHT=Math.floor(W*0.70);

    const grid=[];
    for(let y=0;y<H;y++){grid.push([]);for(let x=0;x<W;x++){
      const skyFrac=y/Math.max(1,GRASS_Y);
      grid[y].push({ch:' ',rgb:lerpRgb(skyTop,skyBot,skyFrac)});
    }}
    function set(x,y,ch,rgb){if(y>=0&&y<H&&x>=0&&x<W)grid[y][x]={ch,rgb};}

    // sky texture: stars at night, faint sparkle by day
    const starVisibility = clamp01(1 - L*1.2);
    for(let y=0;y<GRASS_Y;y++){
      const rowSky=lerpRgb(skyTop,skyBot,y/Math.max(1,GRASS_Y));
      const rowBright=lerpRgb(rowSky,[255,255,255],0.35+starVisibility*0.4);
      const rowDim=darken(rowSky,0.22);
      for(let x=0;x<W;x++){
        grid[y][x].rgb=rowSky;
        const n=(skyNoise[y]&&skyNoise[y][x]!==undefined)?skyNoise[y][x]:0.5;
        const a=(n+t*0.01)%1;
        const thresh=0.006+starVisibility*0.02;
        if(a<thresh) set(x,y, starVisibility>0.5 ? (a<thresh*0.3?'*':'.') : '.', rowBright);
        else if(a<thresh*2.2) set(x,y,'.',rowDim);
      }
    }

    drawCelestial(set,GRASS_Y,H,W);

    const gChars=["W","w","M","m","v","^","n","u",",","'"];
    for(let y=GRASS_Y;y<H;y++){
      const depth=(y-GRASS_Y)/(H-GRASS_Y);
      for(let x=0;x<W;x++){
        const n=(grassNoise[y]&&grassNoise[y][x]!==undefined)?grassNoise[y][x]:Math.random();
        // gentle wind ripple only right at the tree line, so it doesn't scroll like ticker text
        const ripple=(y===GRASS_Y)?Math.sin(t*0.5+x*0.35)*0.12:0;
        const idx=Math.floor(((n+ripple+1)%1)*gChars.length);
        const rRgb=darken(grassRgb, clamp01(depth*0.45 + (n-0.5)*0.12));
        set(x,y,gChars[idx],rRgb);
      }
    }

    const brRgb=lerpRgb(darken([90,48,21],0.55),[90,48,21],L);

    drawLeftTree(set,CX_LEFT,GRASS_Y,H,W,brRgb);
    drawRightTree(set,CX_RIGHT,GRASS_Y,H,W,brRgb);
    drawMainTree(set,CX_MAIN,GRASS_Y,H,W,brRgb);

    let html="",cur=null;
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        const cell=grid[y][x];
        const key=cell.rgb[0]+','+cell.rgb[1]+','+cell.rgb[2];
        if(key!==cur){if(cur!==null)html+='</span>';html+=`<span style="color:rgb(${key})">`;cur=key;}
        const c=cell.ch;
        html+=c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c;
      }
      html+='\n';
    }
    if(cur) html+='</span>';
    canvas.innerHTML=html;

    const topKey=`rgb(${skyTop[0]},${skyTop[1]},${skyTop[2]})`;
    const botKey=`rgb(${skyBot[0]},${skyBot[1]},${skyBot[2]})`;
    canvas.style.background=`linear-gradient(to bottom,${topKey} 0%,${botKey} 100%)`;

    requestAnimationFrame(render);
  }

  if(window.ResizeObserver){
    new ResizeObserver(()=>{measureGrid();buildSkyNoise();buildGrassNoise();}).observe(canvas.parentElement||canvas);
  }
  render();
})();