const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src/content/EELab1');
const experiments = ['Exp01', 'Exp02', 'Exp03', 'Exp04', 'Exp05'];

const graderDescription = `<p><strong>Goal:</strong> Complete the data processing for the experiment.</p>
<ol>
    <li>Enter the measured values into the respective vectors.</li>
    <li>Perform the required calculations as described in the Moodle Book.</li>
    <li>Plot the results with correct labels.</li>
</ol>
`;

const referenceSolution = `% Complete Reference Solution
% Note: This is an example, update with actual physics/math logic.

V_measured = [1, 2, 3, 4, 5];
I_measured = [0.1, 0.2, 0.3, 0.4, 0.5];

P = V_measured .* I_measured;
plot(V_measured, P);
xlabel('Voltage [V]');
ylabel('Power [W]');
`;

const learnerTemplate = `% MATLAB Grader Task Template
% 1. Enter your measurements from the lab into the vectors below:
V_measured = [ ]; % Voltage [V]
I_measured = [ ]; % Current [A]

% 2. Calculate Power (P)
P = 

% 3. Plot the graph
`;

const assessments = `# Assessments Configuration

Create the following tests in the MATLAB Grader interface:

1. **Test 1: Variable Check**
   - Type: Variable Equals Reference Solution
   - Variable name: \`P\`
   - Feedback: "Make sure you calculated P correctly using element-wise multiplication (.*)."

2. **Test 2: Graph Check**
   - Type: Function is present
   - Function name: \`plot\`
   - Feedback: "You need to use the plot() function to generate the graph."
`;

const moodleIntegration = `<!-- 
    MOODLE INTEGRATION: PreLab MATLAB Grader 
    This file should be included in the Moodle Book chapter.
-->
<div dir="rtl">
    <h3 class="section-title">משימת סיכום ב-MATLAB Grader</h3>
    <p>
        במשימה זו עליכם להשתמש בתוצאות המדידה שהכנתם, לחשב את ההספק ולשרטט גרף באמצעות MATLAB.
    </p>
    
    <div class="info-box">
        <h4>הנחיות לביצוע:</h4>
        <ol>
            <li>לחצו על הכפתור מטה כדי לעבור למערכת MATLAB Grader.</li>
            <li>הזינו את הנתונים שמדדתם בטבלה אל תוך הווקטורים המתאימים בקוד.</li>
            <li>השלימו את שורות הקוד החסרות והריצו בדיקה.</li>
        </ol>
    </div>

    <!-- The actual link/button to the LTI tool will be configured in Moodle -->
    <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn btn-primary" style="background-color: #005696; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            מעבר למשימה ב-MATLAB Grader
        </a>
    </div>
</div>
`;

experiments.forEach(exp => {
    const targetDir = path.join(baseDir, exp, '00_PreLab', 'Matlab_Grader', 'Task_Template');
    fs.mkdirSync(targetDir, { recursive: true });
    
    fs.writeFileSync(path.join(targetDir, 'grader_description.html'), graderDescription);
    fs.writeFileSync(path.join(targetDir, 'reference_solution.m'), referenceSolution);
    fs.writeFileSync(path.join(targetDir, 'learner_template.m'), learnerTemplate);
    fs.writeFileSync(path.join(targetDir, 'assessments.md'), assessments);
    fs.writeFileSync(path.join(targetDir, 'moodle_integration.html'), moodleIntegration);
    
    console.log(`Created templates for ${exp}`);
});

console.log('Done scaffolding all templates.');
