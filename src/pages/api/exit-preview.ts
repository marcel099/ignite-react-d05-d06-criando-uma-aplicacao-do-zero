export default async function exit(request, response) {
  response.clearPreviewData();

  const redirectUrl = '/';

  response.writeHead(307, { Location: redirectUrl });
  response.end();
}