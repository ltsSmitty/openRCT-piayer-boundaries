import { TileCoordXY } from "~/helpers/coordToTile";
import { createArrayAndFill } from "../../helpers/arrayHelper";
import { OwnershipGraph } from "./ownershipGraph";

export class CompleteOwnershipGraph implements OwnershipGraph {
    /**
     * A 2d array representing the ownership of each tile, where the value at an index is the id of the company that owns that tile. A value of -1 means no company owns that tile.
     */
    private tileOwner: number[][] = []

    constructor(width: number, height: number) {
        console.log(this.tileOwner);
        this.tileOwner = new Array(width);

        for (let i = 0; i < width; i++) {
            this.tileOwner[i] = createArrayAndFill(height, -1)
        }
    }

    getTileOwner(x: number, y: number): number {
        return this.tileOwner[x] ? this.tileOwner[x][y] ?? -1 : -1
    }

    isTileOwner(x: number, y: number, owner: number): boolean {
        return this.tileOwner[x] ? this.tileOwner[x][y] === owner : false
    }

    setTileOwner(x: number, y: number, owner: number): void {
        console.log(`setting tileowner graph (${x}, ${y}) to ${owner})`)
        this.tileOwner[x][y] = owner;
    }

    setRangeOwner(topLeft: TileCoordXY, bottomRight: TileCoordXY, companyId: number): void {
        this.printTileOwnerSize();
        console.log(`setting range owner from ${topLeft.x}, ${topLeft.y} to ${bottomRight.x}, ${bottomRight.y} to company ${companyId}`)
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                this.setTileOwner(x, y, companyId);
            }
        }
    }

    printTileOwnerSize(): void {
        console.log(`tileOwner size: ${this.tileOwner.length}, ${this.tileOwner[0].length}`)
    }

    setGraphSize(width: number, height: number): void {
        // change the size of the tileOwner array
        // if the new size is smaller, remove the excess tiles
        // if the new size is larger, add new tiles
        // if the new size is the same, do nothing


        if (width < this.tileOwner.length) {
            this.tileOwner.splice(width);
        }
        for (let i = 0; i < width; i++) {
            if (i < this.width) {
                this.tileOwner[i].length = height;
            } else {
                if (this.tileOwner[i]) {
                    this.tileOwner[i].push(...createArrayAndFill(height - this.height, -1))
                }
                else {
                    this.tileOwner[i] = createArrayAndFill(height, -1);
                }
            }
        }

    }

    getAllOwnedTiles(owner: number): TileCoordXY[] {
        const ownedTiles: TileCoordXY[] = [];
        console.log(`width: ${this.width}, height: ${this.height}  `);
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
        return this.tileOwner.length;
    }

    get height(): number {
        return this.tileOwner[0].length;
    }

    print(): void {
        for (let y = 0; y < this.height; y++) {
            let row = "";
            for (let x = 0; x < this.width; x++) {
                row += this.tileOwner[x][y] + " ";
            }
            console.log(row);
        }
    }
}