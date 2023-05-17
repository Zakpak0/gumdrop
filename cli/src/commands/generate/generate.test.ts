import { generate, readFile } from "./generate";
import path from "path";

test("readFile", () => {
  const abs = path.resolve(__dirname, "./generate.ts");
  const contents = readFile(abs);
  expect(contents).toBeDefined();
  expect(contents).toContain("readFile");
});

test("generate", async () => {
  const abs = path.resolve(__dirname, "./generate.ts");
  const generation = await generate({ file: abs });
  expect(generation?.completed).toBeDefined();
});
