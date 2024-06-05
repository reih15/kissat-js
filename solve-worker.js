"use strict";

importScripts("kissat-emscripten.js", "kissat.js");

onmessage = (e) => {
  console.log("[solve-worker] Solve start");

  Module.onRuntimeInitialized = () => {
    const cls = e.data[0];

    const kissat = new Kissat();
    switch (e.data[1]) {
      case "basic":
        kissat.initBasic();
        break;
      case "plain":
        kissat.initPlain();
        break;
      case "sat":
        kissat.initSat();
        break;
      case "unsat":
        kissat.initUnsat();
        break;
    }

    const vars = new Set();
    for (const cl of cls) {
      for (const lit of cl) {
        kissat.add(lit);
        vars.add(Math.abs(lit));
      }
      kissat.add(0);
    }

    const result = kissat.solve();
    let resultStr = "";
    if (typeof result === "undefined") {
      resultStr = "c UNKNOWN";
    } else if (result) {
      resultStr = "s SATISFIABLE";
      const sortedVars = Array.from(vars).sort((a, b) => a - b);
      resultStr += `\nv ${kissat.model(sortedVars).join(" ")} 0`;
    } else {
      resultStr = "s UNSATISFIABLE";
    }
    kissat.printStatistics();

    kissat.release();

    console.log("[solve-worker] Solve end");
    postMessage(resultStr);
  };
};
