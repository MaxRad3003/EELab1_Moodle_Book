% Complete Reference Solution
% Note: This is an example, update with actual physics/math logic.

V_measured = [1, 2, 3, 4, 5];
I_measured = [0.1, 0.2, 0.3, 0.4, 0.5];

P = V_measured .* I_measured;
plot(V_measured, P);
xlabel('Voltage [V]');
ylabel('Power [W]');
