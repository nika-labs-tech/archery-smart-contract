// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Faster is ERC20, ERC20Permit {
    constructor(
        address treasury
    ) ERC20("Archer Hunter", "FASTER") ERC20Permit("Archer Hunter") {
        require(treasury != address(0), "treasury=0");
        _mint(treasury, 1500000000 * (10 ** decimals()));
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
