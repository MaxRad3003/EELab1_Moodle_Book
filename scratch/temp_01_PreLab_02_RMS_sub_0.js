(function () {
  const rmsVpInput = document.getElementById('rmsVp');
  const rmsWaveSelect = document.getElementById('rmsWave');
  const dispVp = document.getElementById('dispVp');
  const dispVpp = document.getElementById('dispVpp');
  const dispVrms = document.getElementById('dispVrms');
  const dispRatio = document.getElementById('dispRatio');
  const ctrlRmsVp = document.getElementById('ctrlRmsVp');

  function getRmsRatio() {
    const wave = rmsWaveSelect.value;
    if (wave === 'square') return 1;
    if (wave === 'triangle') return 1 / Math.sqrt(3);
    return 1 / Math.sqrt(2);
  }
  function normalizedWave(x) {
    const wave = rmsWaveSelect.value;
    if (wave === 'square') return Math.sin(x) >= 0 ? 1 : -1;
    if (wave === 'triangle') return (2 / Math.PI) * Math.asin(Math.sin(x));
    return Math.sin(x);
  }
  function peakVoltage() { return parseFloat(rmsVpInput.value); }
  function voltageAt(x) { return peakVoltage() * normalizedWave(x); }
  function rmsVoltage() { return peakVoltage() * getRmsRatio(); }

  const rmsBoard = JXG.JSXGraph.initBoard('rmsBoard', { boundingbox: [-0.35, 13, 6.65, -13], axis: true, showNavigation: false, showCopyright: false });
  rmsBoard.create('text', [5.7, -1.1, 't'], {fontSize: 15, fixed: true});
  rmsBoard.create('text', [0.15, 12.1, 'v(t) [V]'], {fontSize: 15, fixed: true});
  rmsBoard.create('functiongraph', [voltageAt, 0, 2 * Math.PI], { strokeColor: '#005696', strokeWidth: 3, name: 'v(t)' });
  rmsBoard.create('functiongraph', [rmsVoltage, 0, 2 * Math.PI], { strokeColor: '#28a745', strokeWidth: 2, dash: 2 });
  rmsBoard.create('functiongraph', [function(){ return -rmsVoltage(); }, 0, 2 * Math.PI], { strokeColor: '#28a745', strokeWidth: 2, dash: 2 });
  rmsBoard.create('functiongraph', [function(){ return peakVoltage(); }, 0, 2 * Math.PI], { strokeColor: '#d9534f', strokeWidth: 1.5, dash: 3 });
  rmsBoard.create('functiongraph', [function(){ return -peakVoltage(); }, 0, 2 * Math.PI], { strokeColor: '#d9534f', strokeWidth: 1.5, dash: 3 });
  rmsBoard.create('text', [4.8, function(){ return rmsVoltage() + 0.45; }, '+VRMS'], { fontSize: 14, color: '#28a745', fixed: true });
  rmsBoard.create('text', [4.8, function(){ return peakVoltage() + 0.45; }, '+Vp'], { fontSize: 14, color: '#d9534f', fixed: true });

  function updateRmsDisplay() {
    const vp = peakVoltage();
    const vrms = rmsVoltage();
    ctrlRmsVp.textContent = vp.toFixed(2) + ' V';
    dispVp.textContent = vp.toFixed(2) + ' V';
    dispVpp.textContent = (2 * vp).toFixed(2) + ' V';
    dispVrms.textContent = vrms.toFixed(2) + ' V';
    dispRatio.textContent = getRmsRatio().toFixed(3);
    rmsBoard.update();
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
  }
  rmsVpInput.addEventListener('input', updateRmsDisplay);
  rmsWaveSelect.addEventListener('change', updateRmsDisplay);
  updateRmsDisplay();
})();

(function () {
  const seriesVpInput = document.getElementById('seriesVp');
  const seriesRInput = document.getElementById('seriesR');
  const seriesFreqInput = document.getElementById('seriesFreq');
  const seriesWaveSelect = document.getElementById('seriesWave');
  const dcAutoInput = document.getElementById('dcAuto');
  const dcVoltageInput = document.getElementById('dcVoltage');
  const mainsDemoButton = document.getElementById('mainsDemo');
  const ctrlSeriesVp = document.getElementById('ctrlSeriesVp');
  const ctrlSeriesR = document.getElementById('ctrlSeriesR');
  const ctrlSeriesFreq = document.getElementById('ctrlSeriesFreq');
  const ctrlDcVoltage = document.getElementById('ctrlDcVoltage');
  const dispSeriesFreq = document.getElementById('dispSeriesFreq');
  const dispSeriesR = document.getElementById('dispSeriesR');
  const dispSeriesVrms = document.getElementById('dispSeriesVrms');
  const dispSeriesIrms = document.getElementById('dispSeriesIrms');
  const dispSeriesVdc = document.getElementById('dispSeriesVdc');
  const dispSeriesPower = document.getElementById('dispSeriesPower');
  const dispSeriesDcR = document.getElementById('dispSeriesDcR');
  const dispSeriesIdc = document.getElementById('dispSeriesIdc');
  const dispSeriesDcPower = document.getElementById('dispSeriesDcPower');
  const dcMatchStatus = document.getElementById('dcMatchStatus');
  const acHeatFill = document.getElementById('acHeatFill');
  const acHeatValue = document.getElementById('acHeatValue');
  const dcHeatFill = document.getElementById('dcHeatFill');
  const dcHeatValue = document.getElementById('dcHeatValue');
  const compAcVoltage = document.getElementById('compAcVoltage');
  const compDcVoltage = document.getElementById('compDcVoltage');
  const compAcCurrent = document.getElementById('compAcCurrent');
  const compDcCurrent = document.getElementById('compDcCurrent');
  const compAcPower = document.getElementById('compAcPower');
  const compDcPower = document.getElementById('compDcPower');
  const compAcEnergy = document.getElementById('compAcEnergy');
  const compDcEnergy = document.getElementById('compDcEnergy');
  const acSourceWavePath = document.getElementById('acSourceWavePath');
  const acSourceWaveLabel = document.getElementById('acSourceWaveLabel');

  function seriesVp() { return parseFloat(seriesVpInput.value); }
  function seriesR() { return parseFloat(seriesRInput.value); }
  function seriesFreqKhz() { return parseFloat(seriesFreqInput.value); }
  function formatFrequency(khz) { return khz < 1 ? (khz * 1000).toFixed(0) + ' Hz' : khz.toFixed(2).replace(/\.?0+$/, '') + ' kHz'; }
  function graphTimeEndMs() { return 3 / seriesFreqKhz(); }
  function isDcAuto() { return dcAutoInput.checked; }
  function seriesRmsRatio() {
    const wave = seriesWaveSelect.value;
    if (wave === 'square') return 1;
    if (wave === 'triangle') return 1 / Math.sqrt(3);
    return 1 / Math.sqrt(2);
  }
  function seriesNormalizedWave(phase) {
    const wave = seriesWaveSelect.value;
    if (wave === 'square') return Math.sin(phase) >= 0 ? 1 : -1;
    if (wave === 'triangle') return (2 / Math.PI) * Math.asin(Math.sin(phase));
    return Math.sin(phase);
  }
  function seriesVrms() { return seriesVp() * seriesRmsRatio(); }
  function seriesVoltage(tMs) { return seriesVp() * seriesNormalizedWave(2 * Math.PI * seriesFreqKhz() * tMs); }
  function seriesCurrentMa(tMs) { return (seriesVoltage(tMs) / seriesR()) * 1000; }
  function seriesPowerMw(tMs) { return seriesVoltage(tMs) * seriesCurrentMa(tMs); }
  function seriesAveragePowerMw() { const vrms = seriesVrms(); const irmsMa = (vrms / seriesR()) * 1000; return vrms * irmsMa; }
  function equivalentDcVoltage() { return isDcAuto() ? seriesVrms() : parseFloat(dcVoltageInput.value); }
  function equivalentDcCurrentMa() { return (equivalentDcVoltage() / seriesR()) * 1000; }
  function dcPowerMw() { return equivalentDcVoltage() * equivalentDcCurrentMa(); }
  function dcEnergyUj(tMs) { return dcPowerMw() * tMs; }
  function heatColor(percent) { return percent > 75 ? '#d9534f' : percent > 40 ? '#f0ad4e' : '#28a745'; }

  function updateAcSourceSymbol() {
    const wave = seriesWaveSelect.value;
    if (!acSourceWavePath || !acSourceWaveLabel) return;
    if (wave === 'square') {
      acSourceWavePath.setAttribute('d', 'M80 105 L80 82 L105 82 L105 108 L130 108 L130 85');
      acSourceWaveLabel.textContent = 'v(t) ריבועי';
    } else if (wave === 'triangle') {
      acSourceWavePath.setAttribute('d', 'M80 105 L93 82 L107 108 L121 82 L134 105');
      acSourceWaveLabel.textContent = 'v(t) משולש';
    } else {
      acSourceWavePath.setAttribute('d', 'M82 95 C90 78, 99 78, 107 95 S124 112, 132 95');
      acSourceWaveLabel.textContent = 'v(t) סינוס';
    }
  }

  function updateHeatDisplay(acPowerMw, dcPowerValueMw) {
    const maxPower = Math.max(acPowerMw, dcPowerValueMw, 1);
    const acPercent = Math.min(100, (acPowerMw / maxPower) * 100);
    const dcPercent = Math.min(100, (dcPowerValueMw / maxPower) * 100);
    acHeatFill.style.width = acPercent.toFixed(0) + '%';
    dcHeatFill.style.width = dcPercent.toFixed(0) + '%';
    acHeatFill.style.backgroundColor = heatColor(acPercent);
    dcHeatFill.style.backgroundColor = heatColor(dcPercent);
    acHeatValue.textContent = acPowerMw.toFixed(1) + ' mW';
    dcHeatValue.textContent = dcPowerValueMw.toFixed(1) + ' mW';
  }

  function updateDcMatchStatus(vrms, vdc) {
    const difference = vdc - vrms;
    dcMatchStatus.className = Math.abs(difference) <= 0.5 ? 'match-ok text-success' : 'match-warn text-danger';
    if (Math.abs(difference) <= 0.5) { dcMatchStatus.textContent = 'שקול'; } 
    else if (difference < 0) { dcMatchStatus.textContent = 'חסר ' + Math.abs(difference).toFixed(1) + ' V'; } 
    else { dcMatchStatus.textContent = 'גבוה ב-' + difference.toFixed(1) + ' V'; }
  }

  function setupMainsDemo() {
    seriesVpInput.value = (230 / seriesRmsRatio()).toFixed(1);
    seriesFreqInput.value = '0.05';
    dcAutoInput.checked = true;
    dcVoltageInput.disabled = true;
    dcVoltageInput.value = '230';
    updateSeriesDisplay();
  }

  function seriesEnergyUj(tMs) {
    if (tMs <= 0) return 0;
    const total = graphTimeEndMs();
    const steps = Math.max(32, Math.ceil(180 * tMs / total));
    const dt = tMs / steps;
    let area = 0;
    let previous = seriesPowerMw(0);
    for (let i = 1; i <= steps; i += 1) {
      const current = seriesPowerMw(i * dt);
      area += (previous + current) * 0.5 * dt;
      previous = current;
    }
    return area;
  }

  function niceCeil(value, minimum) {
    const safeValue = Math.max(value, minimum);
    const exponent = Math.floor(Math.log10(safeValue));
    const base = Math.pow(10, exponent);
    const normalized = safeValue / base;
    let nice = 1;
    if (normalized > 5) nice = 10;
    else if (normalized > 2) nice = 5;
    else if (normalized > 1) nice = 2;
    return nice * base;
  }

  function getScaleValues() {
    const vp = seriesVp();
    const tEnd = graphTimeEndMs();
    const currentPeakMa = (vp / seriesR()) * 1000;
    const powerPeakMw = (vp * currentPeakMa);
    const energyEndUj = seriesEnergyUj(tEnd);
    const dcCurrentMa = equivalentDcCurrentMa();
    const dcPowerEndMw = dcPowerMw();
    const dcEnergyEndUj = dcEnergyUj(tEnd);
    return {
      voltageLimit: niceCeil(Math.max(vp, equivalentDcVoltage()) * 1.25, 2),
      currentLimit: niceCeil(Math.max(currentPeakMa, dcCurrentMa) * 1.25, 2),
      powerLimit: niceCeil(Math.max(powerPeakMw, dcPowerEndMw) * 1.18, 5),
      energyLimit: niceCeil(Math.max(energyEndUj, dcEnergyEndUj) * 1.18, 10),
      dcVoltageLimit: niceCeil(equivalentDcVoltage() * 1.8, 2),
      dcCurrentLimit: niceCeil(dcCurrentMa * 1.8, 2),
      dcPowerLimit: niceCeil(dcPowerEndMw * 1.8, 5),
      dcWorkLimit: niceCeil(dcEnergyEndUj * 1.18, 10),
      timeEnd: tEnd
    };
  }

  function updateGraphScales() {
    const scales = getScaleValues();
    const xPad = scales.timeEnd * 0.14;
    seriesCurrentBoard.setBoundingBox([-xPad, scales.currentLimit * 1.08, scales.timeEnd + xPad, -scales.currentLimit * 1.16], false);
    seriesVoltageBoard.setBoundingBox([-xPad, scales.voltageLimit * 1.08, scales.timeEnd + xPad, -scales.voltageLimit * 1.16], false);
    seriesPowerBoard.setBoundingBox([-xPad, scales.powerLimit * 1.08, scales.timeEnd + xPad, -0.18 * scales.powerLimit], false);
    seriesEnergyBoard.setBoundingBox([-xPad, scales.energyLimit * 1.08, scales.timeEnd + xPad, -0.14 * scales.energyLimit], false);
    comparisonEnergyBoard.setBoundingBox([-xPad, scales.energyLimit * 1.08, scales.timeEnd + xPad, -0.14 * scales.energyLimit], false);
    dcViBoard.setBoundingBox([-0.18 * scales.dcVoltageLimit, scales.dcCurrentLimit * 1.08, scales.dcVoltageLimit * 1.08, -0.16 * scales.dcCurrentLimit], false);
    dcPowerTimeBoard.setBoundingBox([-xPad, scales.dcPowerLimit * 1.08, scales.timeEnd + xPad, -0.18 * scales.dcPowerLimit], false);
    dcWorkTimeBoard.setBoundingBox([-xPad, scales.dcWorkLimit * 1.08, scales.timeEnd + xPad, -0.14 * scales.dcWorkLimit], false);
  }

  const seriesCurrentBoard = JXG.JSXGraph.initBoard('seriesCurrentBoard', { boundingbox: [-0.5, 130, 10.5, -130], axis: true, showNavigation: false, showCopyright: false });
  const seriesVoltageBoard = JXG.JSXGraph.initBoard('seriesVoltageBoard', { boundingbox: [-0.5, 13, 10.5, -13], axis: true, showNavigation: false, showCopyright: false });
  const seriesPowerBoard = JXG.JSXGraph.initBoard('seriesPowerBoard', { boundingbox: [-0.5, 1600, 10.5, -80], axis: true, showNavigation: false, showCopyright: false });
  const seriesEnergyBoard = JXG.JSXGraph.initBoard('seriesEnergyBoard', { boundingbox: [-0.5, 7600, 10.5, -300], axis: true, showNavigation: false, showCopyright: false });
  const comparisonEnergyBoard = JXG.JSXGraph.initBoard('comparisonEnergyBoard', { boundingbox: [-0.5, 7600, 10.5, -300], axis: true, showNavigation: false, showCopyright: false });
  const dcViBoard = JXG.JSXGraph.initBoard('dcViBoard', { boundingbox: [-0.8, 90, 10, -8], axis: true, showNavigation: false, showCopyright: false });
  const dcPowerTimeBoard = JXG.JSXGraph.initBoard('dcPowerTimeBoard', { boundingbox: [-0.5, 900, 10.5, -60], axis: true, showNavigation: false, showCopyright: false });
  const dcWorkTimeBoard = JXG.JSXGraph.initBoard('dcWorkTimeBoard', { boundingbox: [-0.5, 7600, 10.5, -300], axis: true, showNavigation: false, showCopyright: false });

  seriesCurrentBoard.create('text', [0.12, function(){ return getScaleValues().currentLimit * 0.86; }, 'i(t) [mA]'], {fontSize: 15, fixed: true, color: '#28a745'});
  seriesCurrentBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().currentLimit * 0.82; }, 't [ms]'], {fontSize: 15, fixed: true});
  seriesCurrentBoard.create('functiongraph', [seriesCurrentMa, 0, graphTimeEndMs], { strokeColor: '#28a745', strokeWidth: 3 });
  seriesCurrentBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });
  seriesCurrentBoard.create('functiongraph', [equivalentDcCurrentMa, 0, graphTimeEndMs], { strokeColor: '#8e44ad', strokeWidth: 2, dash: 2 });
  
  seriesVoltageBoard.create('text', [0.12, function(){ return getScaleValues().voltageLimit * 0.86; }, 'v_R(t) [V]'], {fontSize: 15, fixed: true, color: '#005696'});
  seriesVoltageBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().voltageLimit * 0.82; }, 't [ms]'], {fontSize: 15, fixed: true});
  seriesVoltageBoard.create('functiongraph', [seriesVoltage, 0, graphTimeEndMs], { strokeColor: '#005696', strokeWidth: 3 });
  seriesVoltageBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });
  seriesVoltageBoard.create('functiongraph', [equivalentDcVoltage, 0, graphTimeEndMs], { strokeColor: '#8e44ad', strokeWidth: 2, dash: 2 });
  
  seriesPowerBoard.create('text', [0.12, function(){ return getScaleValues().powerLimit * 0.88; }, 'p(t)=v(t)i(t) [mW]'], {fontSize: 15, fixed: true, color: '#d9534f'});
  seriesPowerBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().powerLimit * 0.045; }, 't [ms]'], {fontSize: 15, fixed: true});
  seriesPowerBoard.create('functiongraph', [seriesPowerMw, 0, graphTimeEndMs], { strokeColor: '#d9534f', strokeWidth: 3 });
  seriesPowerBoard.create('functiongraph', [seriesAveragePowerMw, 0, graphTimeEndMs], { strokeColor: '#8e44ad', strokeWidth: 2, dash: 2 });
  seriesPowerBoard.create('functiongraph', [dcPowerMw, 0, graphTimeEndMs], { strokeColor: '#f0ad4e', strokeWidth: 2, dash: 2 });
  seriesPowerBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });
  
  seriesEnergyBoard.create('text', [0.12, function(){ return getScaleValues().energyLimit * 0.88; }, 'W(t)=∫p(t)dt [uJ]'], {fontSize: 15, fixed: true, color: '#8e44ad'});
  seriesEnergyBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().energyLimit * 0.03; }, 't [ms]'], {fontSize: 15, fixed: true});
  seriesEnergyBoard.create('functiongraph', [seriesEnergyUj, 0, graphTimeEndMs], { strokeColor: '#8e44ad', strokeWidth: 3 });
  seriesEnergyBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });

  comparisonEnergyBoard.create('text', [0.12, function(){ return getScaleValues().energyLimit * 0.88; }, 'W(t) [uJ]'], {fontSize: 15, fixed: true, color: '#263f50'});
  comparisonEnergyBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().energyLimit * 0.08; }, 't [ms]'], {fontSize: 15, fixed: true});
  comparisonEnergyBoard.create('functiongraph', [seriesEnergyUj, 0, graphTimeEndMs], { strokeColor: '#8e44ad', strokeWidth: 3 });
  comparisonEnergyBoard.create('functiongraph', [dcEnergyUj, 0, graphTimeEndMs], { strokeColor: '#d9534f', strokeWidth: 2, dash: 2 });
  comparisonEnergyBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });
  
  dcViBoard.create('text', [function(){ return getScaleValues().dcVoltageLimit * 0.78; }, function(){ return -getScaleValues().dcCurrentLimit * 0.045; }, 'V [V]'], {fontSize: 15, fixed: true});
  dcViBoard.create('text', [function(){ return getScaleValues().dcVoltageLimit * 0.02; }, function(){ return getScaleValues().dcCurrentLimit * 0.86; }, 'I [mA]'], {fontSize: 15, fixed: true});
  const dcOrigin = dcViBoard.create('point', [0, 0], {visible: false, fixed: true});
  const dcVPoint = dcViBoard.create('point', [equivalentDcVoltage, 0], {visible: false, fixed: true});
  const dcWorkPoint = dcViBoard.create('point', [equivalentDcVoltage, equivalentDcCurrentMa], { name: 'DC', size: 5, color: '#8e44ad', label: {offset: [10, 10], fontSize: 14} });
  const dcIPoint = dcViBoard.create('point', [0, equivalentDcCurrentMa], {visible: false, fixed: true});
  dcViBoard.create('polygon', [dcOrigin, dcVPoint, dcWorkPoint, dcIPoint], { fillColor: '#8e44ad', fillOpacity: 0.22, borders: {strokeColor: '#8e44ad', strokeWidth: 2} });
  dcViBoard.create('segment', [dcOrigin, dcWorkPoint], { strokeColor: '#8e44ad', strokeWidth: 2, dash: 2 });
  
  dcPowerTimeBoard.create('text', [0.15, function(){ return getScaleValues().dcPowerLimit * 0.88; }, 'PDC(t) [mW]'], {fontSize: 15, fixed: true, color: '#d9534f'});
  dcPowerTimeBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().dcPowerLimit * 0.045; }, 't [ms]'], {fontSize: 15, fixed: true});
  dcPowerTimeBoard.create('functiongraph', [dcPowerMw, 0, graphTimeEndMs], { strokeColor: '#d9534f', strokeWidth: 3 });
  dcPowerTimeBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });
  
  dcWorkTimeBoard.create('text', [0.15, function(){ return getScaleValues().dcWorkLimit * 0.88; }, 'WDC(t)=PDC·t [uJ]'], {fontSize: 15, fixed: true, color: '#8e44ad'});
  dcWorkTimeBoard.create('text', [function(){ return graphTimeEndMs() * 0.86; }, function(){ return -getScaleValues().dcWorkLimit * 0.03; }, 't [ms]'], {fontSize: 15, fixed: true});
  dcWorkTimeBoard.create('functiongraph', [dcEnergyUj, 0, graphTimeEndMs], { strokeColor: '#8e44ad', strokeWidth: 3 });
  dcWorkTimeBoard.create('functiongraph', [function(){ return 0; }, 0, graphTimeEndMs], { strokeColor: '#8a97a3', strokeWidth: 1, dash: 2 });

  function updateSeriesDisplay() {
    const vp = seriesVp();
    const r = seriesR();
    const fKhz = seriesFreqKhz();
    const vrms = seriesVrms();
    dcVoltageInput.disabled = isDcAuto();
    if (isDcAuto()) { dcVoltageInput.value = vrms.toFixed(1); }
    const vdc = equivalentDcVoltage();
    const idcMa = equivalentDcCurrentMa();
    const powerMw = seriesAveragePowerMw();
    const dcPower = dcPowerMw();
    const timeEndMs = graphTimeEndMs();
    const energyUj = seriesEnergyUj(timeEndMs);
    const dcEnergy = dcEnergyUj(timeEndMs);
    
    updateAcSourceSymbol();
    updateHeatDisplay(powerMw, dcPower);
    updateGraphScales();
    
    ctrlSeriesVp.textContent = vp.toFixed(1) + ' V';
    ctrlSeriesR.textContent = r.toFixed(0) + ' Ω';
    ctrlSeriesFreq.textContent = formatFrequency(fKhz);
    ctrlDcVoltage.textContent = vdc.toFixed(1) + ' V';
    dispSeriesFreq.textContent = formatFrequency(fKhz);
    dispSeriesR.textContent = r.toFixed(0) + ' Ω';
    dispSeriesVrms.textContent = vrms.toFixed(2) + ' V';
    dispSeriesVdc.textContent = vdc.toFixed(2) + ' V';
    dispSeriesPower.textContent = powerMw.toFixed(1) + ' mW';
    dispSeriesDcR.textContent = r.toFixed(0) + ' Ω';
    dispSeriesDcPower.textContent = dcPower.toFixed(1) + ' mW';
    updateDcMatchStatus(vrms, vdc);
    
    compAcVoltage.textContent = vrms.toFixed(2) + ' V';
    compDcVoltage.textContent = vdc.toFixed(2) + ' V';
    compAcCurrent.textContent = (vrms/r*1000).toFixed(2) + ' mA';
    compDcCurrent.textContent = idcMa.toFixed(2) + ' mA';
    compAcPower.textContent = powerMw.toFixed(1) + ' mW';
    compDcPower.textContent = dcPower.toFixed(1) + ' mW';
    compAcEnergy.textContent = energyUj.toFixed(1) + ' uJ';
    compDcEnergy.textContent = dcEnergy.toFixed(1) + ' uJ';

    seriesCurrentBoard.update();
    seriesVoltageBoard.update();
    seriesPowerBoard.update();
    seriesEnergyBoard.update();
    comparisonEnergyBoard.update();
    dcViBoard.update();
    dcPowerTimeBoard.update();
    dcWorkTimeBoard.update();
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
  }

  seriesVpInput.addEventListener('input', updateSeriesDisplay);
  seriesRInput.addEventListener('input', updateSeriesDisplay);
  seriesFreqInput.addEventListener('input', updateSeriesDisplay);
  seriesWaveSelect.addEventListener('change', updateSeriesDisplay);
  dcAutoInput.addEventListener('change', updateSeriesDisplay);
  dcVoltageInput.addEventListener('input', updateSeriesDisplay);
  mainsDemoButton.addEventListener('click', setupMainsDemo);
  updateSeriesDisplay();
})();