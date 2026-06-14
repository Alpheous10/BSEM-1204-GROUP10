
import re

# Read the backend_redesign.md file
with open('all project docs/backend_redesign.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into parts
parts = re.split(r'(```python.*?```)', content, flags=re.DOTALL)

current_filename = None
file_contents = {}

for part in parts:
    # Look for headers that mention modifying or creating a file
    file_match = re.search(
        r'(?:Create|Modify)\s*`([^`]+)`',
        part,
        re.IGNORECASE
    )
    if file_match:
        current_filename = file_match.group(1).strip()
        print(f"Found target file: {current_filename}")
    
    # Look for code blocks
    code_match = re.search(r'```python(.*?)```', part, re.DOTALL)
    if code_match and current_filename:
        file_contents[current_filename] = code_match.group(1).strip()
        print(f"  Captured code for {current_filename}")

# Now write each file
for filename, code in file_contents.items():
    # Write the code to the file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Wrote {filename}")
