// const baseURL = 'https://4zcsu9v606.execute-api.eu-west-1.amazonaws.com';
// const baseURL =
//   'https://sqju9d7m8j.execute-api.eu-west-1.amazonaws.com/default';
const baseURL =
  'https://jgp4iec7b3.execute-api.eu-west-1.amazonaws.com/default';

export async function postApi(url: string, body: any) {
  const check_url =
    url.includes('https') || window.location.hostname === 'localhost'
      ? url
      : `${baseURL}${url}`;
  const res = await fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((data) => data)
    .catch((e) => null);

  return res ? res.json() : null;
}

export async function getApi(url: string) {
  const check_url =
    url.includes('https') || window.location.hostname === 'localhost'
      ? url
      : `${baseURL}${url}`;
  const res = await fetch(`${baseURL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => data)
    .catch((e) => null);

  return res ? res.json() : null;
}
