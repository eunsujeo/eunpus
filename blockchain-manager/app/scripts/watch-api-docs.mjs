// api-docs 워처 — openapi.yaml(또는 뷰어 index.html) 이 바뀌면 build.py 를 자동 실행한다.
// 로컬 개발 전용(dev.sh 가 백그라운드로 띄움). 편집만으로 생성물(api.md·spec.js·뷰어·칸반 카드)이 갱신된다.
// 배포와 무관 — build.py 는 저장소의 정본→생성물 컴파일러이고, 이 워처는 그걸 대신 호출할 뿐.
import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)); // blockchain-manager/app/scripts
const BM = resolve(HERE, "..", "..");                 // blockchain-manager
const API_DOCS = join(BM, "bcm-api-docs");            // build.py 위치 (매니저+컴플라 공용)

// 감지 대상 디렉터리 — 이 안의 openapi.yaml / index.html 이 바뀌면 재빌드
const WATCH_DIRS = [join(BM, "bcm-api-docs"), join(BM, "compliance-api-docs")].filter(existsSync);
const TRIGGERS = new Set(["openapi.yaml", "index.html"]);

let timer = null;
let building = false;
let queued = false;

function runBuild() {
  if (building) { queued = true; return; }
  building = true;
  const p = spawn("python3", ["build.py"], { cwd: API_DOCS, stdio: ["ignore", "pipe", "pipe"] });
  let out = "";
  p.stdout.on("data", (d) => (out += d));
  p.stderr.on("data", (d) => (out += d));
  p.on("close", (code) => {
    building = false;
    const stamp = new Date().toTimeString().slice(0, 8);
    if (code === 0) process.stdout.write(`🔧 [${stamp}] api-docs 재빌드 완료\n${out.trim() ? out.trim() + "\n" : ""}`);
    else process.stdout.write(`❌ [${stamp}] build.py 실패 (code ${code})\n${out}\n`);
    if (queued) { queued = false; schedule(); } // 빌드 중 들어온 변경은 이어서 한 번 더
  });
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(runBuild, 200); // 디바운스 — 저장 1회에 여러 이벤트가 튄다
}

for (const dir of WATCH_DIRS) {
  watch(dir, (_event, filename) => {
    if (filename && TRIGGERS.has(String(filename))) schedule();
  });
  console.log(`👀 api-docs 워처 — ${dir}`);
}
console.log("   openapi.yaml 저장 시 build.py 자동 실행 (편집만으로 반영 · 브라우저는 새로고침)");
runBuild(); // 기동 시 1회 최신화
