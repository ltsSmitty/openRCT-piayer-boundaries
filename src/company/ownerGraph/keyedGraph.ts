import { entries } from "../../helpers/arrayHelper";
import { OwnershipGraph } from "./ownershipGraph";

interface OwnedRange {
    topLeft: CoordsXY;
    bottomRight: CoordsXY;
}


export class KeyedGraph implements OwnershipGraph {
    // ownedTiles is a record of companyIds along with the tiles they own
    ownedTiles: Record<number, OwnedRange[]> = {};

    getTileOwner(x: number, y: number): number {
        for (const [companyId, ownedRanges] of entries(this.ownedTiles)) {
            for (const range of ownedRanges) {
                if (x >= range.topLeft.x && x <= range.bottomRight.x && y >= range.topLeft.y && y <= range.bottomRight.y) {
                    return Number(companyId);
                }
            }
        }
        return -1;
    }

    isTileOwner(x: number, y: number, owner: number): boolean {
        const ownedRanges = this.ownedTiles[owner];
        if (ownedRanges) {
            for (const range of ownedRanges) {
                if (x >= range.topLeft.x && x <= range.bottomRight.x && y >= range.topLeft.y && y <= range.bottomRight.y) {
                    return true;
                }
            }
        }
        return false;
    }

    setTileOwner(x: number, y: number, owner: number): void {
        // add the tile to the company
        const oldOwner = this.getTileOwner(x, y);

        if (oldOwner == owner) return;

        if (oldOwner !== -1) {
            this.removeTileFromCompany(x, y, oldOwner);
            this.ownedTiles[owner].push({ topLeft: { x, y }, bottomRight: { x, y } });
            this.consolidateRanges(owner);
        }
    }

    private removeTileFromCompany(x: number, y: number, companyId: number): void {
        const ownedRanges = this.ownedTiles[companyId];
        if (ownedRanges) {
            for (const range of ownedRanges) {
                if (x >= range.topLeft.x && x <= range.bottomRight.x && y >= range.topLeft.y && y <= range.bottomRight.y) {
                    // remove the tile from the range
                    if (range.topLeft.x === range.bottomRight.x && range.topLeft.y === range.bottomRight.y) {
                        // if the range is only one tile, remove the range
                        ownedRanges.splice(ownedRanges.indexOf(range), 1);
                    } else {
                        // if the tile is in the middle, split the range into two
                        ownedRanges.push({ topLeft: { x: range.topLeft.x, y: range.topLeft.y }, bottomRight: { x: range.bottomRight.x, y: y - 1 } });
                        ownedRanges.push({ topLeft: { x: range.topLeft.x, y: y + 1 }, bottomRight: { x: range.bottomRight.x, y: range.bottomRight.y } });
                        ownedRanges.splice(ownedRanges.indexOf(range), 1);
                    }
                    this.consolidateRanges(companyId);
                    return;
                }
            }
        }
    }

    private consolidateRanges(companyId: number): void {
        const ownedRanges = this.ownedTiles[companyId];
        const initialNumRanges = ownedRanges.length;
        if (ownedRanges) {
            for (const range of ownedRanges) {
                // check if the range can be merged with any other range
                for (const otherRange of ownedRanges) {
                    if (range !== otherRange) {
                        // check if the ranges are adjacent
                        if (range.topLeft.x === otherRange.bottomRight.x + 1 && range.topLeft.y === otherRange.topLeft.y && range.bottomRight.y === otherRange.bottomRight.y) {
                            // merge the ranges
                            range.topLeft.x = otherRange.topLeft.x;
                            ownedRanges.splice(ownedRanges.indexOf(otherRange), 1);
                            return;
                        }
                        if (range.bottomRight.x === otherRange.topLeft.x - 1 && range.topLeft.y === otherRange.topLeft.y && range.bottomRight.y === otherRange.bottomRight.y) {
                            // merge the ranges
                            range.bottomRight.x = otherRange.bottomRight.x;
                            ownedRanges.splice(ownedRanges.indexOf(otherRange), 1);
                            return;
                        }
                        if (range.topLeft.y === otherRange.bottomRight.y + 1 && range.topLeft.x === otherRange.topLeft.x && range.bottomRight.x === otherRange.bottomRight.x) {
                            // merge the ranges
                            range.topLeft.y = otherRange.topLeft.y;
                            ownedRanges.splice(ownedRanges.indexOf(otherRange), 1);
                            return;
                        }
                        if (range.bottomRight.y === otherRange.topLeft.y - 1 && range.topLeft.x === otherRange.topLeft.x && range.bottomRight.x === otherRange.bottomRight.x) {
                            // merge the ranges
                            range.bottomRight.y = otherRange.bottomRight.y;
                            ownedRanges.splice(ownedRanges.indexOf(otherRange), 1);
                            return;
                        }
                    }
                }
            }
            // if there's been some consolidation, check again
            if (initialNumRanges > ownedRanges.length) this.consolidateRanges(companyId);
        }
    }



    setRangeOwner(topLeft: CoordsXY, bottomRight: CoordsXY, companyId: number): void {
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                this.setTileOwner(x, y, companyId);
            }
        }
    }

    setGraphSize(width: number, height: number): void {
        // loop through  ownedTiles and if any ranges extend beyond the new size, reduce them so that they fit, or remove them if they no longer fit
        for (const [_companyId, ownedRanges] of entries(this.ownedTiles)) {
            for (const range of ownedRanges) {
                if (range.topLeft.x >= width || range.topLeft.y >= height || range.bottomRight.x >= width || range.bottomRight.y >= height) {
                    // if the range is outside the new size, remove it
                    ownedRanges.splice(ownedRanges.indexOf(range), 1);
                } else {
                    // if the range extends beyond the new size, reduce it
                    if (range.topLeft.x >= width) range.topLeft.x = width - 1;
                    if (range.topLeft.y >= height) range.topLeft.y = height - 1;
                    if (range.bottomRight.x >= width) range.bottomRight.x = width - 1;
                    if (range.bottomRight.y >= height) range.bottomRight.y = height - 1;
                }
            }
        }
    }

    getAllOwnedTiles(owner: number): CoordsXY[] {
        const ownedTiles: CoordsXY[] = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.isTileOwner(x, y, owner)) {
                    ownedTiles.push({ x, y });
                }
            }
        }
        return ownedTiles;
    }

    get width(): number {
        return (map ? map.size.x : -1)
    }

    get height(): number {
        return (map ? map.size.y : -1)
    }
}