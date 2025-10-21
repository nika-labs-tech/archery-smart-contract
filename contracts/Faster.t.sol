// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Faster} from "./Faster.sol";
import {Test} from "forge-std/Test.sol";

contract FasterTest is Test {
    Faster faster;
    address treasury;
    address user1;
    address user2;

    function setUp() public {
        treasury = makeAddr("treasury");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        faster = new Faster(treasury);
    }

    function test_InitialSupply() public view {
        assertEq(
            faster.totalSupply(),
            1_500_000_000 * 10 ** 18,
            "Total supply should be 1.5B"
        );
    }

    function test_TreasuryBalance() public view {
        assertEq(
            faster.balanceOf(treasury),
            1_500_000_000 * 10 ** 18,
            "Treasury should have all tokens"
        );
    }

    function test_TokenDetails() public view {
        assertEq(
            faster.name(),
            "Archer Hunter",
            "Name should be 'Archer Hunter'"
        );
        assertEq(faster.symbol(), "FASTER", "Symbol should be 'FASTER'");
        assertEq(faster.decimals(), 18, "Decimals should be 18");
    }

    function test_Roles() public view {
        assertTrue(
            faster.hasRole(faster.DEFAULT_ADMIN_ROLE(), treasury),
            "Treasury should have admin role"
        );
        assertTrue(
            faster.hasRole(faster.PAUSER_ROLE(), treasury),
            "Treasury should have pauser role"
        );
        assertFalse(
            faster.hasRole(faster.DEFAULT_ADMIN_ROLE(), address(this)),
            "Deployer should not have admin role"
        );
    }

    function test_PauseUnpause() public {
        assertFalse(faster.paused(), "Should not be paused initially");

        vm.prank(treasury);
        faster.pause();
        assertTrue(faster.paused(), "Should be paused after pause()");

        vm.prank(treasury);
        faster.unpause();
        assertFalse(faster.paused(), "Should not be paused after unpause()");
    }

    function test_TransferWhenPaused() public {
        vm.prank(treasury);
        faster.transfer(user1, 1000 * 10 ** 18);

        vm.prank(treasury);
        faster.pause();

        vm.prank(user1);
        vm.expectRevert("ERC20Pausable: paused");
        faster.transfer(user2, 100 * 10 ** 18);
    }

    function test_OnlyPauserCanPause() public {
        vm.prank(user1);
        vm.expectRevert();
        faster.pause();
    }

    function test_OnlyPauserCanUnpause() public {
        vm.prank(treasury);
        faster.pause();

        vm.prank(user1);
        vm.expectRevert();
        faster.unpause();
    }

    function test_TransferWhenNotPaused() public {
        vm.prank(treasury);
        faster.transfer(user1, 1000 * 10 ** 18);

        assertEq(
            faster.balanceOf(user1),
            1000 * 10 ** 18,
            "User1 should have transferred tokens"
        );
        assertEq(
            faster.balanceOf(treasury),
            1_500_000_000 * 10 ** 18 - 1000 * 10 ** 18,
            "Treasury balance should be reduced"
        );
    }

    function test_ApproveAndTransferFrom() public {
        vm.prank(treasury);
        faster.transfer(user1, 1000 * 10 ** 18);

        vm.prank(user1);
        faster.approve(user2, 500 * 10 ** 18);

        vm.prank(user2);
        faster.transferFrom(user1, user2, 500 * 10 ** 18);

        assertEq(
            faster.balanceOf(user2),
            500 * 10 ** 18,
            "User2 should have received tokens"
        );
        assertEq(
            faster.balanceOf(user1),
            500 * 10 ** 18,
            "User1 should have remaining tokens"
        );
    }

    function test_ApproveAndTransferFromWhenPaused() public {
        vm.prank(treasury);
        faster.transfer(user1, 1000 * 10 ** 18);

        vm.prank(user1);
        faster.approve(user2, 500 * 10 ** 18);

        vm.prank(treasury);
        faster.pause();

        vm.prank(user2);
        vm.expectRevert("ERC20Pausable: paused");
        faster.transferFrom(user1, user2, 500 * 10 ** 18);
    }

    function test_ZeroTreasuryAddress() public {
        vm.expectRevert("treasury=0");
        new Faster(address(0));
    }

    function test_Burn() public {
        vm.prank(treasury);
        faster.transfer(user1, 1000 * 10 ** 18);

        uint256 initialBalance = faster.balanceOf(user1);
        uint256 initialSupply = faster.totalSupply();

        vm.prank(user1);
        faster.burn(100 * 10 ** 18);

        assertEq(
            faster.balanceOf(user1),
            initialBalance - 100 * 10 ** 18,
            "User balance should decrease"
        );
        assertEq(
            faster.totalSupply(),
            initialSupply - 100 * 10 ** 18,
            "Total supply should decrease"
        );
    }

    function test_BurnWhenPaused() public {
        vm.prank(treasury);
        faster.transfer(user1, 1000 * 10 ** 18);

        vm.prank(treasury);
        faster.pause();

        vm.prank(user1);
        vm.expectRevert("ERC20Pausable: paused");
        faster.burn(100 * 10 ** 18);
    }
}
