% 1. Enter your measured delta_t and T
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
