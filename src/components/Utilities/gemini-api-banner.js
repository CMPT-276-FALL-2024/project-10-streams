/*
  This file is a utility for displaying a banner to the user if they have not
  yet entered their Gemini API key. The banner will prompt the user to get an
  API key and enter it at the top of main.js. The banner will be displayed at
  the top of the page.
*/
export function maybeShowApiKeyBanner(key, action = `enter it at the top of
<code>main.js</code>`) {
  if (key === 'TODO') {
    let banner = document.createElement('div');
    banner.className = 'api-key-banner';
    banner.innerHTML = `
      To get started with the Gemini API,
      <a href="https://g.co/ai/idxGetGeminiKey" target="_blank">
      get an API key</a> (Ctrl+Click) and ${action}`;
    document.body.prepend(banner);
  }
}