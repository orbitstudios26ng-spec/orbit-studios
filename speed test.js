// speed-test.js
import { SpeedInsights } from "@vercel/speed-insights/next";

const run = async () => {
  const result = await SpeedInsights({
    url: "https://your-deployed-site.com"
  });
  console.log(result);
};

run();