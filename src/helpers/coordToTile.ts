/** Coords representing a map tile. Gotten by dividing map coords by 32 */
export type TileCoordXY = {
    x: number;
    y: number;
}

export const mapCoordsToTileCoords = (mapCoords: CoordsXY): TileCoordXY => {
    const x = mapCoords.x / 32
    const y = mapCoords.y / 32

    if (x % 32 !== 0 || y % 32 !== 0) {
        ui.showError(`Tiling error`, `mapCoordsToTileCoords: mapCoords ${mapCoords} are not divisible by 32`)
    }
    return { x, y }
}

export const tileCoordsToMapCoords = (tileCoords: TileCoordXY): CoordsXY => {
    const x = tileCoords.x * 32
    const y = tileCoords.y * 32
    return { x, y }
}