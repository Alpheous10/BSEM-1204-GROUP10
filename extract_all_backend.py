
import re
import os

with open('all project docs/backend_redesign.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all python code blocks
code_blocks = re.findall(r'```python(.*?)```', content, re.DOTALL)

print(f"Found {len(code_blocks)} code blocks!")
os.makedirs("temp_code_blocks", exist_ok=True)

for i, block in enumerate(code_blocks):
    filename = f"temp_code_blocks/block_{i}.py"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(block.strip())
    print(f"Saved block {i} to {filename}")
