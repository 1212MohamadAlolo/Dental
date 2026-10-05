from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
b=json.loads((root/'data/adaptive-bank.json').read_text())
(root/'data/adaptive-bank.js').write_text('window.AdaptiveBank = '+json.dumps(b,ensure_ascii=False)+';\n')
print('Bank runtime synchronized')
