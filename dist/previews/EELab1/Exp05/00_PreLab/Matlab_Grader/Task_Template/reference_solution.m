% Parameters
R = 47; L = 10e-3; C = 0.1e-6;

% Calculations
w0 = 1 / sqrt(L*C);
f0 = w0 / (2*pi);
Q_factor = (1/R) * sqrt(L/C);
BW = f0 / Q_factor;
