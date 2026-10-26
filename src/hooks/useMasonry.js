import { useState, useEffect, useMemo } from "react";

export function useMasonry(items, containerW) {
  return useMemo(() => {
    if (!containerW || items.length === 0) return { positions: new Map(), totalHeight: 0 };

    const cols = containerW < 768 ? 2 : containerW < 1024 ? 3 : containerW < 1536 ? 4 : 5;
    const gap = containerW < 768 ? 12 : 20;
    const p = containerW < 768 ? 6 : 10;
    const h = containerW < 768 ? 36 : 44;
    const colW = (containerW - gap * (cols - 1)) / cols;
    
    const colHeights = Array(cols).fill(0);
    const positions = new Map();

    items.forEach((item) => {
      // Find shortest column
      let minCol = 0;
      let minH = colHeights[0];
      for (let i = 1; i < cols; i++) {
        if (colHeights[i] < minH) {
          minH = colHeights[i];
          minCol = i;
        }
      }

      const ratio = Math.max(0.75, Math.min(item.height / item.width, 1.4));
      const cardH = (colW - 2 * p) * ratio + 2 * p + h;

      const x = minCol * (colW + gap);
      const y = colHeights[minCol];

      positions.set(item.id, { x, y, w: colW, h: cardH });
      colHeights[minCol] += cardH + gap;
    });

    return { positions, totalHeight: Math.max(...colHeights) };
  }, [items, containerW]);
}