import {
  Transfer as TransferEvent,
  BoredApeYachtClub as BoredApeYachtClubContract,
} from "../generated/BoredApeYachtClub/BoredApeYachtClub";
import { Ape, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let ape = Ape.load(event.params.tokenId.toString());
  if (!ape) {
    ape = new Ape(event.params.tokenId.toString());
    ape.creator = event.params.to.toHexString();
    ape.createdAt = event.block.timestamp;

    const contract = BoredApeYachtClubContract.bind(event.address);
    ape.contentURI = contract.tokenURI(event.params.tokenId);
  }
  ape.owner = event.params.to.toHexString();
  ape.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
