% Measurements Before PFC
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
