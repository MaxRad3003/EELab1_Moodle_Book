const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../../src/content/EELab1');

const tasks = {
  Exp02: {
    PreLab: {
      desc: `<p><strong>Goal:</strong> Calculate the theoretical Thevenin voltage and resistance, and plot the power curve.</p>
<ol>
    <li>Calculate <code>V_th</code> and <code>R_th</code> based on the given circuit parameters.</li>
    <li>Calculate the load power <code>P_L</code> for a vector of load resistances <code>R_L</code>.</li>
    <li>Plot <code>P_L</code> vs <code>R_L</code> and find the maximum power.</li>
</ol>`,
      sol: `% Given Parameters
Vs = 10; % Source voltage
R1 = 100; R2 = 100; R3 = 100;

% 1. Calculate Thevenin Equivalent
V_th = Vs * (R2 / (R1 + R2));
R_th = R3 + (R1 * R2) / (R1 + R2);

% 2. Calculate Load Power
R_L = linspace(1, 200, 100);
P_L = (V_th ./ (R_th + R_L)).^2 .* R_L;

% 3. Plot and Find Maximum
plot(R_L, P_L, 'LineWidth', 2);
xlabel('Load Resistance R_L [\\Omega]');
ylabel('Power P_L [W]');
title('Power vs Load Resistance');
grid on;

max_power = max(P_L);
`,
      template: `% 1. Given Parameters
Vs = 10; % Source voltage
R1 = 100; R2 = 100; R3 = 100;

% Calculate Thevenin Equivalent
V_th = 
R_th = 

% 2. Calculate Load Power
R_L = linspace(1, 200, 100);
P_L = 

% 3. Plot the power curve
% Add plot() command here

`,
      assess: `1. **Test V_th and R_th**: Variable Equals Reference Solution (V_th, R_th).
2. **Test P_L**: Variable Equals Reference Solution (P_L).
3. **Test Plot**: Function is present (plot).`
    },
    InLab: {
      desc: `<p><strong>Goal:</strong> Process the I-V characteristics measured in the lab.</p>
<ol>
    <li>Enter your measured voltage and current vectors for the Incandescent Lamp and NTC.</li>
    <li>Plot both curves on the same graph.</li>
    <li>Calculate the static resistance at the maximum measured voltage.</li>
</ol>`,
      sol: `% Measurements (Example data)
V_lamp = [0, 2, 4, 6, 8, 10];
I_lamp = [0, 0.05, 0.08, 0.1, 0.12, 0.14];

V_ntc = [0, 2, 4, 6, 8, 10];
I_ntc = [0, 0.02, 0.05, 0.1, 0.18, 0.3];

% Plotting
figure;
plot(V_lamp, I_lamp, '-o', 'DisplayName', 'Lamp');
hold on;
plot(V_ntc, I_ntc, '-s', 'DisplayName', 'NTC');
xlabel('Voltage [V]');
ylabel('Current [A]');
legend('Location', 'best');
grid on;

% Static Resistance at max voltage
R_stat_lamp = V_lamp(end) / I_lamp(end);
R_stat_ntc = V_ntc(end) / I_ntc(end);
`,
      template: `% 1. Enter your measurements
V_lamp = [ ]; % Lamp Voltage
I_lamp = [ ]; % Lamp Current

V_ntc = [ ]; % NTC Voltage
I_ntc = [ ]; % NTC Current

% 2. Plotting both curves
% Use plot() and hold on


% 3. Static Resistance at the last data point
R_stat_lamp = 
R_stat_ntc = 
`,
      assess: `1. **Test Static Resistance**: Variable Equals Reference (R_stat_lamp, R_stat_ntc).
2. **Test Plotting**: Function is present (hold, legend).`
    }
  },
  Exp03: {
    PreLab: {
      desc: `<p><strong>Goal:</strong> Calculate the RMS voltage theoretically and numerically.</p>
<ol>
    <li>Generate a sine wave over 3 periods.</li>
    <li>Calculate the theoretical RMS voltage.</li>
    <li>Calculate the numerical RMS voltage using the root-mean-square formula on the vector.</li>
</ol>`,
      sol: `% Parameters
Vp = 10;
f = 50;
T = 1/f;
t = linspace(0, 3*T, 1000);
v = Vp * sin(2*pi*f*t);

% Theoretical RMS
V_rms_theo = Vp / sqrt(2);

% Numerical RMS (Root of the Mean of the Squares)
V_rms_num = sqrt(mean(v.^2));
`,
      template: `% Parameters
Vp = 10;
f = 50;
T = 1/f;
t = linspace(0, 3*T, 1000);

% 1. Generate the sine wave
v = 

% 2. Theoretical RMS
V_rms_theo = 

% 3. Numerical RMS (use mean and sqrt)
V_rms_num = 
`,
      assess: `1. **Test Theoretical RMS**: Variable Equals Reference (V_rms_theo).
2. **Test Numerical RMS**: Variable Equals Reference (V_rms_num).`
    },
    InLab: {
      desc: `<p><strong>Goal:</strong> Calculate phase shift from oscilloscope measurements and plot Lissajous curves.</p>
<ol>
    <li>Enter the measured time difference and period.</li>
    <li>Calculate phase shift in degrees and radians.</li>
    <li>Plot the Lissajous curve (X-Y mode) for the two signals.</li>
</ol>`,
      sol: `% Measurements
delta_t = 2e-3; % 2 ms
T = 20e-3; % 20 ms

% Phase shift
phi_deg = 360 * (delta_t / T);
phi_rad = phi_deg * (pi / 180);

% Signals for Lissajous
t = linspace(0, T, 500);
V1 = sin(2*pi*(1/T)*t);
V2 = sin(2*pi*(1/T)*t + phi_rad);

% Plot Lissajous
plot(V1, V2);
xlabel('V1');
ylabel('V2');
title('Lissajous Curve');
axis equal; grid on;
`,
      template: `% 1. Enter your measured delta_t and T
delta_t = % in seconds
T =       % in seconds

% 2. Calculate phase shift
phi_deg = 
phi_rad = 

% 3. Generate signals and plot Lissajous
t = linspace(0, T, 500);
V1 = sin(2*pi*(1/T)*t);
V2 = sin(2*pi*(1/T)*t + phi_rad);

% Use plot() for V1 vs V2
`,
      assess: `1. **Test Phase**: Variable Equals Reference (phi_deg, phi_rad).
2. **Test Plot**: Function is present (plot).`
    }
  },
  Exp04: {
    PreLab: {
      desc: `<p><strong>Goal:</strong> Calculate power triangle components and PFC capacitor.</p>
<ol>
    <li>Calculate Real (P), Reactive (Q), and Apparent (S) power for the given RL load.</li>
    <li>Calculate the capacitor C required to improve the power factor to 0.95.</li>
</ol>`,
      sol: `% Given
V_rms = 220; f = 50;
R = 50; L = 0.3;

% Impedance
w = 2*pi*f;
XL = w*L;
Z_mag = sqrt(R^2 + XL^2);

% Current and Powers
I_rms = V_rms / Z_mag;
S = V_rms * I_rms;
P = I_rms^2 * R;
Q = I_rms^2 * XL;

% PFC to pf = 0.95
pf_new = 0.95;
Q_new = P * tan(acos(pf_new));
Q_c = Q - Q_new;
C = Q_c / (V_rms^2 * w);
`,
      template: `% Given
V_rms = 220; f = 50;
R = 50; L = 0.3;
w = 2*pi*f;

% 1. Calculate Power components
P = 
Q = 
S = 

% 2. Calculate Required Capacitor for pf=0.95
pf_new = 0.95;
C = 
`,
      assess: `1. **Test Powers**: Variable Equals Reference (P, Q, S).
2. **Test Capacitor**: Variable Equals Reference (C).`
    },
    InLab: {
      desc: `<p><strong>Goal:</strong> Analyze Wattmeter readings before and after power factor correction.</p>
<ol>
    <li>Enter measured P, V, and I before and after adding the capacitor.</li>
    <li>Calculate the apparent power S and reactive power Q for both cases.</li>
    <li>Create a bar chart comparing Q before and after.</li>
</ol>`,
      sol: `% Measurements Before PFC
P_before = 100; V_before = 220; I_before = 0.6;
S_before = V_before * I_before;
Q_before = sqrt(S_before^2 - P_before^2);
pf_before = P_before / S_before;

% Measurements After PFC
P_after = 100; V_after = 220; I_after = 0.48;
S_after = V_after * I_after;
Q_after = sqrt(S_after^2 - P_after^2);
pf_after = P_after / S_after;

% Bar chart comparison
bar([Q_before, Q_after]);
set(gca, 'XTickLabel', {'Before PFC', 'After PFC'});
ylabel('Reactive Power Q [VAR]');
title('Reactive Power Reduction');
`,
      template: `% 1. Measurements Before PFC
P_before = ; V_before = ; I_before = ;
S_before = 
Q_before = 
pf_before = 

% 2. Measurements After PFC
P_after = ; V_after = ; I_after = ;
S_after = 
Q_after = 
pf_after = 

% 3. Bar chart comparing Q
% Use bar() function
`,
      assess: `1. **Test Values**: Variable Equals Reference (Q_before, Q_after, pf_after).
2. **Test Plot**: Function is present (bar).`
    }
  },
  Exp05: {
    PreLab: {
      desc: `<p><strong>Goal:</strong> Calculate series RLC resonance parameters.</p>
<ol>
    <li>Calculate the theoretical resonance frequency (f0), bandwidth (BW), and quality factor (Q).</li>
</ol>`,
      sol: `% Parameters
R = 47; L = 10e-3; C = 0.1e-6;

% Calculations
w0 = 1 / sqrt(L*C);
f0 = w0 / (2*pi);
Q_factor = (1/R) * sqrt(L/C);
BW = f0 / Q_factor;
`,
      template: `% Parameters
R = 47; L = 10e-3; C = 0.1e-6;

% 1. Calculate f0 [Hz]
f0 = 

% 2. Calculate Quality Factor
Q_factor = 

% 3. Calculate Bandwidth [Hz]
BW = 
`,
      assess: `1. **Test Resonance**: Variable Equals Reference (f0, Q_factor, BW).`
    },
    InLab: {
      desc: `<p><strong>Goal:</strong> Find empirical resonance frequency and half-power points from measured data.</p>
<ol>
    <li>Enter your measured frequencies and voltages.</li>
    <li>Find the maximum voltage and corresponding frequency (empirical f0).</li>
    <li>Calculate the half-power voltage threshold.</li>
</ol>`,
      sol: `% Measured Data
f_meas = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];
V_meas = [0.5, 1.2, 2.5, 4.8, 5.0, 3.1, 1.5, 0.8];

% Find max voltage and empirical f0
[V_max, idx] = max(V_meas);
f0_empirical = f_meas(idx);

% Calculate half-power voltage
V_half_power = V_max / sqrt(2);

% Plot frequency response
semilogx(f_meas, V_meas, '-o');
hold on;
yline(V_half_power, 'r--', 'Half-Power');
xline(f0_empirical, 'g--', 'f_0');
xlabel('Frequency [Hz]');
ylabel('Voltage [V]');
grid on;
`,
      template: `% 1. Measured Data
f_meas = [ ];
V_meas = [ ];

% 2. Find maximums
[V_max, idx] = max(V_meas);
f0_empirical = 

% 3. Half-power voltage
V_half_power = 

% 4. Plot (Optional but recommended)
semilogx(f_meas, V_meas, '-o');
grid on;
`,
      assess: `1. **Test Max**: Variable Equals Reference (V_max, f0_empirical).
2. **Test Half Power**: Variable Equals Reference (V_half_power).`
    }
  }
};

const moodleIntegration = (type) => `<!-- 
    MOODLE INTEGRATION: ${type} MATLAB Grader 
-->
<div dir="rtl">
    <h3 class="section-title">משימת סיכום ב-MATLAB Grader (${type})</h3>
    <p>
        במשימה זו עליכם ליישם את מה שלמדנו בעזרת קוד MATLAB.
    </p>
    <div class="info-box">
        <h4>הנחיות לביצוע:</h4>
        <ol>
            <li>לחצו על הכפתור מטה כדי לעבור למערכת MATLAB Grader.</li>
            <li>קראו את ההנחיות וכתבו את הקוד הנדרש.</li>
            <li>הריצו בדיקה כדי לוודא שצדקתם.</li>
        </ol>
    </div>
    <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn btn-primary" style="background-color: #005696; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            מעבר למשימה ב-MATLAB Grader
        </a>
    </div>
    <div class="success-banner" style="margin-top: 15px; padding: 10px; background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #383d41;">
            <strong>מעדיפים לעבוד על המחשב?</strong> מורידים את התבנית <a href="#">כאן (קובץ ZIP)</a>, פותרים ב-MATLAB מקומי ומדביקים את הקוד המוכן.
        </p>
    </div>
</div>
`;

for (const [exp, parts] of Object.entries(tasks)) {
  for (const [partName, data] of Object.entries(parts)) {
    const dirName = partName === 'PreLab' ? '00_PreLab' : '02_InLab'; 
    const targetDir = path.join(baseDir, exp, dirName, 'Matlab_Grader', 'Task_Template');
    fs.mkdirSync(targetDir, { recursive: true });
    
    fs.writeFileSync(path.join(targetDir, 'grader_description.html'), data.desc);
    fs.writeFileSync(path.join(targetDir, 'reference_solution.m'), data.sol);
    fs.writeFileSync(path.join(targetDir, 'learner_template.m'), data.template);
    fs.writeFileSync(path.join(targetDir, 'assessments.md'), data.assess);
    fs.writeFileSync(path.join(targetDir, 'moodle_integration.html'), moodleIntegration(partName));
    
    const offlineDir = path.join(baseDir, exp, 'moodle_book_import_v2', 'Offline_MATLAB');
    fs.mkdirSync(offlineDir, { recursive: true });
    fs.writeFileSync(path.join(offlineDir, `${exp}_${partName}_Template.m`), data.template);
    
    console.log(`Created ${partName} templates for ${exp}`);
  }
}

console.log('All detailed templates generated successfully.');
