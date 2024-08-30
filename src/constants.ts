const protocol = location.protocol === "https:" ? "wss" : "ws";
const LOCAL_URL = `${protocol}://localhost:4000/view-log-ws`;
const EXTERNAL_URL =
  "wss://test-log-viewer-backend.stg.onepunch.agency/view-log-ws";
const TOTAL_SIZE = 1.06e9;
export { EXTERNAL_URL, LOCAL_URL, TOTAL_SIZE };
