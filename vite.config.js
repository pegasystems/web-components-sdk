import fs from "fs";
import path from "path";

export default {
  root: "",
  build: {
    outDir: "/public",
    emptyOutDir: true, // also necessary
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "./keys/sdk-r.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "./keys/sdk-r.crt")),
    },
    // Make sure the server is accessible over the local network
    host: "0.0.0.0",
  },
};
