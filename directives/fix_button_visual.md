# Directive: Fix Button Visuals
# Goal
Fix the Button block's visual issues in the generic editor: prevent vertical text wrapping on resize, ensure centering, and fix "ghost" background artifacts.

# Inputs
- `src/components/workbench/CanvasBlock.tsx`
- User feedback regarding "not nice" look and text wrapping.

# Output
- Modified `CanvasBlock.tsx` with robust Flexbox centering and appropriate padding.

# Process
1. Modify `CanvasBlock.tsx`:
   - **Simplify**: Remove the inner `span` wrapper. It may be causing width calculation issues inside the Flex container.
   - Apply `display: flex`, `justify-content: center`, `align-items: center` directly to the button `div`.
   - Set `width: 100%`, `height: 100%` on the button `div`.
   - Use `box-sizing: border-box` to ensure padding doesn't overflow.
   - Revert `white-space` to `normal` or `break-word` to ensure standard behavior.
   - Ensure the outer wrapper (CanvasBlock div) doesn't constrain the `Resizable` during drag (though overflow is usually visible).
3. **Fix Alignment Jump**:
   - The user reports the button "jumps left" on resize. This indicates `text-align` on the parent is failing to center the resizing element.
   - **Strategy**: Wrap the `Resizable` component in a `div` with `display: flex`.
   - Use `justify-content` based on `block.styles.textAlign` (left -> flex-start, center -> center, right -> flex-end).
   - This decoupling (Flexbox for position, Resizable for size) is more stable than `inline-block` + `text-align` during DOM updates.
