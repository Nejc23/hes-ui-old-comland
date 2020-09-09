const PROXY_CONFIG = [
  {
      context: [
        "/api/concentrator-inventory/",
        "/api/concentrator-management",
        "/api/time-of-use/",
        "/api/on-demand-data-processing",
        "/api/templating",
        "/api/file-storage"
      ],
      target: "http://localhost:54322",
      secure: false
  },
  {
    context: [
      "/api/device-inventory-ui",
    ],
    target: "http://10.20.8.49:5013",
    secure: false
  },
  {
    context: [
      "/api/concentrator-inventory-ui",
    ],
    target: "http://10.20.8.49:5012",
    secure: false
  },
  {
    context: [
      "/api/scheduler",
    ],
    target: "http://10.20.8.49:5009",
    secure: false
  },
  {
    context: [
      "/api/crypto",
    ],
    target: "http://10.20.8.49:5014",
    secure: false
  },
]

module.exports = PROXY_CONFIG;
