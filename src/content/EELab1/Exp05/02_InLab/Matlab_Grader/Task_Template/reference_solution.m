% Measured Data
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
