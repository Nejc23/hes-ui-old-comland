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
    target: "http://localhost:5013",
    secure: false
  },
  {
    context: [
      "/api/concentrator-inventory-ui",
    ],
    target: "http://localhost:5012",
    secure: false
  },
  {
    context: [
      "/api/scheduler",
    ],
    target: "http://localhost:5009",
    secure: false
  },
  {
    context: [
      "/api/crypto",
    ],
    target: "http://localhost:5014",
    secure: false
  },
]

module.exports = PROXY_CONFIG;
