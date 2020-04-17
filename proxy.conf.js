const PROXY_CONFIG = [
  {
      context: [
        "/api/identity-server",
        "/api/concentrator-management",
      ],
      target: "https://89.212.201.202:54322",
      secure: false
  }
]

module.exports = PROXY_CONFIG;