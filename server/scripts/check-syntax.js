import { readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
function check(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) check(p);
    else if (p.endsWith(".js"))
      execFileSync(process.execPath, ["--check", p], { stdio: "inherit" });
  }
}
check("src");
check("scripts");
