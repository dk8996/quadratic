import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Sheet } from '../../gridDB/Sheet';
import { ZOOM_ANIMATION_TIME_MS } from '../../../constants/gridConstants';

export function zoomToFit(sheet: Sheet, viewport: Viewport): void {
  const gridBounds = sheet.getGridBounds();
  if (gridBounds) {
    const screenRectangle = sheet.gridOffsets.getScreenRectangle(
      gridBounds.x,
      gridBounds.y,
      gridBounds.width,
      gridBounds.height
    );

    // calc scale, and leave a little room on the top and sides
    let scale = viewport.findFit(screenRectangle.width * 1.2, screenRectangle.height * 1.2);

    // Don't zoom in more than a factor of 2
    if (scale > 2.0) scale = 2;

    viewport.animate({
      time: ZOOM_ANIMATION_TIME_MS,
      position: new PIXI.Point(
        screenRectangle.x + screenRectangle.width / 2,
        screenRectangle.y + screenRectangle.height / 2
      ),
      scale,
    });
  } else {
    viewport.animate({
      time: ZOOM_ANIMATION_TIME_MS,
      position: new PIXI.Point(0, 0),
      scale: 1,
    });
  }
}

export function zoomInOut(viewport: Viewport, scale: number): void {
  viewport.animate({
    time: ZOOM_ANIMATION_TIME_MS,
    scale,
  });
}

// from https://stackoverflow.com/a/42799104
export function nearestPowerOf2(n: number): number {
  return 1 << (31 - Math.clz32(n));
}
