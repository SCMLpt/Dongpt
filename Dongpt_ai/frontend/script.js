async function processText() {
  const input = document.getElementById('input').value;
  const response = await fetch('http://localhost:3000/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: input }),
  });
  const data = await response.json();
  document.getElementById('output').textContent = data.text;
}
