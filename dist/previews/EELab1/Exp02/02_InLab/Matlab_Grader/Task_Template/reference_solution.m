% Measurements (Example data)
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
