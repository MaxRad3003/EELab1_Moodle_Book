% Parameters
Vp = 10;
f = 50;
T = 1/f;
t = linspace(0, 3*T, 1000);
v = Vp * sin(2*pi*f*t);

% Theoretical RMS
V_rms_theo = Vp / sqrt(2);

% Numerical RMS (Root of the Mean of the Squares)
V_rms_num = sqrt(mean(v.^2));
