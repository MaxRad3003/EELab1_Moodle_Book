import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_path = os.path.join(root, 'dist', 'previews', 'EELab1', 'Exp03', 'moodle_book_import_v2', '01_PreLab_02_RMS_sub.html')

if not os.path.exists(file_path):
    print("File does not exist")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

ids = [
    'seriesVp', 'seriesR', 'seriesFreq', 'seriesWave', 'dcAuto', 'dcVoltage', 'mainsDemo',
    'ctrlSeriesVp', 'ctrlSeriesR', 'ctrlSeriesFreq', 'ctrlDcVoltage', 'dispSeriesFreq',
    'dispSeriesVrms', 'dispSeriesVdc', 'dcMatchStatus', 'acHeatFill', 'acHeatValue',
    'dcHeatFill', 'dcHeatValue',
    'seriesCurrentBoard', 'seriesVoltageBoard', 'seriesPowerBoard', 'seriesEnergyBoard',
    'comparisonEnergyBoard', 'dcViBoard', 'dcPowerTimeBoard', 'dcWorkTimeBoard'
]

print("AC/DC comparison verification:")
for i in ids:
    has_id = (f'id="{i}"' in content) or (f"id='{i}'" in content)
    print(f"  {i}: {'Found' if has_id else 'NOT FOUND'}")
