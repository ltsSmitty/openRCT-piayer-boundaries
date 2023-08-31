import { TileCoordXY } from "~/helpers/coordToTile";

export interface OwnershipGraph {
    getTileOwner(x: number, y: number): number;
    isTileOwner(x: number, y: number, owner: number): boolean;
    getAllOwnedTiles(owner: number): TileCoordXY[];
    setTileOwner(x: number, y: number, owner: number): void;
    setRangeOwner(topLeft: TileCoordXY, bottomRight: TileCoordXY, companyId: number): void;
    setGraphSize(width: number, height: number): void;
    print(): void;
    get width(): number
    get height(): number
}
