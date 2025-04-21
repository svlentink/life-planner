/* @license GPLv3 */

/*
When an external resource gets lots of hits (or you pay us to review),
we might review it manually and put it on our allow list.
This will result in clients not being prompted with the security warning.

Rules for getting code on the accepted list;
- Easy to read code, no minimize
- No fetching of external resources
- English or Spanish only

Why Spanish? Just search for: The chaos poem
Need help? marketplace.visualstudio.com/items?itemName=standard.vscode-standard
*/



// echo -n $blob | sha256sum
async function verify_hash(blob, hash, algorithm='SHA-256') {
  const encoder = new TextEncoder()
  const data = encoder.encode(blob)

  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return calculatedHash.toLowerCase() === hash.toLowerCase()
}

async function get_script(uri) {
  const stored = localStorage.getItem(uri)
  if (stored) return stored
  const data = load_script(uri)
  localStorage.setItem(uri, data)
  return data
}

async function load_script(uri) {
  const response = await fetch(scriptUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch script: ${response.status}`)
  }
  return await response.text()
}

async function loadAndVerifyScript(scriptUrl, expectedHash) {
  try {
    const response = await fetch(scriptUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch script: ${response.status}`)
    }
    const scriptContent = await response.text()

    if (await verify_hash(scriptContent, expectedHash)) {
      // Create and append the script tag
      const scriptTag = document.createElement('script')
      scriptTag.textContent = scriptContent
      document.head.appendChild(scriptTag)
      console.log('Script loaded and verified successfully.');
    } else {
      console.error('Hash does not match, external script not added to page.');
    }
  } catch (error) {
    console.error('Error loading or verifying script:', error);
  }
}
  
// Example usage:
const scriptURL = 'https://example.com/your-external-script.js';
const expectedSHA256Hash = 'your_expected_sha256_hash_here'; // Replace with the actual hash

loadAndVerifyScript(scriptURL, expectedSHA256Hash);


  