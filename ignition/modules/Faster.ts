import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FasterModule", (m) => {
  // Get the treasury address from environment or use a default
  const treasury = m.getParameter("treasury", "0xA09E446Fa3521EAAFAE315edF640f2582859C66e");

  const faster = m.contract("Faster", [treasury]);

  return { faster };
});
