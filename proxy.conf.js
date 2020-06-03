const PROXY_CONFIG = [
  {
      context: [
  //      "/api/identity-server"
        "/api/concentrator-management",
      ],
      target: "https://89.212.201.202:54322",
      secure: false
  },
  {
    context: [
      "/api/device-inventory-ui",
    ],
    target: "http://localhost:5013",
    secure: false
  },
  {
    context: [
      "/api/concentrator-inventory-ui",
    ],
    target: "http://localhost:5012",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
