import { readConfig } from "./config";

test("readConfig", async () => {
  const config = await readConfig();
  expect(config).toBeDefined();
  expect(config?.basePath).toEqual("./");
});
