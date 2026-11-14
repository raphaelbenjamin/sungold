// Original synthetic jacket artwork. Canvas produces image data for the existing cover API.
export function sampleCover(title: string, index: number): Uint8Array {
  const canvas = document.createElement("canvas");
  canvas.width = 600; canvas.height = 800;
  const ctx = canvas.getContext("2d")!;
  const palettes = [
    ["#dfded0", "#244940", "#aabb8c"], ["#d8ad83", "#533a33", "#e8d8b7"],
    ["#c4d1d0", "#28485b", "#829b96"], ["#333c52", "#e9d9be", "#bd835a"],
    ["#bd573e", "#f5e5ca", "#6a3432"], ["#e1c95b", "#243b45", "#b0b6a0"],
  ];
  const [paper, ink, accent] = palettes[index % palettes.length];
  ctx.fillStyle = paper; ctx.fillRect(0, 0, 600, 800);
  ctx.fillStyle = ink; ctx.font = "17px sans-serif"; ctx.fillText("S U N G O L D   /   I T A L I A N", 40, 52);
  ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath();ctx.moveTo(40,70);ctx.lineTo(560,70);ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(420,370,135,0,Math.PI*2);ctx.fill();
  ctx.fillStyle = ink;
  for (let j=0;j<4;j++) {
    ctx.globalAlpha = .22 + j*.17;
    ctx.beginPath(); ctx.moveTo(0,510+j*40);
    ctx.bezierCurveTo(180,210+j*80,350,690-j*35,600,410+j*65);
    ctx.lineTo(600,800);ctx.lineTo(0,800);ctx.closePath();ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.font = "52px Georgia";
  let y=137, line="";
  for(const word of title.split(" ")) {
    if(ctx.measureText(line+word).width>495) {ctx.fillText(line.trim(),40,y);y+=58;line="";}
    line+=word+" ";
  }
  ctx.fillText(line.trim(),40,y);
  ctx.fillStyle=paper; ctx.font="18px sans-serif"; ctx.fillText("STORIES FOR A SLOWER DAY",40,751);
  const bytes = atob(canvas.toDataURL("image/jpeg", .9).split(",")[1]);
  return Uint8Array.from(bytes, char => char.charCodeAt(0));
}
