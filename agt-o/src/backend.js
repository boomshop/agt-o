export async function sendRequest(data, callback) {
  const response = await fetch('https://agt-o.de/api.php', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error('Request failed.');
  callback(result);
}
