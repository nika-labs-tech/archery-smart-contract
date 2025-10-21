// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Faster is ERC20, ERC20Permit, Pausable, AccessControl {
    uint256 public constant INITIAL_SUPPLY = 1_500_000_000 * 10 ** 18; // 1.5B

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(
        address treasury
    ) ERC20("Archer Hunter", "FASTER") ERC20Permit("Archer Hunter") {
        require(treasury != address(0), "treasury=0");

        _mint(treasury, INITIAL_SUPPLY);

        _grantRole(DEFAULT_ADMIN_ROLE, treasury);
        _grantRole(PAUSER_ROLE, treasury);

        _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        require(!paused(), "ERC20Pausable: paused");
        super._update(from, to, value);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
