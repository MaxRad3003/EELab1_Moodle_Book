% Given
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
