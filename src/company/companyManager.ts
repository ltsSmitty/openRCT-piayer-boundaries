import { mapCoordsToTileCoords } from './../helpers/coordToTile';
import { OwnershipGraph } from './ownerGraph/ownershipGraph';
import { Company } from "./company";
import { find, findIndex } from "../helpers/arrayHelper";
import { CompleteOwnershipGraph } from './ownerGraph/completeGraph';

interface ICompanyManager {
    companies: Company[];
    ownershipGraph: OwnershipGraph;
    createCompany: () => number;
    getCompany: (companyId: number) => Company | undefined;
    deleteCompany: (companyId: number) => void;
    addPlayerToCompany: (playerId: number, companyId: number) => void;
    removePlayerFromCompany: (playerId: number, companyId: number) => void;

    getTileOwnership: (tile: CoordsXY) => number | undefined;
    doesCompanyOwnTile: (tile: CoordsXY, companyId: number) => boolean
}

export class CompanyManager implements ICompanyManager {
    companies: Company[] = [];
    ownershipGraph: OwnershipGraph;

    constructor() {
        const { x, y } = mapCoordsToTileCoords(map.size)
        this.ownershipGraph = new CompleteOwnershipGraph(x, y);
    }

    createCompany(): number {
        const newCompanyId = this.companies.length + 1;
        const newCompany = new Company(newCompanyId, `Company ${newCompanyId}`);
        this.companies.push(newCompany);
        return newCompanyId;
    }

    getCompany(companyId: number): Company | undefined {
        return find(this.companies, (company => company.id === companyId)) ?? undefined
    }

    deleteCompany(companyId: number): void {
        const index = findIndex(this.companies, (company => company.id === companyId))
        if (index !== -1) {
            this.companies.splice(index, 1);
        }
    }

    addPlayerToCompany(playerId: number, companyId: number): number {
        const company = this.getCompany(companyId);
        console.log(`found company`, company);

        if (company) {
            company.players.push(playerId);
            return companyId;
        }
        else {
            console.log(`Company ${companyId} does not exist. hi`)
            const newCompanyId = this.createCompany();
            this.addPlayerToCompany(playerId, newCompanyId);
            console.log(`Company ${companyId} does not exist. Instead, creating new company ${newCompanyId} and adding player ${playerId} to it.`);
            return newCompanyId;
        }
    }

    removePlayerFromCompany(playerId: number, companyId: number): void {
        const company = this.getCompany(companyId);
        if (company) {
            const index = company.players.indexOf(playerId);
            if (index !== -1) {
                company.players.splice(index, 1);
            }
        }
    }

    getTileOwnership(tile: CoordsXY): number | undefined {
        return this.ownershipGraph.getTileOwner(tile.x, tile.y);
    }

    doesCompanyOwnTile(tile: CoordsXY, companyId: number): boolean {
        return this.ownershipGraph.isTileOwner(tile.x, tile.y, companyId);
    }
}