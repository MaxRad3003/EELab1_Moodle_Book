% Measurements
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
