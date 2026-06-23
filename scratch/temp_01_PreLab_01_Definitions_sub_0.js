(function () {
            const seriesVpInput = document.getElementById('seriesVp');
            const seriesRInput = document.getElementById('seriesR');
            const dcAutoInput = document.getElementById('dcAuto');
            const dcVoltageInput = document.getElementById('dcVoltage');
            const dispSeriesVrms = document.getElementById('dispSeriesVrms');
            const dispSeriesVdc = document.getElementById('dispSeriesVdc');
            const dcMatchStatus = document.getElementById('dcMatchStatus');
            const acHeatFill = document.getElementById('acHeatFill');
            const acHeatValue = document.getElementById('acHeatValue');
            const dcHeatFill = document.getElementById('dcHeatFill');
            const dcHeatValue = document.getElementById('dcHeatValue');

            function seriesVp() { return parseFloat(seriesVpInput.value) || 10; }
            function seriesR() { return parseFloat(seriesRInput.value) || 1000; }
            function isDcAuto() { return dcAutoInput.checked; }
            function equivalentDcVoltage() {
              return isDcAuto() ? seriesVp() / Math.sqrt(2) : (parseFloat(dcVoltageInput.value) || 0);
            }

            const seriesVoltageBoard = JXG.JSXGraph.initBoard('seriesVoltageBoard', {
              boundingbox: [-0.5, 18, 10.5, -18], axis: true, showNavigation: false, showCopyright: false
            });
            seriesVoltageBoard.create('functiongraph', [function(t){ return seriesVp()*Math.sin(t); }, 0, 10], {strokeColor:'#005696', strokeWidth:3});

            const dcPowerTimeBoard = JXG.JSXGraph.initBoard('dcPowerTimeBoard', {
              boundingbox: [-0.5, 18, 10.5, -18], axis: true, showNavigation: false, showCopyright: false
            });
            dcPowerTimeBoard.create('functiongraph', [equivalentDcVoltage, 0, 10], {strokeColor:'#d9534f', strokeWidth:3});

            function updateDisplay() {
              const vp = seriesVp();
              const vrms = vp / Math.sqrt(2);
              dcVoltageInput.disabled = isDcAuto();
              if (isDcAuto()) dcVoltageInput.value = vrms.toFixed(2);
              const vdc = equivalentDcVoltage();
              
              const acPower = (vrms * vrms / seriesR()) * 1000;
              const dcPower = (vdc * vdc / seriesR()) * 1000;
              
              dispSeriesVrms.textContent = vrms.toFixed(2) + ' V';
              dispSeriesVdc.textContent = vdc.toFixed(2) + ' V';
              acHeatValue.textContent = acPower.toFixed(1) + ' mW';
              dcHeatValue.textContent = dcPower.toFixed(1) + ' mW';
              
              const maxP = Math.max(acPower, dcPower, 1);
              acHeatFill.style.width = (acPower/maxP*100) + '%';
              dcHeatFill.style.width = (dcPower/maxP*100) + '%';
              
              const diff = Math.abs(vdc - vrms);
              dcMatchStatus.textContent = diff < 0.1 ? 'שקול' : (vdc > vrms ? 'גבוה' : 'נמוך');
              dcMatchStatus.style.color = diff < 0.1 ? '#28a745' : '#d9534f';

              seriesVoltageBoard.setBoundingBox([-0.5, vp*1.2, 10.5, -vp*1.2]);
              dcPowerTimeBoard.setBoundingBox([-0.5, Math.max(vp, vdc)*1.2, 10.5, -0.5]);
              seriesVoltageBoard.update();
              dcPowerTimeBoard.update();
              
              if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise();
              }
            }

            [seriesVpInput, seriesRInput, dcAutoInput, dcVoltageInput].forEach(el => el.addEventListener('input', updateDisplay));
            updateDisplay();
            })();