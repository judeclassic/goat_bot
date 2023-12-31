// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 value) external returns (bool);

     function approve(address spender, uint256 value) external returns (bool);
}

contract SwapExamples {

    address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    // This example swaps DAI/WETH9 for single path swaps and DAI/USDC/WETH9 for multi path swaps.

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;


    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor() {
        
    }

    
    function swapExactInputSingle(uint256 amountIn, address tokenIn, address tokenOut, uint deadline) external returns (uint256 amountOut) {
        // msg.sender must approve this contract

        IERC20 public  erc20Token = IERC20(tokenIn)

        // Transfer the specified amount of DAI to this contract.
        IERC20.transfer(address(this), amountIn);

        // Approve the router to spend DAI.
        IERC20.approve(address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: deadline,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    
    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum, ddress tokenIn, address tokenOut, uint deadline) external returns (uint256 amountIn) {
        
         IERC20 public  erc20Token = IERC20(tokenIn)

        
        // Transfer the specified amount of DAI to this contract.
        //TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), amountInMaximum);
          IERC20.transfer(address(this), amountInMaximum);

        // Approve the router to spend the specifed `amountInMaximum` of DAI.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        //TransferHelper.safeApprove(DAI, address(swapRouter), amountInMaximum);
        IERC20.approve(address(swapRouter), amountInMaximum);

        IERC20 public  erc20Token = IERC20(tokenIn)

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: deadline,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(DAI, address(swapRouter), 0);
            TransferHelper.safeTransfer(DAI, msg.sender, amountInMaximum - amountIn);
        }
    }

    //0x7406BB63Fd8Ca808b032F86eEB67C3d3979564f2
}