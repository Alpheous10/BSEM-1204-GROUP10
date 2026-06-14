
import re

with open('all project docs/backend_redesign.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split the content into parts: headers and code blocks
parts = re.split(r'(```python.*?```)', content, flags=re.DOTALL)

current_header = "unknown"
blocks = []

for part in parts:
    # Check if it's a header
    header_match = re.search(r'#+\s*(.*)', part)
    if header_match:
        current_header = header_match.group(1).strip()
    # Check if it's a code block
    code_match = re.search(r'```python(.*?)```', part, re.DOTALL)
    if code_match:
        blocks.append({
            "header": current_header,
            "code": code_match.group(1).strip()
        })

# Now print each block with header
for i, block in enumerate(blocks):
    print(f"\n{'='*80}")
    print(f"BLOCK {i}: {block['header']}")
    print(f"{'='*80}")
    print(block['code'][:500])
