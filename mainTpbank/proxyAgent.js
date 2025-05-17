const { HttpsProxyAgent } = require('https-proxy-agent');

function getAgent() {
  const proxy = {
    schema: process.env.PROXY_SCHEMA,
    ip: process.env.PROXY_IP,
    port: process.env.PROXY_PORT,
    username: process.env.PROXY_USERNAME,
    password: process.env.PROXY_PASSWORD,
  };

  // Nếu thiếu thông tin proxy thì trả về null
  if (!proxy.schema || !proxy.ip || !proxy.port) {
    return null;
  }

  const proxyUrl = proxy.username && proxy.username.length > 0
    ? `${proxy.schema}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
    : `${proxy.schema}://${proxy.ip}:${proxy.port}`;

  return new HttpsProxyAgent(proxyUrl);
}

module.exports = { getAgent };
