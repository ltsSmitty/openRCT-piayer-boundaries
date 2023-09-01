import { CompanyManager } from "./company/companyManager";
import { tileCoordsToMapCoords } from "./helpers/coordToTile";

function onClickMenuItem() {
	// Write code here that should happen when the player clicks the menu item under the map icon.

	console.log("Hello world!");
}


export function startup() {
	// Write code here that should happen on startup of the plugin.
	const cm = new CompanyManager();
	const player = network.currentPlayer
	const playerCompanyId = cm.addPlayerToCompany(player.id, 1)
	console.log(`Player ${player.id} is in company ${playerCompanyId}`)
	cm.ownershipGraph.setRangeOwner({ x: 0, y: 0 }, { x: 10, y: 10 }, playerCompanyId)
	cm.ownershipGraph.setRangeOwner({ x: 11, y: 11 }, { x: 20, y: 20 }, playerCompanyId)

	// change the surface of those tiles to show that the ownership has changed
	cm.ownershipGraph.getAllOwnedTiles(playerCompanyId).forEach(tile => {
		console.log(`hiding tile ${tile.x}, ${tile.y}`)
		const { x, y } = tileCoordsToMapCoords(tile)
		const tileElement = map.getTile(x, y).elements[0];
		tileElement.isHidden = true;
	})

	// Register a menu item under the map icon:
	if (typeof ui !== "undefined") {
		ui.registerMenuItem("My plugin", () => onClickMenuItem());
	}
}