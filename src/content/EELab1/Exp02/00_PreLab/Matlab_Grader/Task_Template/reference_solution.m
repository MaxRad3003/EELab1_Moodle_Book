% Given Parameters
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
xlabel('Load Resistance R_L [\Omega]');
ylabel('Power P_L [W]');
title('Power vs Load Resistance');
grid on;

max_power = max(P_L);
