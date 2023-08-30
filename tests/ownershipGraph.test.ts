import { describe, expect, test } from '@jest/globals';
import { KeyedGraph } from './../src/company/ownerGraph/keyedGraph';
import { CompleteOwnershipGraph } from '../src/company/ownerGraph/completeGraph';

describe(`CompleteGraph tests`, () => {
    test(`getTileOwner returns -1 when no company owns the tile`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        expect(graph.getTileOwner(0, 0)).toBe(-1);
    })
    test(`getTileOwner returns the correct company id when a company owns the tile`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setTileOwner(0, 0, 1);
        expect(graph.getTileOwner(0, 0)).toBe(1);
    })
    test(`isTileOwner returns false when no company owns the tile`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        expect(graph.isTileOwner(0, 0, 1)).toBe(false);
    })
    test(`isTileOwner returns true when a company owns the tile`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setTileOwner(0, 0, 1);
        expect(graph.isTileOwner(0, 0, 1)).toBe(true);
    })
    test(`getAllOwnedTiles returns an empty array when no company owns any tiles`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        expect(graph.getAllOwnedTiles(1)).toEqual([]);
    })
    test(`getAllOwnedTiles returns an array of all tiles owned by the company`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setTileOwner(0, 0, 1);
        graph.setTileOwner(1, 1, 1);
        expect(graph.getAllOwnedTiles(1)).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    })
    test(`setTileOwner sets the owner of the tile`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setTileOwner(0, 0, 1);
        expect(graph.getTileOwner(0, 0)).toBe(1);
    })
    test(`setRangeOwner sets the owner of the range of tiles`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setRangeOwner({ x: 0, y: 0 }, { x: 1, y: 1 }, 1);
        expect(graph.getTileOwner(0, 0)).toBe(1);
        expect(graph.getTileOwner(1, 0)).toBe(1);
        expect(graph.getTileOwner(0, 1)).toBe(1);
        expect(graph.getTileOwner(1, 1)).toBe(1);
    })
    test(`setGraphSize changes the size of the graph`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setGraphSize(20, 20);
        expect(graph.width).toBe(20);
        expect(graph.height).toBe(20);
    })
    test(`setGraphSize removes tiles that are outside the new size`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setTileOwner(9, 9, 1);
        graph.setGraphSize(5, 5);
        expect(graph.getTileOwner(9, 9)).toBe(-1);
    })
    test(`setGraphSize adds tiles that are inside the new size`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setGraphSize(20, 20);
        expect(graph.getTileOwner(19, 19)).toBe(-1);
    })
    test(`setGraphSize does not change the owner of tiles that are inside the new size`, () => {
        const graph = new CompleteOwnershipGraph(10, 10);
        graph.setTileOwner(9, 9, 1);
        graph.setGraphSize(20, 20);
        expect(graph.getTileOwner(9, 9)).toBe(1);
    })
})