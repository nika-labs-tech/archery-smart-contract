import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FasterModule", (m) => {
  // Get the treasury address from environment or use a default
  const treasury = m.getParameter("treasury", "0x1234567890123456789012345678901234567890");

  const faster = m.contract("Faster", [treasury]);

  return { faster };
});
